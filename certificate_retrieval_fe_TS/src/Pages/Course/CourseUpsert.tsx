import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseByIdQuery } from "../../Apis/courseApi";
import { MainLoader } from "../../Components/Page/Common";
import { useCourseService } from "../../Services";
import { format } from "date-fns";
import { withAdminAuth } from "../../HOC";
import { skipToken } from "@reduxjs/toolkit/query";

const CourseUpsert = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetCourseByIdQuery(id ?? skipToken);

  const { courseInputs, loading, handleCourseInput, handleSubmit } =
    useCourseService(id, data);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      {loading && <MainLoader />}

      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">
          {id ? "Sửa khóa học" : "Thêm khóa học"}
        </h3>

        <form method="post" onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            <div className="col-md-10">
              {/* Tên khóa học */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Tên khóa học:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên khóa học"
                  required
                  name="courseName"
                  value={courseInputs.courseName}
                  onChange={handleCourseInput}
                />
              </div>

              {/* Ngày bắt đầu */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Ngày bắt đầu:</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Nhập ngày bắt đầu"
                  required
                  name="startDate"
                  value={
                    //new Date(courseInputs.startDate).toISOString().split("T")[0]
                    courseInputs.startDate
                      ? format(courseInputs.startDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={handleCourseInput}
                />
              </div>

              {/* Ngày kết thúc */}
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Ngày kết thúc:</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Nhập ngày kết thúc"
                  name="endDate"
                  value={
                    // new Date(courseInputs.endDate).toISOString().split("T")[0]
                    courseInputs.endDate
                      ? format(courseInputs.endDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={handleCourseInput}
                />
              </div>

              <div className="d-flex justify-content-between">
                {/* Nút quay lại */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/course/courselist")}
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

export default withAdminAuth(CourseUpsert);
