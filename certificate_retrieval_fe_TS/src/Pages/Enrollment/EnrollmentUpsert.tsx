import { useNavigate, useParams } from "react-router-dom";
import { useGetEnrollmentByIdQuery } from "../../Apis/enrollmentApi";
import { MainLoader } from "../../Components/Page/Common";
import { useEnrollmentService } from "../../Services";
import { format } from "date-fns";
import { withAdminAuth } from "../../HOC";

const EnrollmentUpsert = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetEnrollmentByIdQuery(id);

  const { enrollmentInputs, loading, handleEnrollmentInput, handleSubmit } =
    useEnrollmentService(id, data);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">
          {id
            ? "Sửa thông tin đăng ký khóa học"
            : "Thêm thông tin đăng ký khóa học"}
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
                  value={enrollmentInputs.studentID}
                  onChange={handleEnrollmentInput}
                />
              </div>
              {/* Mã khóa học */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Mã khóa học:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mã khóa học"
                  required
                  name="courseID"
                  value={enrollmentInputs.courseID}
                  onChange={handleEnrollmentInput}
                />
              </div>
              {/* Ngày đăng ký */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Ngày đăng ký:</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Ngày đăng ký"
                  name="enrollmentDate"
                  value={
                    enrollmentInputs.enrollmentDate
                      ? format(enrollmentInputs.enrollmentDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={handleEnrollmentInput}
                />
              </div>
              {/* Điểm cuối khóa */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Điểm cuối khóa:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Điểm cuối khóa"
                  required
                  name="finalTestScore"
                  value={enrollmentInputs.finalTestScore}
                  onChange={handleEnrollmentInput}
                />
              </div>
              <div className="d-flex justify-content-between">
                {/* Nút quay lại */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/enrollment/enrollmentlist")}
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

export default withAdminAuth(EnrollmentUpsert);
