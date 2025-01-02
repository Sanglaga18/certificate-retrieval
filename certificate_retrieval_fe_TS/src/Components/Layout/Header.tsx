import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { userModel } from "../../Interfaces";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import {
  emptyUserState,
  setLoggedInUser,
} from "../../Storage/Redux/userAuthSlice";
import { SD_Roles } from "../../Utility/SD";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setLoggedInUser({ ...emptyUserState }));
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
          <NavLink className="nav-link navbar-brand" aria-current="page" to="/">
            TraCuuCCCN
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                  Trang chủ
                </NavLink>
              </li>
              {/* <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/authentication"
                >
                  Authentication
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/authorization"
                >
                  Authorization
                </NavLink>
              </li> */}
              {userData.role === SD_Roles.STAFF && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Staff Panel
                  </a>
                  <ul className="dropdown-menu">
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() =>
                        navigate("/diplomaRegister/diplomaregisterlist")
                      }
                    >
                      Quản lý sổ cấp chứng chỉ
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("/diploma/diplomalist")}
                    >
                      Quản lý chứng chỉ
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("/exam/examlist")}
                    >
                      Quản lý kỳ thi
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("/examResult/examResultlist")}
                    >
                      Quản lý kết quả kỳ thi
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() =>
                        navigate("/certificateRegister/certificateregisterlist")
                      }
                    >
                      Quản lý sổ cấp chứng nhận
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("/certificate/certificatelist")}
                    >
                      Quản lý chứng nhận
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("/course/courselist")}
                    >
                      Quản lý khóa học
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("/enrollment/enrollmentlist")}
                    >
                      Quản lý thông tin đăng ký khóa học
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("/user/userlist/")}
                    >
                      Quản lý thông tin người dùng
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      onClick={() => navigate("/student/studentlist")}
                    >
                      Thêm sửa ảnh cho học viên
                    </li>
                  </ul>
                </li>
              )}
              <div className="d-flex" style={{ marginLeft: "auto" }}>
                {userData.id && (
                  <>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle text-white"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Chào mừng, {userData.fullName}
                      </a>
                      <ul className="dropdown-menu">
                        <li
                          style={{ cursor: "pointer" }}
                          className="dropdown-item"
                          onClick={() => navigate("/user/userInfo/")}
                        >
                          Thông tin của tôi
                        </li>
                        <li
                          style={{ cursor: "pointer" }}
                          className="dropdown-item"
                          onClick={() => navigate("/user/userChangePassword/")}
                        >
                          Đổi mật khẩu
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </>
                )}
                {!userData.id && (
                  <>
                    <li className="nav-item text-white">
                      <NavLink className="nav-link" to="/register">
                        Đăng ký
                      </NavLink>
                    </li>
                    <li className="nav-item text-white">
                      <NavLink
                        className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                        style={{
                          border: "none",
                          height: "40px",
                          width: "120px",
                        }}
                        to="/login"
                      >
                        Đăng nhập
                      </NavLink>
                    </li>
                  </>
                )}
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
