// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IExamContract.sol";

contract ExamContract is IExamContract {
    address immutable public admin;

    mapping(uint256 => Subject) public subjects;
    mapping(address => uint256) public studentIds;
    //StudentID -> (SubjectID, subjectCareer)
    mapping(uint256 => StudentCareer) careers;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier isAuthorizedProf(uint256 subjectId) {
        require(subjects[subjectId].authorizedProf[msg.sender]);
        _;
    }

    function getTestResult(uint256 studentId, uint256 subjectId, uint8 testIdx) private view returns (TestResult storage) {
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

    function addAuthorizedProf(uint256 subjectId,address profAddr) external onlyAdmin {
        subjects[subjectId].authorizedProf[profAddr] = true;
    }

    function removeAuthorizedProf(uint256 subjectId,address profAddr) external onlyAdmin {
        subjects[subjectId].authorizedProf[profAddr] = false;
    }

    function isProfAuthorized(uint256 subjectId,address profAddr) external view returns (bool) {
        return subjects[subjectId].authorizedProf[profAddr];
    }

    function setSubjectTests(uint256 subjectId, Test[] calldata tests) external isAuthorizedProf(subjectId)
    {
        for(uint i = 0; i< tests.length; i++) {
            subjects[subjectId].tests[i] = tests[i];
        }

    }

    function getSubjectTests(uint256 subjectId)
        external
        view
        returns (Test[] memory)
    {
        return subjects[subjectId].tests;
    }

    function checkTestDependencies(uint8 subjectId, uint8 testIdx,uint256 studentId) private view returns (bool) {
        uint8[] storage deps = subjects[subjectId].tests[testIdx].testIdxRequired;
        for (uint i = 0; i < deps.length; i++) {
            if (!getTestResult(studentId, subjectId, deps[i]).accepted) {
                return false;
            }
        }
        return true;
    }

    function registerTestResults(
        uint8 subjectId,
        uint8 testIdx,
        StudentMark[] calldata testResults
    ) external isAuthorizedProf(subjectId) {
        uint256 expiration = block.timestamp + subjects[subjectId].tests[testIdx].expiresIn;
        for (uint256 i = 0; i < testResults.length; i++) {
            bool valid = checkTestDependencies(subjectId, testIdx, testResults[i].studentId);
            if (!valid) {
                // Emit event student not authorized to take test
                continue;
            }
            TestResult storage result = getTestResult(testResults[i].studentId, subjectId, testIdx);
            result.mark = testResults[i].mark;
            result.accepted = false;
            result.expiration = expiration;
        }
    }

    function registerSubjectResults(uint8 subjectId,StudentMark[] calldata subjectResults) external{}

    function acceptTestResult(uint8 subjectId, uint8 testIdx) external{}

    function rejectTestResult(uint8 subjectId, uint8 testIdx) external{}

    function acceptSubjectResult(uint8 subjectId) external{}

    function rejectSubjectResult(uint8 subjectId) external{}
}
