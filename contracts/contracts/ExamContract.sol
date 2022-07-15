// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IExamContract.sol";
import "hardhat/console.sol";

contract ExamContract is IExamContract {
    address public immutable admin;

    //SubjectID -> Subject
    mapping(uint256 => Subject) public subjects;

    //StudentAddress -> StudentId
    mapping(address => uint256) public studentIds;

    //StudentID -> (SubjectID, subjectCareer)
    mapping(uint256 => StudentCareer) public careers;

    constructor() {
        admin = msg.sender;
    }

    //region modifiers
    modifier onlyAdmin() {
        if (msg.sender != admin) revert UnauthorizedAdminError(admin, msg.sender);
        _;
    }

    modifier isAuthorizedProf(uint256 subjectId) {
        if (!subjects[subjectId].authorizedProf[msg.sender])
            revert UnauthorizedProfessorError(subjectId, msg.sender);
        _;
    }

    modifier testExists(uint256 subjectId, uint8 testIdx) {
        if (testIdx >= subjects[subjectId].tests.length)
            revert TestDoesNotExistsError(subjectId, testIdx);
        _;
    }

    //endregion

    function isProfAuthorized(uint256 subjectId, address profAddr) external view returns (bool) {
        return subjects[subjectId].authorizedProf[profAddr];
    }

    //region onlyAdmin methods
    function addStudent(address addr, uint256 id) external onlyAdmin {
        if (studentIds[addr] != 0) {
            revert AddressAlreadyInUseError(addr);
        }
        studentIds[addr] = id;
    }

    function deleteStudent(address addr) external onlyAdmin {
        studentIds[addr] = 0;
    }

    function addSubject(
        uint256 subjectId,
        string calldata name,
        uint8 cfu,
        uint8 requiredCount,
        uint256[] calldata subjectIdToUnlock
    ) external onlyAdmin {
        Subject storage subject = subjects[subjectId];
        subject.name = name;
        subject.cfu = cfu;
        subject.requiredCount = requiredCount;
        subject.subjectIdToUnlock = subjectIdToUnlock;
    }

    function removeSubject(uint256 subjectId) external onlyAdmin {
        delete subjects[subjectId];
    }

    function addAuthorizedProf(uint256 subjectId, address profAddr) external onlyAdmin {
        subjects[subjectId].authorizedProf[profAddr] = true;
    }

    function removeAuthorizedProf(uint256 subjectId, address profAddr) external onlyAdmin {
        subjects[subjectId].authorizedProf[profAddr] = false;
    }

    //endregion

    //region getters
    function getTestResult(
        uint256 studentId,
        uint256 subjectId,
        uint8 testIdx
    ) private view returns (TestResult storage) {
        return careers[studentId].subjectResults[subjectId].testResults[testIdx];
    }

    function getTestMark(uint8 subjectId, uint8 testIdx)
        external
        view
        testExists(subjectId, testIdx)
        returns (uint8, Status)
    {
        uint256 studentId = studentIds[msg.sender];
        TestResult storage result = getTestResult(studentId, subjectId, testIdx);
        return (result.mark, result.testStatus);
    }

    function getSubjectMark(uint8 subjectId) external view returns (uint8, Status) {
        uint256 studentId = studentIds[msg.sender];
        return (
            careers[studentId].subjectResults[subjectId].mark,
            careers[studentId].subjectResults[subjectId].subjectStatus
        );
    }

    function getSubjectTests(uint256 subjectId) external view returns (Test[] memory) {
        return subjects[subjectId].tests;
    }

    //endregion

    //region test methods
    function checkTestDependencies(
        uint8 subjectId,
        uint8 testIdx,
        uint256 studentId
    ) private returns (bool) {
        uint8[] storage deps = subjects[subjectId].tests[testIdx].testIdxRequired;
        for (uint256 i = 0; i < deps.length; i++) {
            uint8 dep = deps[i];
            TestResult storage depResult = getTestResult(studentId, subjectId, dep);
            if (depResult.testStatus == Status.NoVote || depResult.expiration > block.timestamp) {
                return false;
            }
            if (depResult.testStatus == Status.Passed) {
                depResult.testStatus = Status.Accepted;
            }
        }
        return true;
    }

    function failTest(
        uint8 subjectId,
        uint8 testIdx,
        uint256 studentId
    ) private {
        uint8[] storage deps = subjects[subjectId].tests[testIdx].testIdxReset;
        for (uint8 i = 0; i < deps.length; i++) {
            TestResult storage t = getTestResult(studentId, subjectId, deps[i]);
            t.testStatus = Status.NoVote;
        }
    }

    function passTest(
        uint8 subjectId,
        uint8 testIdx,
        uint256 studentId,
        uint8 mark
    ) private {
        uint256 expiration = block.timestamp + subjects[subjectId].tests[testIdx].expiresIn;
        TestResult storage result = getTestResult(studentId, subjectId, testIdx);
        result.mark = mark;
        result.testStatus = Status.Passed;
        result.expiration = expiration;
    }

    function registerTestResults(
        uint8 subjectId,
        uint8 testIdx,
        StudentMark[] calldata testResults
    ) external isAuthorizedProf(subjectId) testExists(subjectId, testIdx) {
        uint8 minMark = subjects[subjectId].tests[testIdx].minMark;
        for (uint256 i = 0; i < testResults.length; i++) {
            if (testResults[i].mark < minMark) {
                //TODO: Emit not passed
                failTest(subjectId, testIdx, testResults[i].studentId);
            } else if (checkTestDependencies(subjectId, testIdx, testResults[i].studentId)) {
                // TODO: Emit passed
                passTest(subjectId, testIdx, testResults[i].studentId, testResults[i].mark);
            } else {
                // TODO: Emit event student not authorized to take test
            }
        }
    }

    function rejectTestResult(uint8 subjectId, uint8 testIdx) external {
        uint256 studentId = studentIds[msg.sender];
        TestResult storage result = careers[studentId].subjectResults[subjectId].testResults[
            testIdx
        ];
        if (result.testStatus == Status.Accepted) {
            revert TestAlreadyAcceptedError(subjectId, testIdx, studentId);
        }
        //TODO: Event for test result rejected
        failTest(subjectId, testIdx, studentId);
    }

    //endregion

    function setSubjectTests(uint256 subjectId, Test[] calldata tests)
        external
        isAuthorizedProf(subjectId)
    {
        Subject storage subject = subjects[subjectId];
        delete subject.tests;
        for (uint256 i = 0; i < tests.length; i++) {
            subject.tests.push(tests[i]);
        }
    }

    //region subject methods

    function checkSubjectDependencies(uint256 subjectId, uint256 studentId)
        private
        view
        returns (bool)
    {
        return (careers[studentId].subjectResults[subjectId].unlockCounter >=
            subjects[subjectId].requiredCount);
    }

    function registerSubjectResults(uint8 subjectId, StudentMark[] calldata subjectResults)
        external
        isAuthorizedProf(subjectId)
    {
        for (uint256 i = 0; i < subjectResults.length; i++) {
            bool valid = checkSubjectDependencies(subjectId, subjectResults[i].studentId);
            if (!valid) {
                //TODO: emit event subject not registrable
                continue;
            }
            careers[subjectResults[i].studentId].subjectResults[subjectId].mark = subjectResults[i]
                .mark;
        }
    }

    function acceptSubjectResult(uint8 subjectId) external {
        uint256 studentId = studentIds[msg.sender];
        SubjectResults storage subjectResult = careers[studentId].subjectResults[subjectId];
        if (subjectResult.subjectStatus == Status.NoVote) {
            revert SubjectNotAcceptableError(subjectId, studentId);
        }
        if (subjectResult.subjectStatus == Status.Accepted) {
            revert SubjectAlreadyAcceptedError(subjectId, studentId);
        }

        uint256[] storage toUnlock = subjects[subjectId].subjectIdToUnlock;
        for (uint256 i = 0; i < toUnlock.length; i++) {
            careers[studentId].subjectResults[subjectId].unlockCounter++;
        }

        //TODO: Event for subject result accepted
        subjectResult.subjectStatus = Status.Accepted;
    }

    function rejectSubjectResult(uint8 subjectId) external {
        uint256 studentId = studentIds[msg.sender];
        SubjectResults storage subjectResult = careers[studentId].subjectResults[subjectId];
        if (subjectResult.subjectStatus == Status.NoVote) {
            revert SubjectNotAcceptableError(subjectId, studentId);
        }
        if (subjectResult.subjectStatus == Status.Accepted) {
            revert SubjectAlreadyAcceptedError(subjectId, studentId);
        }

        //TODO: Event for subject result accepted
        resetSubjectResults(subjectId);
    }

    function resetSubjectResults(uint256 subjectId) internal {
        uint256 studentId = studentIds[msg.sender];
        delete careers[studentId].subjectResults[subjectId];
    }

    function resetSubject(uint256 subjectId) external {
        resetSubjectResults(subjectId);
    }
    //endregion
}
