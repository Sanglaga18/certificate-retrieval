import { useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "../../Apis/userApi";
import { MainLoader } from "../../Components/Page/Common";
import { useUserService } from "../../Services";
import { withAuth } from "../../HOC";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";
import { userModel } from "../../Interfaces";

const UserChangePassword = () => {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const navigate = useNavigate();

  const { data } = useGetUserByIdQuery(userData.id);

  const { userInputs, loading, handleUserInput, handleChangePasswordSubmit } =
    useUserService(userData.id, data);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">Đổi Mật Khẩu</h3>

        <form method="post" onSubmit={handleChangePasswordSubmit}>
          <div className="row justify-content-center">
            <div className="col-md-8">
              {/* Mật khẩu cũ */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Mật khẩu cũ:
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu cũ"
                  required
                  name="password"
                  value={userInputs.password}
                  onChange={handleUserInput}
                />
              </div>
              {/* Mật khẩu mới */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Mật khẩu mới:
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu mới"
                  required
                  name="newPassword"
                  value={userInputs.newPassword}
                  onChange={handleUserInput}
                />
              </div>
              {/* Xác nhận mật khẩu mới */}
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2" style={{ minWidth: "120px" }}>
                  Nhập lại mật khẩu mới:
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  name="confirmPassword"
                  value={userInputs.confirmPassword}
                  onChange={handleUserInput}
                />
              </div>
              <div className="d-flex justify-content-between">
                {/* Nút quay lại */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Trở lại
                </button>

                {/* Nút xác nhận */}
                <button type="submit" className="btn btn-success">
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(UserChangePassword);
