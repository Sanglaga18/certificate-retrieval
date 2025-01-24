import { MainLoader } from "../../Components/Page/Common";
import { enrollmentModel } from "../../Interfaces";
import { useGetEnrollmentQuery } from "../../Apis/enrollmentApi";
import { useNavigate } from "react-router";
import { useEnrollmentService } from "../../Services";
import { withAdminAuth } from "../../HOC";
import { format } from "date-fns";

function EnrollmentList() {
  const { data, isLoading } = useGetEnrollmentQuery(null);
  const navigate = useNavigate();
  const { handleDelete } = useEnrollmentService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách đăng ký khóa học</h1>
            <button
              className="btn btn-success"
              onClick={() => navigate("/enrollment/enrollmentUpsert/")}
            >
              Thêm thông tin đăng ký khoá học mới
            </button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col">StudentID</div>
              <div className="col">CourseID</div>
              <div className="col">Ngày đăng ký</div>
              <div className="col">Điểm cuối khóa</div>
              <div className="col">Hành động</div>
            </div>
            {data.result.map((enrollment: enrollmentModel) => {
              return (
                <div className="row border" key={enrollment.enrollmentID}>
                  <div className="col-1">{enrollment.enrollmentID}</div>
                  <div className="col">{enrollment.studentID}</div>
                  <div className="col">{enrollment.courseID}</div>
                  <div className="col">
                    {enrollment.enrollmentDate &&
                      format(new Date(enrollment.enrollmentDate), "dd/MM/yyyy")}
                  </div>
                  <div className="col">{enrollment.finalTestScore}</div>
                  <div className="col">
                    <button className="btn btn-success">
                      <i
                        className="bi bi-pencil-fill"
                        onClick={() =>
                          navigate(
                            "/enrollment/enrollmentUpsert/" +
                              enrollment.enrollmentID
                          )
                        }
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleDelete(enrollment.enrollmentID)}
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
export default withAdminAuth(EnrollmentList);
