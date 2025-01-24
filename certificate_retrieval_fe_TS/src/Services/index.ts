import { useDiplomaRegisterService } from "./DiplomaRegisterService/diplomaRegisterService";
import { useCertificateRegisterService } from "./CertificateRegisterService/CertificateRegisterService";
import { useCourseService } from "./CourseService/courseService";
import { useEnrollmentService } from "./EnrollmentService/enrollmentService";
import { useCertificateService } from "./CertificateService/certificateService";
import { useExamService } from "./ExamService/examService";
import { useExamResultService } from "./ExamResult/ExamResultService";
import { useDiplomaService } from "./DiplomaService/diplomaService";
import { useUserService } from "./UserService/userService";
import { useStudentService } from "./StudentService/studentService";
import { useLoginService } from "./LoginService/loginService";
import { useHomeService } from "./HomeService/homeService";
import { useRegisterService } from "./RegisterService/registerService";
import {
  useFetchStudentInfoByEnrollmentID,
  useFetchStudentInfoByExamResultID,
} from "./StudentInfoService/studentInfoService";

export {
  useDiplomaRegisterService,
  useCertificateRegisterService,
  useCourseService,
  useEnrollmentService,
  useCertificateService,
  useExamService,
  useExamResultService,
  useDiplomaService,
  useUserService,
  useStudentService,
  useLoginService,
  useHomeService,
  useRegisterService,
  useFetchStudentInfoByEnrollmentID,
  useFetchStudentInfoByExamResultID,
};
