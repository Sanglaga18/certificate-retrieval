import { useNavigate, useParams } from "react-router-dom";
import { useGetDiplomaRegisterByIdQuery } from "../../Apis/diplomaRegisterApi";
import { MainLoader } from "../../Components/Page/Common";
import { useDiplomaRegisterService } from "../../Services";
import { withAdminAuth } from "../../HOC";
import { skipToken } from "@reduxjs/toolkit/query";

const DiplomaRegisterUpsert = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetDiplomaRegisterByIdQuery(id ?? skipToken);

  const {
    diplomaRegisterInputs,
    loading,
    handleDiplomaRegisterInput,
    handleSubmit,
  } = useDiplomaRegisterService(id, data);

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "800px", width: "700px" }}
    >
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">
          {id ? "Sửa sổ cấp chứng chỉ" : "Thêm sổ cấp chứng chỉ"}
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
                  value={diplomaRegisterInputs.registerName}
                  onChange={handleDiplomaRegisterInput}
                />
              </div>

              {/* Tổ chức cấp */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Tổ chức cấp:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="nhập tổ chức cấp"
                  required
                  name="issuingInstitution"
                  value={diplomaRegisterInputs.issuingInstitution}
                  onChange={handleDiplomaRegisterInput}
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
                  value={diplomaRegisterInputs.trainingProgram}
                  onChange={handleDiplomaRegisterInput}
                />
              </div>

              {/* Thời gian đào tạo */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Thời gian đào tạo:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập thời gian đào tạo"
                  name="trainingDuration"
                  value={diplomaRegisterInputs.trainingDuration}
                  onChange={handleDiplomaRegisterInput}
                />
              </div>

              {/* Hội đồng thi */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Hội đồng thi:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hội đồng thi"
                  name="examBoard"
                  value={diplomaRegisterInputs.examBoard}
                  onChange={handleDiplomaRegisterInput}
                />
              </div>

              <div className="d-flex justify-content-between">
                {/* Nút quay lại */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate("/diplomaRegister/diplomaregisterlist")
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

export default withAdminAuth(DiplomaRegisterUpsert);
