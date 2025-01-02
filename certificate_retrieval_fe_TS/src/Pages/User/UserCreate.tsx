import { useNavigate } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { useUserService } from "../../Services";
import { format } from "date-fns";
import { withAdminAuth } from "../../HOC";

const UserCreate = () => {
  const navigate = useNavigate();

  const { userInputs, loading, handleUserInput, handleCreateSubmit } =
    useUserService(undefined, undefined);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">Thêm người dùng</h3>

        <form method="post" onSubmit={handleCreateSubmit}>
          <div className="row justify-content-center">
            <div className="col-md-8">
              {/* Tên tài khoản */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Tên tài khoản:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên tài khoản"
                  required
                  name="username"
                  value={userInputs.username}
                  onChange={handleUserInput}
                />
              </div>
              {/* Mật khẩu */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu"
                  required
                  name="newPassword"
                  value={userInputs.newPassword}
                  onChange={handleUserInput}
                />
              </div>
              {/* Nhập lại mật khẩu */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Nhập lại mật khẩu:
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  required
                  name="confirmPassword"
                  value={userInputs.confirmPassword}
                  onChange={handleUserInput}
                />
              </div>
              {/* Họ tên */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Họ và tên:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Họ và tên"
                  required
                  name="fullName"
                  value={userInputs.fullName}
                  onChange={handleUserInput}
                />
              </div>
              {/* Email */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  required
                  name="email"
                  value={userInputs.email}
                  onChange={handleUserInput}
                />
              </div>
              {/* Phone */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Số điện thoại:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Số điện thoại"
                  name="phone"
                  value={userInputs.phone}
                  onChange={handleUserInput}
                />
              </div>
              {/* Ngày sinh */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Ngày sinh:
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Ngày sinh"
                  required
                  name="dateOfBirth"
                  value={
                    userInputs.dateOfBirth
                      ? format(userInputs.dateOfBirth, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={handleUserInput}
                />
              </div>
              {/* Loại người dùng */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Loại người dùng:
                </label>
                <select
                  className="form-control form-select"
                  required
                  name="roleID"
                  value={userInputs.roleID}
                  onChange={handleUserInput}
                >
                  <option value="1">Member</option>
                  <option value="2">Student</option>
                  <option value="3">Teacher</option>
                  <option value="4">Staff</option>
                </select>
              </div>
              {/* Trạng thái */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Trạng thái:
                </label>
                <select
                  className="form-control form-select"
                  required
                  name="isActive"
                  value={userInputs.isActive}
                  onChange={handleUserInput}
                >
                  <option value="true">Đã duyệt</option>
                  <option value="false">Chưa duyệt</option>
                </select>
              </div>
              <div className="d-flex justify-content-between">
                {/* Nút quay lại */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/user/userlist")}
                >
                  Trở lại
                </button>

                {/* Nút xác nhận */}
                <button type="submit" className="btn btn-success">
                  Thêm người dùng
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAdminAuth(UserCreate);
