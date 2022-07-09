// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IExamContract {

    struct StudentMark {
        uint256 studentId;
        uint8 mark;
    }
    struct Test {
        string name;
        uint256 expiresIn;
        bool optional;
        uint8[] testIdxRequired;
    }

    struct Subject {
        string name;
        uint8 cfu;
        Test[] tests;
        mapping(address => bool) authorizedProf;
        uint256[] subjectIdRequired;
    }

    struct TestResult {
        uint8 mark;
        bool accepted;
        uint256 expiration;
    }

    struct StudentCareer{
        uint studentId;
        //SubjectID -> SubjectResults
        mapping(uint256 => SubjectResults) subjectResults;
    }

    struct SubjectResults {
        uint8 mark;
        bool accepted;
        TestResult[] testResults;
    }

    function addStudent(address addr, uint256 id) external;

    function deleteStudent(address addr) external;

    function addSubject(
        uint256 id,
        string calldata name,
        uint8 cfu,
        uint256[] calldata subjectIdRequired
    ) external;

    function removeSubject(uint256 subjectId) external;

    function addAuthorizedProf(uint256 subjectId, address profAddr) external;

    function removeAuthorizedProf(uint256 subjectId,address profAddr) external;

    function isProfAuthorized(uint256 subjectId,address profAddr) external view returns (bool);

    function setSubjectTests(uint256 subjectId, Test[] calldata tests) external;

    function getSubjectTests(uint256 subjectId) external view returns(Test[] memory);

    function registerTestResults(
        uint8 subjectId,
        uint8 testIdx,
        StudentMark[] calldata testResults
    ) external;

    function registerSubjectResults(
        uint8 subjectId,
        StudentMark[] calldata subjectResults
    ) external;

    function acceptTestResult(uint8 subjectId, uint8 testIdx) external;

    function rejectTestResult(uint8 subjectId, uint8 testIdx) external;

    function acceptSubjectResult(uint8 subjectId) external;

    function rejectSubjectResult(uint8 subjectId) external;
}
