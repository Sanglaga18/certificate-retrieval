import { MainLoader } from "../../Components/Page/Common";
import { studentModel } from "../../Interfaces";
import { useGetStudentQuery } from "../../Apis/studentApi";
import { withAdminAuth } from "../../HOC";
import { useNavigate } from "react-router";

function StudentList() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentQuery(null);

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">Danh sách học viên</h1>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col">Mã học viên</div>
              <div className="col-1">Mã người dùng</div>
              <div className="col-2">Ảnh thẻ</div>
              <div className="col">Ảnh CCCC mặt trước</div>
              <div className="col">Ảnh CCCC mặt sau</div>
              <div className="col-1">Cập nhật</div>
            </div>
            {data?.result && data.result.length > 0 ? (
              data.result.map((student: studentModel) => (
                <div className="row border" key={student.studentID}>
                  <div className="col">{student.studentID}</div>
                  <div className="col-1">{student.userID}</div>
                  <div className="col-2">
                    <img
                      className="img-fluid"
                      style={{ maxHeight: "175px" }}
                      src={student.image}
                      alt="no content"
                    />
                  </div>
                  <div className="col">
                    <img
                      className="img-fluid"
                      style={{ maxHeight: "175px" }}
                      src={student.frontIdCard}
                      alt="no content"
                    />
                  </div>
                  <div className="col">
                    <img
                      className="img-fluid"
                      style={{ maxHeight: "175px" }}
                      src={student.backIdCard}
                      alt="no content"
                    />
                  </div>
                  <div className="col-1">
                    <button className="btn btn-success">
                      <i
                        className="bi bi-pencil-fill"
                        onClick={() =>
                          navigate(
                            "/student/studentUpdate/" + student.studentID
                          )
                        }
                      ></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-4 text-danger">
                Không có dữ liệu học viên
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default withAdminAuth(StudentList);
