import { MainLoader } from "../../Components/Page/Common";
import { courseModel } from "../../Interfaces";
import { useGetCourseQuery } from "../../Apis/courseApi";
import { useNavigate } from "react-router";
import { useCourseService } from "../../Services";
import { withAdminAuth } from "../../HOC";

function CourseList() {
  const { data, isLoading } = useGetCourseQuery(null);
  const navigate = useNavigate();
  const { handleDelete } = useCourseService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách khóa học</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/course/courseUpsert/")}
            >
              Thêm khoá học mới
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col">Tên khóa học</div>
              <div className="col">Ngày bắt đầu</div>
              <div className="col">Ngày kết thúc</div>
              <div className="col">Hành động</div>
            </div>
            {data.result.map((course: courseModel) => {
              return (
                <div className="row border" key={course.courseID}>
                  <div className="col-1">{course.courseID}</div>
                  <div className="col">{course.courseName}</div>
                  <div className="col">
                    {new Date(course.startDate).toLocaleDateString()}
                  </div>
                  <div className="col">
                    {new Date(course.endDate).toLocaleDateString()}
                  </div>
                  <div className="col">
                    <button className="btn btn-success">
                      <i
                        className="bi bi-pencil-fill"
                        onClick={() =>
                          navigate("/course/courseUpsert/" + course.courseID)
                        }
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleDelete(course.courseID)}
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
export default withAdminAuth(CourseList);
