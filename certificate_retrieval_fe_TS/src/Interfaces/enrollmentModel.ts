export default interface enrollmentModel {
  enrollmentID: number;
  studentID: string;
  courseID: number;
  enrollmentDate: Date;
  finalTestScore?: number;
}
