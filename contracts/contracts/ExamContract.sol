// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IExamContract.sol";

contract ExamContract is IExamContract {
    address public immutable admin;

    mapping(uint256 => Subject) public subjects;
    mapping(address => uint256) public studentIds;
    //StudentID -> (SubjectID, subjectCareer)
    mapping(uint256 => StudentCareer) public careers;

    constructor() {
        admin = msg.sender;
    }

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

    function getTestResult(
        uint256 studentId,
        uint256 subjectId,
        uint8 testIdx
    ) private view returns (TestResult storage) {
        return careers[studentId].subjectResults[subjectId].testResults[testIdx];
    }

    function addStudent(address addr, uint256 id) external onlyAdmin {
        studentIds[addr] = id;
    }

    function deleteStudent(address addr) external onlyAdmin {
        studentIds[addr] = 0;
    }

    function addSubject(
        uint256 subjectId,
        string calldata name,
        uint8 cfu,
        uint256[] calldata subjectIdRequired
    ) external onlyAdmin {
        Subject storage subject = subjects[subjectId];
        subject.name = name;
        subject.cfu = cfu;
        subject.subjectIdRequired = subjectIdRequired;
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

    function isProfAuthorized(uint256 subjectId, address profAddr) external view returns (bool) {
        return subjects[subjectId].authorizedProf[profAddr];
    }

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

    function getSubjectTests(uint256 subjectId) external view returns (Test[] memory) {
        return subjects[subjectId].tests;
    }

    function checkTestDependencies(
        uint8 subjectId,
        uint8 testIdx,
        uint256 studentId
    ) private view returns (bool) {
        uint8[] storage deps = subjects[subjectId].tests[testIdx].testIdxRequired;
        for (uint256 i = 0; i < deps.length; i++) {
            if (getTestResult(studentId, subjectId, deps[i]).testStatus != Status.Accepted) {
                return false;
            }
        }
        return true;
    }

    function registerTestResults(
        uint8 subjectId,
        uint8 testIdx,
        StudentMark[] calldata testResults
    ) external isAuthorizedProf(subjectId) testExists(subjectId, testIdx) {
        uint256 expiration = block.timestamp + subjects[subjectId].tests[testIdx].expiresIn;
        for (uint256 i = 0; i < testResults.length; i++) {
            bool valid = checkTestDependencies(subjectId, testIdx, testResults[i].studentId);
            if (!valid) {
                // TODO: Emit event student not authorized to take test
                continue;
            }
            TestResult storage result = getTestResult(testResults[i].studentId, subjectId, testIdx);
            result.mark = testResults[i].mark;
            result.testStatus = Status.Pending;
            result.expiration = expiration;
        }
    }

    function registerSubjectResults(uint8 subjectId, StudentMark[] calldata subjectResults)
        external
        isAuthorizedProf(subjectId)
    {}

    function acceptTestResult(uint8 subjectId, uint8 testIdx)
        external
        testExists(subjectId, testIdx)
    {
        uint256 studentId = studentIds[msg.sender];
        TestResult storage result = careers[studentId].subjectResults[subjectId].testResults[
            testIdx
        ];
        if (result.testStatus == Status.NoVote){
            revert TestNotTakenError(subjectId, testIdx, studentId);
        }
        if (result.testStatus == Status.Accepted) {
            revert TestAlreadyAcceptedError(subjectId, testIdx, studentId);
        }
        if (result.testStatus == Status.Rejected) {
            revert TestAlreadyRejectedError(subjectId, testIdx, studentId);
        }
        if (result.expiration > block.timestamp) {
            revert TestExpiredError(subjectId, testIdx, result.expiration);
        }
        if (result.mark < 18) {
            revert TestNotAcceptableError(subjectId, testIdx, studentId, result.mark);
        }

        //TODO: Event for test result accepted
        result.testStatus = Status.Accepted;
    }


    function rejectTestResult(uint8 subjectId, uint8 testIdx) external {
        uint256 studentId = studentIds[msg.sender];
        TestResult storage result = careers[studentId].subjectResults[subjectId].testResults[
            testIdx
        ];
        if (result.testStatus == Status.NoVote){
            revert TestNotTakenError(subjectId, testIdx, studentId);
        }
        if (result.testStatus == Status.Accepted) {
            revert TestAlreadyAcceptedError(subjectId, testIdx, studentId);
        }
        if (result.testStatus == Status.Rejected) {
            revert TestAlreadyRejectedError(subjectId, testIdx, studentId);
        }
        if (result.expiration > block.timestamp) {
            revert TestExpiredError(subjectId, testIdx, result.expiration);
        }

        //TODO: Event for test result rejected
        result.testStatus = Status.Rejected;
    }
    

    function acceptSubjectResult(uint8 subjectId) external {}

    function rejectSubjectResult(uint8 subjectId) external {}

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
}
