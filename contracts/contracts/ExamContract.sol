// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IExamContract.sol";

contract ExamContract is IExamContract {
    address immutable admin;

    mapping(uint256 => Subject) subjects;
    mapping(address => uint256) public studentId;
    //StudentID -> (SubjectID, subjectCareer)
    mapping(uint256 => mapping(uint256 => SubjectResults)) careers;

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

    function addStudent(address addr, uint256 id) external onlyAdmin {
        studentId[addr] = id;
    }

    function deleteStudent(address addr) external onlyAdmin {
        studentId[addr] = 0;
    }

    function addSubject(
        uint256 subjectId,
        string calldata name,
        uint8 cfu
    ) external onlyAdmin {
        Subject storage subject = subjects[subjectId];
        subject.name = name;
        subject.cfu = cfu;
    }

    function removeSubject(uint256 subjectId) external onlyAdmin {
        delete subjects[subjectId];
    }

    function addAuthorizedProf(uint256 subjectId) external onlyAdmin {
        subjects[subjectId].authorizedProf[msg.sender] = true;
    }

    function removeAuthorizedProf(uint256 subjectId) external onlyAdmin {
        subjects[subjectId].authorizedProf[msg.sender] = false;
    }

    function setSubjectTests(uint256 subjectId, Test[] calldata tests)
        external
        isAuthorizedProf(subjectId)
    {
        subjects[subjectId].tests = tests;
    }

    function getSubjectTests(uint256 subjectId)
        external
        view
        returns (Test[] memory)
    {
        return subjects[subjectId].tests;
    }

    function checkTestDependencies() private{
        
    }

    function registerTestResults(
        uint8 subjectId,
        uint8 testIdx,
        StudentMark[] calldata testResults
    ) external isAuthorizedProf(subjectId) {
        uint256 expiration = block.timestamp + subjects[subjectId].tests[testIdx].expiresIn;
        for (uint256 i = 0; i < testResults.length; i++) {
            bool valid = checkTestDependencies(subjectId, testIdx, testResults[i].studentId);
            careers[studentId[msg.sender]][subjectId].testResults[testIdx] = TestResult(testResults[i].mark, false, expiration);
        }
    }

    function registerSubjectResults(uint8 subjectId,StudentMark[] calldata subjectResults) external;
}
