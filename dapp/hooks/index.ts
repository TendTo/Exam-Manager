export * from "./useAsync";
export * from "./useAdmin";
export * from "./useAddStudent";
export * from "./useDeleteStudent";
export * from "./useAddSubject";
export * from "./useRemoveSubject";
export * from "./useAddAuthorizedProf";
export * from "./useRemoveAuthorizedProf";
export * from "./useIsProfAuthorized";
export * from "./useSetSubjectTests";
export * from "./useGetSubjectTests";
export * from "./useRegisterTestResults";
export * from "./useRegisterSubjectResults";
export * from "./useRejectTestResult";
export * from "./useAcceptSubjectResult";
export * from "./useResetSubject";
export * from "./useGetTestMark";
export * from "./useGetSubjectMark";
export * from "./useTestPassedLogs";
export * from "./useTestFailedLogs";


// event TestRejected(uint256 indexed subjectId, uint8 indexed testIdx, uint256 indexed studentId);
// event MissingTestRequirements(
//     uint256 indexed subjectId,
//     uint8 indexed testIdx,
//     uint256 indexed studentId
// );
// event TestResetted(uint256 indexed subjectId, uint8 indexed testIdx, uint256 indexed studentId);

// event SubjectAccepted(uint256 indexed subjectId, uint256 indexed studentId, uint8 mark);
// event SubjectResetted(uint256 indexed subjectId, uint256 indexed studentId);
// event MissingSubjectRequrements(uint256 indexed subjectId, uint256 indexed studentId);
