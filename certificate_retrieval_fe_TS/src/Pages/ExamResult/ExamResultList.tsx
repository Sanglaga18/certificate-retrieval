import { MainLoader } from "../../Components/Page/Common";
import { examResultModel } from "../../Interfaces";
import { useGetExamResultQuery } from "../../Apis/examResultApi";
import { useNavigate } from "react-router";
import { useExamResultService } from "../../Services";
import { withAdminAuth } from "../../HOC";

function ExamResultList() {
  const { data, isLoading } = useGetExamResultQuery(null);
  const navigate = useNavigate();
  const { handleDelete } = useExamResultService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách kết quả kỳ thi</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/examResult/examResultUpsert/")}
            >
              Thêm kết quả kỳ thi mới
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col">StudentID</div>
              <div className="col">ExamID</div>
              <div className="col">Điểm kỳ thi</div>
              <div className="col">Trạng thái kết quả</div>
              <div className="col">Hành động</div>
            </div>
            {data.result.map((examResult: examResultModel) => {
              return (
                <div className="row border" key={examResult.resultID}>
                  <div className="col-1">{examResult.resultID}</div>
                  <div className="col">{examResult.studentID}</div>
                  <div className="col">{examResult.examID}</div>
                  <div className="col">{examResult.marksObtained}</div>
                  <div className="col">{examResult.examStatus}</div>
                  <div className="col">
                    <button className="btn btn-success">
                      <i
                        className="bi bi-pencil-fill"
                        onClick={() =>
                          navigate(
                            "/examResult/examResultUpsert/" +
                              examResult.resultID
                          )
                        }
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleDelete(examResult.resultID)}
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
export default withAdminAuth(ExamResultList);
