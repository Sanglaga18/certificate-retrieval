import { MainLoader } from "../../Components/Page/Common";
import { certificateModel, userModel } from "../../Interfaces";
import { useCertificateService } from "../../Services";
import { useGetCertificateQuery } from "../../Apis/certificateApi";
import { withAdminAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { format } from "date-fns";

function CertificateList() {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const { data, isLoading } = useGetCertificateQuery({
    userID: userData.id,
  });
  const { handleNavigate, handleDelete } = useCertificateService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách chứng nhận</h1>
            <button
              className="btn btn-success"
              onClick={() => handleNavigate(undefined)}
            >
              Thêm chứng nhận mới
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-2">Image</div>
              <div className="col">Số hiệu</div>
              <div className="col">Số vào sổ lưu</div>
              <div className="col">Tên chứng nhận</div>
              <div className="col">Ngày cấp</div>
              <div className="col">Hiệu lực</div>
              <div className="col">Tổ chức cấp</div>
              <div className="col">Mã đăng ký</div>
              <div className="col">Mô tả</div>
              <div className="col">Hành động</div>
            </div>
            {data?.result && data.result.length > 0 ? (
              data.result.map((certificate: certificateModel) => (
                <div className="row border" key={certificate.certificateID}>
                  <div className="col-2">
                    <img
                      className="img-fluid"
                      src={certificate.image}
                      alt="no content"
                    />
                  </div>
                  <div className="col">{certificate.certificateID}</div>
                  <div className="col">{certificate.registryNumber}</div>
                  <div className="col">{certificate.certificateName}</div>
                  <div className="col">
                    {format(new Date(certificate.issueDate), "dd/MM/yyyy")}
                  </div>
                  <div className="col">
                    {certificate.isValid === true
                      ? "Còn hiệu lực"
                      : "Hết hiệu lực"}
                  </div>
                  <div className="col">{certificate.issuingOrganization}</div>
                  <div className="col">{certificate.enrollmentID}</div>
                  <div className="col">{certificate.description}</div>
                  <div className="col">
                    <button className="btn btn-success">
                      <i
                        className="bi bi-pencil-fill"
                        onClick={() =>
                          handleNavigate(certificate.certificateID)
                        }
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleDelete(certificate.certificateID)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-4 text-danger">
                Không có dữ liệu chứng nhận
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default withAdminAuth(CertificateList);
