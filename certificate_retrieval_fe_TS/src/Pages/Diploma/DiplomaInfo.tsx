import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { useDiplomaService } from "../../Services";
import { format } from "date-fns";
import { useGetDiplomaByIdQuery } from "../../Apis/diplomaApi";
import { withAuth } from "../../HOC";
import { userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";

const DiplomaInfo = () => {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const encodeSpecialChars = (input: string) => {
    return encodeURIComponent(input);
  };

  // const id = useSelector(
  //   (state: RootState) => state.diplomaStore.diplomaNumber
  // );
  const { id } = useParams();
  //console.log(id);
  const encodedId = id ? encodeSpecialChars(id) : undefined;
  const navigate = useNavigate();

  const { data } = useGetDiplomaByIdQuery({
    id: encodedId,
    userID: userData.id,
  });

  const { diplomaInputs, loading, imageToDisplay, studentInfo } =
    useDiplomaService(id, data);

  return (
    <div className="container mt-5 p-5">
      {loading && <MainLoader />}
      {/* Kiểm tra nếu mã lỗi là 403 */}
      {data?.statusCode === 403 ? (
        <div className="alert alert-danger text-center mb-4">
          Bạn không có quyền truy cập chứng chỉ này.
        </div>
      ) : (
        <div className="card shadow border p-4">
          <h3 className="text-center text-primary mb-4">Thông tin chứng chỉ</h3>
          <div className="row mt-3">
            <div className="col-md-6 offset-1 ">
              <div className="p-4 border border-primary rounded-4 shadow">
                <div className=" d-flex align-items-center">
                  <label className="me-2 fw-bold">Số hiệu:</label>
                  <div>{diplomaInputs.diplomaNumber}</div>
                </div>
                <div className="mt-3 d-flex align-items-center">
                  <label className="me-2 fw-bold">Số vào sổ lưu:</label>
                  <div>{diplomaInputs.registryNumber}</div>
                </div>
                {/* <div className="mt-3 d-flex align-items-center">
                  <label className="me-2 fw-bold">Mã sổ lưu chứng chỉ:</label>
                  <div>{diplomaInputs.diplomaRegisterID}</div>
                </div>
                <div className="mt-3 d-flex align-items-center">
                  <label className="me-2 fw-bold">Mã kết quả:</label>
                  <div>{diplomaInputs.examResultID}</div>
                </div> */}
                <div className="mt-3 d-flex align-items-center">
                  <label className="me-2 fw-bold">Tên chứng chỉ:</label>
                  <div>{diplomaInputs.diplomaName}</div>
                </div>
                <div className="mt-3 d-flex align-items-center">
                  <label className="me-2 fw-bold">Ngày cấp:</label>
                  <div>
                    {diplomaInputs.issueDate
                      ? format(diplomaInputs.issueDate, "yyyy-MM-dd")
                      : ""}
                  </div>
                </div>
                <div className="mt-3 d-flex align-items-center">
                  <label className="me-2 fw-bold">Trạng thái:</label>
                  <div>
                    {diplomaInputs.isValid === "true"
                      ? "Còn hiệu lực"
                      : "Hết hiệu lực"}
                  </div>
                </div>
                <div className="mt-3 d-flex align-items-center">
                  <label className="me-2 fw-bold">Tổ chức cấp:</label>
                  <div>{diplomaInputs.issuingOrganization}</div>
                </div>
                <div className="mt-3 d-flex align-items-center">
                  <label className="me-2 fw-bold">Mô tả:</label>
                  <div>{diplomaInputs.description}</div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12 d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary w-50"
                    onClick={() => navigate("/")}
                  >
                    Trở lại
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-5 border border-primary rounded-2 shadow">
              <div>
                <div className="mt-3 d-flex align-items-center">
                  <div className="me-2 fw-bold">Họ tên học viên:</div>
                  <div>{studentInfo?.fullName || ""}</div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2 fw-bold">Mã số học viên:</div>
                  <div>{studentInfo?.studentID || ""}</div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2 fw-bold">Kỳ thi:</div>
                  <div>{studentInfo?.examName || ""}</div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2 fw-bold">Điểm số:</div>
                  <div>{studentInfo?.marksObtained || ""}</div>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <label className="fw-bold">Ảnh học viên:</label>
                  <img
                    className="img-fluid"
                    style={{ maxHeight: "175px" }}
                    src={studentInfo?.image}
                    alt=""
                  />
                </div>
                <div className="col-8">
                  <label className="fw-bold">Ảnh CCCD:</label>
                  <img
                    className="img-fluid"
                    style={{ maxHeight: "175px" }}
                    src={studentInfo?.frontIdCard}
                    alt=""
                  />
                </div>
              </div>
              <div className="mt-3 mb-3">
                <img
                  src={imageToDisplay}
                  style={{ width: "100%", borderRadius: "10px" }}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(DiplomaInfo);
