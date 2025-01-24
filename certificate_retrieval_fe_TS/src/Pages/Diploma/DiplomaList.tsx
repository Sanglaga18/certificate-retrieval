import { MainLoader } from "../../Components/Page/Common";
import { diplomaModel, userModel } from "../../Interfaces";
import { useDiplomaService } from "../../Services";
import { useGetDiplomaQuery } from "../../Apis/diplomaApi";
import { withAdminAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { format } from "date-fns";

function DiplomaList() {
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );
  const { data, isLoading } = useGetDiplomaQuery({
    userID: userData.id,
  });
  const { handleNavigate, handleDelete } = useDiplomaService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách chứng chỉ</h1>
            <button
              className="btn btn-success"
              onClick={() => handleNavigate(undefined)}
            >
              Thêm chứng chỉ mới
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-2">Image</div>
              <div className="col">Số hiệu</div>
              <div className="col">Số vào sổ lưu</div>
              <div className="col">Tên chứng chỉ</div>
              <div className="col">Ngày cấp</div>
              <div className="col">Hiệu lực</div>
              <div className="col">Tổ chức cấp</div>
              <div className="col">Mã kết quả</div>
              <div className="col">Mô tả</div>
              <div className="col">Hành động</div>
            </div>
            {data?.result && data.result.length > 0 ? (
              data.result.map((diploma: diplomaModel) => (
                <div className="row border" key={diploma.diplomaNumber}>
                  <div className="col-2">
                    <img
                      className="img-fluid"
                      src={diploma.image}
                      alt="no content"
                    />
                  </div>
                  <div className="col">{diploma.diplomaNumber}</div>
                  <div className="col">{diploma.registryNumber}</div>
                  <div className="col">{diploma.diplomaName}</div>
                  <div className="col">
                    {diploma.issueDate &&
                      format(new Date(diploma.issueDate), "dd/MM/yyyy")}
                  </div>
                  <div className="col">
                    {diploma.isValid === true ? "Còn hiệu lực" : "Hết hiệu lực"}
                  </div>
                  <div className="col">{diploma.issuingOrganization}</div>
                  <div className="col">{diploma.examResultID}</div>
                  <div className="col">{diploma.description}</div>
                  <div className="col">
                    <button className="btn btn-success">
                      <i
                        className="bi bi-pencil-fill"
                        onClick={() => handleNavigate(diploma.diplomaNumber)}
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleDelete(diploma.diplomaNumber)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-4 text-danger">
                Không có dữ liệu chứng chỉ
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default withAdminAuth(DiplomaList);
