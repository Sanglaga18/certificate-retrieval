import { useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "../../Apis/userApi";
import { MainLoader } from "../../Components/Page/Common";
import { useUserService } from "../../Services";
import { format } from "date-fns";
import { withAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";

const UserInfo = () => {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const navigate = useNavigate();

  const { data } = useGetUserByIdQuery(userData.id);

  const { userInputs, loading } = useUserService(userData.id, data);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">Thông tin người dùng</h3>

        <div className="row justify-content-center">
          <div className="col-md-9">
            {/* Bọc thông tin trong khung có viền */}
            <div className="p-3 border border-primary rounded">
              {/* Tên tài khoản */}
              <div className="offset-1">
                <div className="mb-3 d-flex align-items-center">
                  <label className="me-2 fw-bold" style={{ minWidth: "120px" }}>
                    Tên tài khoản:
                  </label>
                  <div>{userInputs.username}</div>
                </div>
                {/* Họ và tên */}
                <div className="mb-3 d-flex align-items-center">
                  <label className="me-2 fw-bold" style={{ minWidth: "120px" }}>
                    Họ và tên:
                  </label>
                  <div>{userInputs.fullName}</div>
                </div>
                {/* Email */}
                <div className="mb-3 d-flex align-items-center">
                  <label className="me-2 fw-bold" style={{ minWidth: "120px" }}>
                    Email:
                  </label>
                  <div>{userInputs.email}</div>
                </div>
                {/* Phone */}
                <div className="mb-3 d-flex align-items-center">
                  <label className="me-2 fw-bold" style={{ minWidth: "120px" }}>
                    Số điện thoại:
                  </label>
                  <div>{userInputs.phone}</div>
                </div>
                {/* Ngày sinh */}
                <div className="mb-3 d-flex align-items-center">
                  <label className="me-2 fw-bold" style={{ minWidth: "120px" }}>
                    Ngày sinh:
                  </label>
                  <div>
                    {userInputs.dateOfBirth
                      ? format(userInputs.dateOfBirth, "yyyy-MM-dd")
                      : ""}
                  </div>
                </div>
                {/* Trạng thái */}
                <div className="d-flex align-items-center">
                  <label className="me-2 fw-bold" style={{ minWidth: "120px" }}>
                    Trạng thái:
                  </label>
                  <div>
                    {userInputs.isActive === "true" ? "Đã duyệt" : "Chưa duyệt"}
                  </div>
                </div>
              </div>
            </div>

            {/* Hai nút button nằm dưới viền */}
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
              >
                Trở lại
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => navigate("/user/userInfoUpdate/")}
              >
                Cập nhật thông tin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(UserInfo);
