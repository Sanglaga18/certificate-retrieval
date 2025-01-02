import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { useCertificateService } from "../../Services";
import { format } from "date-fns";
import { useGetCertificateByIdQuery } from "../../Apis/certificateApi";
import { withAdminAuth } from "../../HOC";
import { userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector } from "react-redux";

const CertificateUpsert = () => {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const encodeSpecialChars = (input: string) => {
    return encodeURIComponent(input);
  };

  const id = useSelector(
    (state: RootState) => state.certificateStore.certificateID
  );

  //const { id } = useParams();
  //console.log(id);

  const encodedId = id ? encodeSpecialChars(id) : undefined;

  const navigate = useNavigate();

  const { data } = useGetCertificateByIdQuery({
    id: encodedId,
    userID: userData.id,
  });
  //console.log(data);

  const {
    certificateInputs,
    loading,
    imageToDisplay,
    studentInfo,
    handleCertificateInput,
    handleEnrollmentIDChange,
    handleFileChange,
    handleSubmit,
  } = useCertificateService(id, data);

  return (
    <div className="container mt-5 p-5">
      {loading && <MainLoader />}
      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">
          {id ? "Sửa thông tin chứng nhận" : "Thêm thông tin chứng nhận"}
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
                  name="certificateID"
                  value={certificateInputs.certificateID}
                  onChange={handleCertificateInput}
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
                  value={certificateInputs.registryNumber}
                  onChange={handleCertificateInput}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Mã sổ lưu chứng nhận:
                </label>
                <input
                  type="text"
                  className="form-control ms-2"
                  placeholder="Nhập mã sổ lưu chứng nhận"
                  required
                  name="certificateRegisterID"
                  value={certificateInputs.certificateRegisterID}
                  onChange={handleCertificateInput}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Mã đăng ký:
                </label>
                <input
                  type="text"
                  className="form-control ms-2"
                  placeholder="Nhập mã đăng ký"
                  required
                  name="enrollmentID"
                  value={certificateInputs.enrollmentID}
                  onChange={handleEnrollmentIDChange}
                />
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Tên chứng nhận:
                </label>
                <input
                  type="text"
                  className="form-control ms-2"
                  placeholder="Nhập tên chứng nhận"
                  required
                  name="certificateName"
                  value={certificateInputs.certificateName}
                  onChange={handleCertificateInput}
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
                    certificateInputs.issueDate
                      ? format(certificateInputs.issueDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={handleCertificateInput}
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
                  value={certificateInputs.isValid}
                  onChange={handleCertificateInput}
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
                  className="form-control ms-2"
                  placeholder="Nhập tổ chức cấp"
                  required
                  name="issuingOrganization"
                  value={certificateInputs.issuingOrganization}
                  onChange={handleCertificateInput}
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
                  value={certificateInputs.description}
                  onChange={handleCertificateInput}
                ></textarea>
              </div>
              <div className="mt-3 d-flex align-items-center">
                <label className="fw-bold" style={{ minWidth: "120px" }}>
                  Hình chứng nhận:
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
                    onClick={() => navigate("/certificate/certificatelist")}
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
                  <div className="me-2 fw-bold">Khóa học:</div>
                  <div>{studentInfo?.courseName || ""}</div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2 fw-bold">Điểm số:</div>
                  <div>{studentInfo?.finalTestScore || ""}</div>
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

export default withAdminAuth(CertificateUpsert);
