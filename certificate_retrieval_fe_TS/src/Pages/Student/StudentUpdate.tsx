import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { useStudentService } from "../../Services";
import { useGetStudentByIdQuery } from "../../Apis/studentApi";
import { withAdminAuth } from "../../HOC";

const StudentUpdate = () => {
  const { id } = useParams();
  //console.log(id);

  const navigate = useNavigate();

  const { data } = useGetStudentByIdQuery(id);

  const {
    loading,
    imageToDisplay,
    frontIdCardToDisplay,
    backIdCardToDisplay,
    handleFileChange,
    handleSubmit,
  } = useStudentService(id, data);

  return (
    <div className="container mt-5 p-5">
      {loading && <MainLoader />}
      <div className="card shadow border p-4">
        <h3 className="text-center text-primary mb-4">
          Cập nhật hình học viên
        </h3>
        <form
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="row mt-3">
            <div className="col-md-5 offset-1">
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Ảnh học viên:</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="form-control mt-3"
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Ảnh CCCD mặt trước:</label>
                <input
                  type="file"
                  name="frontIdCard"
                  onChange={handleFileChange}
                  className="form-control mt-3"
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label style={{ minWidth: "120px" }}>Ảnh CCCD mặt sau:</label>
                <input
                  type="file"
                  name="backIdCard"
                  onChange={handleFileChange}
                  className="form-control mt-3"
                />
              </div>
              <div className="row mt-4">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-secondary w-50"
                    onClick={() => navigate("/student/studentlist")}
                  >
                    Trở lại
                  </button>
                </div>
                <div className="col-6 text-end">
                  <button type="submit" className="btn btn-success w-100">
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
            <div className="ms-5 col-md-5 border border-primary rounded-2 shadow">
              <div className="row mt-3 ms-2">
                <div className="col-4">
                  <label className="fw-bold">Ảnh học viên:</label>
                  <img
                    className="img-fluid"
                    style={{ maxHeight: "175px" }}
                    src={imageToDisplay}
                    alt=""
                  />
                </div>
                <div className="col-8">
                  <label className="fw-bold">Ảnh CCCD mặt trước:</label>
                  <img
                    className="img-fluid"
                    style={{ maxHeight: "175px" }}
                    src={frontIdCardToDisplay}
                    alt=""
                  />
                </div>
              </div>
              <div className="row mb-4 ms-2">
                <div className="col-4"></div>
                <div className="col-8">
                  <label className="fw-bold">Ảnh CCCD mặt sau:</label>
                  <img
                    className="img-fluid"
                    style={{ maxHeight: "175px" }}
                    src={backIdCardToDisplay}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAdminAuth(StudentUpdate);
