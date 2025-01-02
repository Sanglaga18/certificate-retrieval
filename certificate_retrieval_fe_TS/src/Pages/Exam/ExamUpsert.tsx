import { useNavigate, useParams } from "react-router-dom";
import { useGetExamByIdQuery } from "../../Apis/examApi";
import { MainLoader } from "../../Components/Page/Common";
import { useExamService } from "../../Services";
import { format } from "date-fns";
import { withAdminAuth } from "../../HOC";

const ExamUpsert = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetExamByIdQuery(id);

  const { examInputs, loading, handleExamInput, handleSubmit } = useExamService(
    id,
    data
  );

  return (
    <div className="container mt-5" style={{ maxWidth: "800", width: "700px" }}>
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">
          {id ? "Sửa kỳ thi" : "Thêm kỳ thi"}
        </h3>

        <form method="post" onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            <div className="col-md-10">
              {/* Tên kỳ thi */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "80px", width: "100px" }}>
                  Tên kỳ thi:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên kỳ thi"
                  required
                  name="examName"
                  value={examInputs.examName}
                  onChange={handleExamInput}
                />
              </div>

              {/* Ngày thi */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "80px", width: "100px" }}>
                  Ngày thi:
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Ngày thi"
                  required
                  name="examDate"
                  value={
                    examInputs.examDate
                      ? format(examInputs.examDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={handleExamInput}
                />
              </div>

              <div className="d-flex justify-content-between">
                {/* Nút quay lại */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/exam/examlist")}
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

export default withAdminAuth(ExamUpsert);
