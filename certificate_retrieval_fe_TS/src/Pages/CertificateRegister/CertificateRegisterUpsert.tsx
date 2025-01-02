import { useNavigate, useParams } from "react-router-dom";
import { useGetCertificateRegisterByIdQuery } from "../../Apis/certificateRegisterApi";
import { MainLoader } from "../../Components/Page/Common";
import { useCertificateRegisterService } from "../../Services";
import { withAdminAuth } from "../../HOC";

const CertificateRegisterUpsert = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetCertificateRegisterByIdQuery(id);

  const {
    certificateRegisterInputs,
    loading,
    handleCertificateRegisterInput,
    handleSubmit,
  } = useCertificateRegisterService(id, data);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">
          {id ? "Sửa sổ cấp chứng nhận" : "Thêm sổ cấp chứng nhận"}
        </h3>

        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12">
              {/* Tên sổ */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Tên sổ:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên sổ"
                  required
                  name="registerName"
                  value={certificateRegisterInputs.registerName}
                  onChange={handleCertificateRegisterInput}
                />
              </div>

              {/* Tổ chức cấp */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Tổ chức cấp:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tổ chức cấp"
                  required
                  name="issuingInstitution"
                  value={certificateRegisterInputs.issuingInstitution}
                  onChange={handleCertificateRegisterInput}
                />
              </div>

              {/* Chương trình đào tạo */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px", width: "120px" }}>
                  Chương trình đào tạo:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập chương trình đào tạo"
                  name="trainingProgram"
                  value={certificateRegisterInputs.trainingProgram}
                  onChange={handleCertificateRegisterInput}
                />
              </div>

              {/* Thời gian đào tạo */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Thời gian đào tạo:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Thời gian đào tạo"
                  name="trainingDuration"
                  value={certificateRegisterInputs.trainingDuration}
                  onChange={handleCertificateRegisterInput}
                />
              </div>

              {/* Hội đồng thi */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Hội đồng thi:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập hội đồng thi"
                  name="examBoard"
                  value={certificateRegisterInputs.examBoard}
                  onChange={handleCertificateRegisterInput}
                />
              </div>

              <div className="d-flex justify-content-between">
                {/* Nút quay lại */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate("/certificateRegister/certificateregisterlist")
                  }
                >
                  Trở lại
                </button>

                {/* Nút xác nhận */}
                <button type="submit" className="btn btn-success">
                  {id ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAdminAuth(CertificateRegisterUpsert);
