import { useNavigate } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { useDiplomaService } from "../../Services";
import { format } from "date-fns";
import { useGetDiplomaByIdQuery } from "../../Apis/diplomaApi";
import { withAdminAuth } from "../../HOC";
import { userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";

const DiplomaUpsert = () => {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const encodeSpecialChars = (input: string) => {
    return encodeURIComponent(input);
  };

  const id = useSelector(
    (state: RootState) => state.diplomaStore.diplomaNumber
  );

  const encodedId = id ? encodeSpecialChars(id) : undefined;

  const navigate = useNavigate();

  const { data } = useGetDiplomaByIdQuery(
    encodedId ? { id: encodedId, userID: userData.id } : skipToken
  );

  const {
    diplomaInputs,
    loading,
    imageToDisplay,
    studentInfo,
    handleDiplomaInput,
    handleExamResultIDChange,
    handleFileChange,
    handleSubmit,
  } = useDiplomaService(id, data);

  return (
    <div className="container mt-5 p-5">
      {loading && <MainLoader />}
      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">
          {id ? "Sửa thông tin chứng chỉ" : "Thêm thông tin chứng chỉ"}
        </h3>
        <form
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="row mt-3">
            <div className="col-md-5 offset-2">
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Số hiệu:
                </label>
                <input
                  type="text"
                  className="form-control ms-2"
                  placeholder="Nhập số hiệu"
                  required
                  name="diplomaNumber"
                  value={diplomaInputs.diplomaNumber}
                  onChange={handleDiplomaInput}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Số vào sổ lưu:
                </label>
                <input
                  type="text"
                  className="form-control ms-2"
                  placeholder="Nhập số vào sổ lưu"
                  required
                  name="registryNumber"
                  value={diplomaInputs.registryNumber}
                  onChange={handleDiplomaInput}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Mã sổ lưu chứng chỉ:
                </label>
                <input
                  type="text"
                  className="form-control ms-2 ms-2"
                  placeholder="Nhập mã sổ lưu chứng chỉ"
                  required
                  name="diplomaRegisterID"
                  value={diplomaInputs.diplomaRegisterID}
                  onChange={handleDiplomaInput}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Mã kết quả thi:
                </label>
                <input
                  type="text"
                  className="form-control ms-2"
                  placeholder="Nhập mã kết quả thi"
                  required
                  name="examResultID"
                  value={diplomaInputs.examResultID}
                  onChange={handleExamResultIDChange}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Tên chứng chỉ:
                </label>
                <input
                  type="text"
                  className="form-control ms-2"
                  placeholder="Nhập tên chứng chỉ"
                  required
                  name="diplomaName"
                  value={diplomaInputs.diplomaName}
                  onChange={handleDiplomaInput}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Ngày cấp:
                </label>
                <input
                  type="date"
                  className="form-control ms-2"
                  placeholder="Nhập ngày cấp"
                  name="issueDate"
                  value={
                    diplomaInputs.issueDate
                      ? format(diplomaInputs.issueDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={handleDiplomaInput}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Hiệu lực:
                </label>
                <select
                  className="form-control ms-2 form-select"
                  required
                  name="isValid"
                  value={diplomaInputs.isValid}
                  onChange={handleDiplomaInput}
                >
                  <option value="true">Còn hiệu lực</option>
                  <option value="false">Hết hiệu lực</option>
                </select>
              </div>

              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Tổ chức cấp:
                </label>
                <input
                  type="text"
                  className="form-control ms-2 mt-3"
                  placeholder="Nhập tổ chức cấp"
                  required
                  name="issuingOrganization"
                  value={diplomaInputs.issuingOrganization}
                  onChange={handleDiplomaInput}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Mô tả:
                </label>
                <textarea
                  className="form-control ms-2"
                  placeholder="Nhập mô tả"
                  name="description"
                  value={diplomaInputs.description}
                  onChange={handleDiplomaInput}
                ></textarea>
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Hình chứng chỉ:
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-control ms-2"
                />
              </div>

              <div className="row mt-4">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-secondary w-50"
                    onClick={() => navigate("/diploma/diplomalist")}
                  >
                    Trở lại
                  </button>
                </div>
                <div className="col-6 text-end">
                  <button type="submit" className="btn btn-success w-100">
                    {id ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-5 mt-3">
              <div>
                <div className="d-flex align-items-center">
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
              <div className="mt-3">
                <img
                  src={imageToDisplay}
                  style={{ width: "100%", borderRadius: "10px" }}
                  alt=""
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAdminAuth(DiplomaUpsert);
