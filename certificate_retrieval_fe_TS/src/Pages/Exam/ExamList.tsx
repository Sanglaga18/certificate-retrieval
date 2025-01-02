import { MainLoader } from "../../Components/Page/Common";
import { examModel } from "../../Interfaces";
import { useGetExamQuery } from "../../Apis/examApi";
import { useNavigate } from "react-router";
import { useExamService } from "../../Services";
import { withAdminAuth } from "../../HOC";

function ExamList() {
  const { data, isLoading } = useGetExamQuery(null);
  const navigate = useNavigate();
  const { handleDelete } = useExamService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách kỳ thi</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/exam/examUpsert/")}
            >
              Thêm kỳ thi mới
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col-5">Tên kỳ thi</div>
              <div className="col">Ngày thi</div>
              <div className="col">Hành động</div>
            </div>
            {data.result.map((exam: examModel) => {
              return (
                <div className="row border" key={exam.examID}>
                  <div className="col-1">{exam.examID}</div>
                  <div className="col-5">{exam.examName}</div>
                  <div className="col">
                    {new Date(exam.examDate).toLocaleDateString()}
                  </div>
                  <div className="col">
                    <button className="btn btn-success">
                      <i
                        className="bi bi-pencil-fill"
                        onClick={() =>
                          navigate("/exam/examUpsert/" + exam.examID)
                        }
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleDelete(exam.examID)}
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
export default withAdminAuth(ExamList);
