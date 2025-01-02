import { useNavigate, useParams } from "react-router-dom";
import { useGetExamResultByIdQuery } from "../../Apis/examResultApi";
import { MainLoader } from "../../Components/Page/Common";
import { useExamResultService } from "../../Services";
import { withAdminAuth } from "../../HOC";

const ExamResultUpsert = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetExamResultByIdQuery(id);

  const { examResultInputs, loading, handleExamResultInput, handleSubmit } =
    useExamResultService(id, data);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">
          {id ? "Sửa kết quả kỳ thi" : "Thêm kết quả kỳ thi"}
        </h3>

        <form method="post" onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            <div className="col-md-8">
              {/* Mã học viên */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Mã học viên:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mã học viên"
                  required
                  name="studentID"
                  value={examResultInputs.studentID}
                  onChange={handleExamResultInput}
                />
              </div>
              {/* Mã kỳ thi */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Mã kỳ thi:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mã kỳ thi"
                  required
                  name="examID"
                  value={examResultInputs.examID}
                  onChange={handleExamResultInput}
                />
              </div>

              {/* Điểm kỳ thi */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Điểm kỳ thi:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Điểm kỳ thi"
                  required
                  name="marksObtained"
                  value={examResultInputs.marksObtained}
                  onChange={handleExamResultInput}
                />
              </div>
              {/* Trạng thái kết quả */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Trạng thái kết quả:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Trạng thái kết quả"
                  required
                  name="examStatus"
                  value={examResultInputs.examStatus}
                  onChange={handleExamResultInput}
                />
              </div>
              <div className="d-flex justify-content-between">
                {/* Nút quay lại */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/examResult/examResultlist")}
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

export default withAdminAuth(ExamResultUpsert);
