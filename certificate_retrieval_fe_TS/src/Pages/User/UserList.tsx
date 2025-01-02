import { MainLoader } from "../../Components/Page/Common";
import { userInfoModel } from "../../Interfaces";
import { useGetUserQuery } from "../../Apis/userApi";
import { useNavigate } from "react-router";
import { useUserService } from "../../Services";
import { withAdminAuth } from "../../HOC";
import { format } from "date-fns";

function UserList() {
  const { data, isLoading } = useGetUserQuery(null);
  const navigate = useNavigate();
  const { handleResetPassword } = useUserService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách người dùng</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/user/userCreate/")}
            >
              Thêm người dùng mới
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col">Tên tài khoản</div>
              <div className="col-2">Họ và tên</div>
              <div className="col-2">Email</div>
              <div className="col">Số điện thoại</div>
              <div className="col">Ngày sinh</div>
              <div className="col">Loại tài khoản</div>
              <div className="col">Trạng thái</div>
              <div className="col">Cập nhật</div>
              <div className="col">Reset mật khẩu</div>
            </div>
            {data.result.map((user: userInfoModel) => {
              return (
                <div className="row border" key={user.userID}>
                  <div className="col-1">{user.userID}</div>
                  <div className="col">{user.username}</div>
                  <div className="col-2">{user.fullName}</div>
                  <div className="col-2">{user.email}</div>
                  <div className="col">{user.phone}</div>
                  <div className="col">
                    {user.dateOfBirth &&
                      format(new Date(user.dateOfBirth), "dd/MM/yyyy")}
                  </div>
                  <div className="col">
                    {user.roleID === 1 && "Member"}
                    {user.roleID === 2 && "Student"}
                    {user.roleID === 3 && "Teacher"}
                    {user.roleID === 4 && "Staff"}
                  </div>
                  <div className="col">
                    {user.isActive === true ? "Đã duyệt" : "Chưa duyệt"}
                  </div>
                  <div className="col">
                    <button className="btn btn-success">
                      <i
                        className="bi bi-pencil-fill"
                        onClick={() =>
                          navigate("/user/userUpdate/" + user.userID)
                        }
                      ></i>
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleResetPassword(user.userID)}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
export default withAdminAuth(UserList);
