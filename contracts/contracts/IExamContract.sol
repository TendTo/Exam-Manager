// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IExamContract {
    enum Status {
        NoVote,
        Pending,
        Accepted,
        Rejected
    }

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
        Status testStatus;
        uint256 expiration;
    }

    struct StudentCareer {
        uint256 studentId;
        //SubjectID -> SubjectResults
        mapping(uint256 => SubjectResults) subjectResults;
    }

    struct SubjectResults {
        uint8 mark;
        Status subjectStatus;
        mapping(uint8 => TestResult) testResults;
    }

    error UnauthorizedProfessorError(uint256 subjectId, address unauthorizedAddr);
    error UnauthorizedAdminError(address admin, address unauthorizedAdmin);

    error TestDoesNotExistsError(uint256 subjectId, uint8 testIdx);
    error TestExpiredError(uint256 subjectId, uint8 testIdx, uint256 expiration);

    error TestNotTakenError(uint256 subjectId, uint8 testIdx, uint256 studentId);
    error TestNotAcceptableError(uint256 subjectId, uint8 testIdx, uint256 studentId, uint8 mark);
    error TestAlreadyAcceptedError(uint256 subjectId, uint8 testIdx, uint256 studentId);
    error TestAlreadyRejectedError(uint256 subjectId, uint8 testIdx, uint256 studentId);

    error SubjectNotAcceptableError(uint256 subjectId, uint256 studentId);
    error SubjectAlreadyAcceptedError(uint256 subjectId, uint256 studentId);
    error SubjectAlreadyRejectedError(uint256 subjectId, uint256 studentId);

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

    function removeAuthorizedProf(uint256 subjectId, address profAddr) external;

    function isProfAuthorized(uint256 subjectId, address profAddr) external view returns (bool);

    function setSubjectTests(uint256 subjectId, Test[] calldata tests) external;

    function getSubjectTests(uint256 subjectId) external view returns (Test[] memory);

    function registerTestResults(
        uint8 subjectId,
        uint8 testIdx,
        StudentMark[] calldata testResults
    ) external;

    function registerSubjectResults(uint8 subjectId, StudentMark[] calldata subjectResults)
        external;

    function acceptTestResult(uint8 subjectId, uint8 testIdx) external;

    function rejectTestResult(uint8 subjectId, uint8 testIdx) external;

    function acceptSubjectResult(uint8 subjectId) external;

    function rejectSubjectResult(uint8 subjectId) external;

    function getTestMark(uint8 subjectId, uint8 testIdx) external view returns (uint8, Status);

    function getSubjectMark(uint8 subjectId) external view returns (uint8, Status);
}
