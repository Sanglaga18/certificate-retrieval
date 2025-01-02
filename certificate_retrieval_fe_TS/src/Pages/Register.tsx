import { MainLoader } from "../Components/Page/Common";
import { format } from "date-fns";
import { useRegisterService } from "../Services";

function Register() {
  const { userInput, loading, handleUserInput, handleSubmit } =
    useRegisterService();

  return (
    <div className="container text-center">
      {loading && <MainLoader />}
      <h1 className="mt-5 mb-4">Đăng ký tài khoản</h1>
      <form method="post" onSubmit={handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            {/* Tên tài khoản */}
            <div className="mb-3 d-flex align-items-center">
              <label className="me-2 text-start" style={{ minWidth: "120px" }}>
                Tên tài khoản:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Tên tài khoản"
                required
                name="username"
                value={userInput.username}
                onChange={handleUserInput}
              />
            </div>
            {/* Mật khẩu */}
            <div className="mb-3 d-flex align-items-center">
              <label className="me-2 text-start" style={{ minWidth: "120px" }}>
                Mật khẩu:
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Mật khẩu"
                required
                name="password"
                value={userInput.password}
                onChange={handleUserInput}
              />
            </div>
            {/* Nhập lại mật khẩu */}
            <div className="mb-3 d-flex align-items-center">
              <label className="me-2 text-start" style={{ minWidth: "120px" }}>
                Nhập lại mật khẩu:
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập lại mật khẩu"
                required
                name="confirmPassword"
                value={userInput.confirmPassword}
                onChange={handleUserInput}
              />
            </div>
            {/* Họ tên */}
            <div className="mb-3 d-flex align-items-center">
              <label className="me-2 text-start" style={{ minWidth: "120px" }}>
                Họ và tên:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Họ và tên"
                required
                name="fullName"
                value={userInput.fullName}
                onChange={handleUserInput}
              />
            </div>
            {/* Email */}
            <div className="mb-3 d-flex align-items-center">
              <label className="me-2 text-start" style={{ minWidth: "120px" }}>
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                name="email"
                value={userInput.email}
                onChange={handleUserInput}
              />
            </div>
            {/* Phone */}
            <div className="mb-3 d-flex align-items-center">
              <label className="me-2 text-start" style={{ minWidth: "120px" }}>
                Số điện thoại:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Số điện thoại"
                name="phone"
                value={userInput.phone}
                onChange={handleUserInput}
              />
            </div>
            {/* Ngày sinh */}
            <div className="mb-3 d-flex align-items-center">
              <label className="me-2 text-start" style={{ minWidth: "120px" }}>
                Ngày sinh:
              </label>
              <input
                type="date"
                className="form-control"
                placeholder="Ngày sinh"
                required
                name="dateOfBirth"
                value={
                  userInput.dateOfBirth
                    ? format(userInput.dateOfBirth, "yyyy-MM-dd")
                    : ""
                }
                onChange={handleUserInput}
              />
            </div>

            <div className="d-flex justify-content-center">
              {/* Nút xác nhận */}
              <button
                type="submit"
                className="btn btn-success"
                style={{ width: "35%" }}
                disabled={loading}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default Register;
