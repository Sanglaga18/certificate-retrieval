import { MainLoader } from "../../Components/Page/Common";
import { certificateRegisterModel } from "../../Interfaces";
import { useGetCertificateRegisterQuery } from "../../Apis/certificateRegisterApi";
import { useNavigate } from "react-router";
import { useCertificateRegisterService } from "../../Services";
import { withAdminAuth } from "../../HOC";

function CertificateRegisterList() {
  const { data, isLoading } = useGetCertificateRegisterQuery(null);
  const navigate = useNavigate();
  const { handleDelete } = useCertificateRegisterService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách sổ cấp chứng nhận</h1>
            <button
              className="btn btn-success"
              onClick={() =>
                navigate("/certificateRegister/certificateregisterUpsert/")
              }
            >
              Thêm sổ mới
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col-2">Tên sổ cấp chứng nhận</div>
              <div className="col-2">Tổ chức cấp</div>
              <div className="col-2">Chương trình đào tạo</div>
              <div className="col-2">Thời gian đào tạo</div>
              <div className="col-2">Hội đồng thi</div>
              <div className="col-1">Hành động</div>
            </div>
            {data.result.map(
              (certificateRegister: certificateRegisterModel) => {
                return (
                  <div
                    className="row border"
                    key={certificateRegister.certificateRegisterID}
                  >
                    <div className="col-1">
                      {certificateRegister.certificateRegisterID}
                    </div>
                    <div className="col-2">
                      {certificateRegister.registerName}
                    </div>
                    <div className="col-2">
                      {certificateRegister.issuingInstitution}
                    </div>
                    <div className="col-2">
                      {certificateRegister.trainingProgram}
                    </div>
                    <div className="col-2">
                      {certificateRegister.trainingDuration}
                    </div>
                    <div className="col-2">{certificateRegister.examBoard}</div>
                    <div className="col-1">
                      <button className="btn btn-success">
                        <i
                          className="bi bi-pencil-fill"
                          onClick={() =>
                            navigate(
                              "/certificateRegister/certificateregisterUpsert/" +
                                certificateRegister.certificateRegisterID
                            )
                          }
                        ></i>
                      </button>
                      <button
                        className="btn btn-danger mx-2"
                        onClick={() =>
                          handleDelete(
                            certificateRegister.certificateRegisterID
                          )
                        }
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default withAdminAuth(CertificateRegisterList);
