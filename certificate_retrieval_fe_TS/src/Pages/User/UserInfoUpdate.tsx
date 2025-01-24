import { useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "../../Apis/userApi";
import { MainLoader } from "../../Components/Page/Common";
import { useUserService } from "../../Services";
import { format } from "date-fns";
import { withAuth } from "../../HOC";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";
import { userModel } from "../../Interfaces";

const UserInfoUpdate = () => {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const navigate = useNavigate();

  const { data } = useGetUserByIdQuery(userData.id);

  const { userInputs, loading, handleUserInput, handleInfoUpdateSubmit } =
    useUserService(userData.id, data);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">Sửa thông tin cá nhân</h3>

        <form method="post" onSubmit={handleInfoUpdateSubmit}>
          <div className="row justify-content-center">
            <div className="col-md-8">
              {/* Họ và tên */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Họ và tên:</label>
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
                <label style={{ minWidth: "120px" }}>Email:</label>
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
                <label style={{ minWidth: "120px" }}>Số điện thoại:</label>
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
                <label style={{ minWidth: "120px" }}>Ngày sinh:</label>
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
              <div className="d-flex justify-content-between">
                {/* Nút quay lại */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/user/userInfo/")}
                >
                  Trở lại
                </button>

                {/* Nút xác nhận */}
                <button type="submit" className="btn btn-success">
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(UserInfoUpdate);
