import { MainLoader } from "../../Components/Page/Common";
import { diplomaRegisterModel } from "../../Interfaces";
import { useGetDiplomaRegisterQuery } from "../../Apis/diplomaRegisterApi";
import { useNavigate } from "react-router";
import { useDiplomaRegisterService } from "../../Services";
import { withAdminAuth } from "../../HOC";

function DiplomaRegisterList() {
  const { data, isLoading } = useGetDiplomaRegisterQuery(null);
  const navigate = useNavigate();
  const { handleDelete } = useDiplomaRegisterService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách sổ cấp chứng chỉ</h1>
            <button
              className="btn btn-success"
              onClick={() =>
                navigate("/diplomaRegister/diplomaregisterUpsert/")
              }
            >
              Thêm sổ mới
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col-2">Tên sổ cấp chứng chỉ</div>
              <div className="col-2">Tổ chức cấp</div>
              <div className="col-2">Chương trình đào tạo</div>
              <div className="col-2">Thời gian đào tạo</div>
              <div className="col-2">Hội đồng thi</div>
              <div className="col-1">Hành động</div>
            </div>
            {data.result.map((diplomaRegister: diplomaRegisterModel) => {
              return (
                <div
                  className="row border"
                  key={diplomaRegister.diplomaRegisterID}
                >
                  <div className="col-1">
                    {diplomaRegister.diplomaRegisterID}
                  </div>
                  <div className="col-2">{diplomaRegister.registerName}</div>
                  <div className="col-2">
                    {diplomaRegister.issuingInstitution}
                  </div>
                  <div className="col-2">{diplomaRegister.trainingProgram}</div>
                  <div className="col-2">
                    {diplomaRegister.trainingDuration}
                  </div>
                  <div className="col-2">{diplomaRegister.examBoard}</div>
                  <div className="col-1">
                    <button className="btn btn-success">
                      <i
                        className="bi bi-pencil-fill"
                        onClick={() =>
                          navigate(
                            "/diplomaRegister/diplomaregisterUpsert/" +
                              diplomaRegister.diplomaRegisterID
                          )
                        }
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() =>
                        handleDelete(diplomaRegister.diplomaRegisterID)
                      }
                    >
                      <i className="bi bi-trash-fill"></i>
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
export default withAdminAuth(DiplomaRegisterList);
