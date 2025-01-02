import { Route, Routes } from "react-router-dom";
import { Header, Footer } from "../Components/Layout";
import {
  AccessDenied,
  AccountPendingApproval,
  AuthenticationTest,
  AuthenticationTestAdmin,
  CertificateInfo,
  CertificateList,
  CertificateRegisterList,
  CertificateRegisterUpsert,
  CertificateUpsert,
  CourseList,
  CourseUpsert,
  DiplomaInfo,
  DiplomaList,
  DiplomaRegisterList,
  DiplomaRegisterUpsert,
  DiplomaUpsert,
  EnrollmentList,
  EnrollmentUpsert,
  ExamList,
  ExamResultList,
  ExamResultUpsert,
  ExamUpsert,
  Home,
  Login,
  NotFound,
  Register,
  StudentList,
  StudentUpdate,
  UserChangePassword,
  UserCreate,
  UserInfo,
  UserInfoUpdate,
  UserList,
  UserUpdate,
} from "../Pages";
import { userModel } from "../Interfaces";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role }: userModel = jwt_decode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
    }
  }, []);

  return (
    <div className="text-success d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-grow-1 pb-5">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/authentication"
            element={<AuthenticationTest />}
          ></Route>
          <Route
            path="/authorization"
            element={<AuthenticationTestAdmin />}
          ></Route>
          <Route path="/accessDenied" element={<AccessDenied />} />
          <Route
            path="/diplomaRegister/diplomaregisterlist"
            element={<DiplomaRegisterList />}
          />
          <Route
            path="/diplomaRegister/diplomaregisterUpsert/:id"
            element={<DiplomaRegisterUpsert />}
          />
          <Route
            path="/diplomaRegister/diplomaregisterUpsert"
            element={<DiplomaRegisterUpsert />}
          />
          <Route
            path="/certificateRegister/certificateregisterlist"
            element={<CertificateRegisterList />}
          />
          <Route
            path="/certificateRegister/certificateregisterUpsert/:id"
            element={<CertificateRegisterUpsert />}
          />
          <Route
            path="/certificateRegister/certificateregisterUpsert"
            element={<CertificateRegisterUpsert />}
          />
          <Route path="/course/courselist" element={<CourseList />} />
          <Route path="/course/courseUpsert/:id" element={<CourseUpsert />} />
          <Route path="/course/courseUpsert" element={<CourseUpsert />} />
          <Route path="/exam/examlist" element={<ExamList />} />
          <Route path="/exam/examUpsert/:id" element={<ExamUpsert />} />
          <Route path="/exam/examUpsert" element={<ExamUpsert />} />
          <Route
            path="/enrollment/enrollmentlist"
            element={<EnrollmentList />}
          />
          <Route
            path="/enrollment/enrollmentUpsert/:id"
            element={<EnrollmentUpsert />}
          />
          <Route
            path="/enrollment/enrollmentUpsert"
            element={<EnrollmentUpsert />}
          />
          <Route
            path="/examResult/examResultlist"
            element={<ExamResultList />}
          />
          <Route
            path="/examResult/examResultUpsert/:id"
            element={<ExamResultUpsert />}
          />
          <Route
            path="/examResult/examResultUpsert/"
            element={<ExamResultUpsert />}
          />
          <Route
            path="/certificate/certificatelist"
            element={<CertificateList />}
          />
          <Route
            path="/certificate/certificateinfo/:id"
            element={<CertificateInfo />}
          />
          <Route
            path="/certificate/certificateUpsert/:id"
            element={<CertificateUpsert />}
          />
          <Route
            path="/certificate/certificateUpsert"
            element={<CertificateUpsert />}
          />
          <Route path="/diploma/diplomalist" element={<DiplomaList />} />
          <Route path="/diploma/diplomaInfo/:id" element={<DiplomaInfo />} />
          <Route
            path="/diploma/diplomaUpsert/:id"
            element={<DiplomaUpsert />}
          />
          <Route path="/diploma/diplomaUpsert/" element={<DiplomaUpsert />} />
          <Route path="/user/userlist/" element={<UserList />} />
          <Route path="/user/userUpdate/:id" element={<UserUpdate />} />
          <Route path="/user/userCreate/" element={<UserCreate />} />
          <Route path="/user/userInfo/" element={<UserInfo />} />
          <Route path="/user/userInfoUpdate/" element={<UserInfoUpdate />} />
          <Route
            path="/user/userChangePassword/"
            element={<UserChangePassword />}
          />
          <Route path="/student/studentlist" element={<StudentList />} />
          <Route
            path="/student/studentUpdate/:id"
            element={<StudentUpdate />}
          />
          <Route path="*" element={<NotFound />}></Route>
          <Route
            path="/account-pending-approval"
            element={<AccountPendingApproval />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
