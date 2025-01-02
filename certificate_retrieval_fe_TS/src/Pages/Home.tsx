import { useHomeService } from "../Services";
import { MainLoader } from "../Components/Page/Common";
import { certificateModel, diplomaModel } from "../Interfaces";

function Home() {
  const {
    filters,
    documentData,
    documentType,
    isLoading,
    inputError,
    hasSearched,
    handleChange,
    handleNavigate,
    handleChangeDocumentType,
    handleFilters,
  } = useHomeService();

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="container mt-5 d-flex flex-column align-items-center">
          <div
            className="card shadow border p-4 mb-3"
            style={{ width: "50vw" }}
          >
            <h3 className="text-center text-primary mb-4">
              Tra cứu chứng chỉ/chứng nhận
            </h3>

            <div className="row justify-content-center">
              <div className="col-md-12">
                {/* Lựa chọn loại văn bằng */}
                <div className="mb-2 d-flex align-items-center">
                  <label style={{ minWidth: "120px", width: "280px" }}>
                    Chọn loại văn bằng:
                  </label>
                  <select
                    name="documentType"
                    className="form-control form-select"
                    value={documentType}
                    onChange={handleChangeDocumentType}
                  >
                    <option value="diploma">Chứng chỉ</option>
                    <option value="certificate">Chứng nhận</option>
                  </select>
                </div>
                {/* Nhập thông tin tìm kiếm */}
                <div className="mb-2 d-flex align-items-center">
                  <label style={{ minWidth: "120px", width: "280px" }}>
                    Số hiệu/Số vào sổ lưu/Tên{" "}
                    {documentType === "diploma" ? "chứng chỉ" : "chứng nhận"}:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: 123456"
                    required
                    name="searchString"
                    value={filters.searchString}
                    onChange={handleChange}
                  />
                </div>
                {inputError && (
                  <p className="text-danger justify-content-center d-flex align-items-center">
                    Cần nhập thông tin
                  </p>
                )}
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ width: "50%" }}
                    onClick={handleFilters}
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="table p-5">
            <div className="d-flex align-items-center justify-content-between">
              <h1 className="text-success">Danh sách tra cứu</h1>
            </div>
            <div className="p-2">
              <div className="row border">
                <div className="col-2">Image</div>
                <div className="col">Số hiệu</div>
                <div className="col">Số vào sổ lưu</div>
                <div className="col">
                  Tên {documentType === "diploma" ? "chứng chỉ" : "chứng nhận"}
                </div>
                <div className="col">Ngày cấp</div>
                <div className="col">Hiệu lực</div>
                <div className="col">Tổ chức cấp</div>
                <div className="col">
                  Mã {documentType === "diploma" ? "kết quả" : "đăng ký"}
                </div>
                <div className="col">Mô tả</div>
                <div className="col">Xem chi tiết</div>
              </div>
              {/* Nội dung bảng */}
              {hasSearched ? (
                documentData.length > 0 ? (
                  documentData.map((document: any) => {
                    if (documentType === "diploma") {
                      const diploma = document as diplomaModel;
                      return (
                        <div className="row border" key={diploma.diplomaNumber}>
                          <div className="col-2">
                            <img
                              className="img-fluid"
                              src={diploma.image}
                              alt="no content"
                            />
                          </div>
                          <div className="col">{diploma.diplomaNumber}</div>
                          <div className="col">{diploma.registryNumber}</div>
                          <div className="col">{diploma.diplomaName}</div>
                          <div className="col">
                            {new Date(diploma.issueDate).toLocaleDateString()}
                          </div>
                          <div className="col">
                            {diploma.isValid === true
                              ? "Còn hiệu lực"
                              : "Hết hiệu lực"}
                          </div>
                          <div className="col">
                            {diploma.issuingOrganization}
                          </div>
                          <div className="col">{diploma.examResultID}</div>
                          <div className="col">{diploma.description}</div>
                          <div className="col">
                            <button className="btn btn-success">
                              <i
                                className="bi bi-eye-fill"
                                onClick={() =>
                                  handleNavigate(
                                    documentType,
                                    diploma.diplomaNumber
                                  )
                                }
                              ></i>
                            </button>
                          </div>
                        </div>
                      );
                    } else if (documentType === "certificate") {
                      const certificate = document as certificateModel;
                      return (
                        <div
                          className="row border"
                          key={certificate.certificateID}
                        >
                          <div className="col-2">
                            <img
                              className="img-fluid"
                              src={certificate.image}
                              alt="no content"
                            />
                          </div>
                          <div className="col">{certificate.certificateID}</div>
                          <div className="col">
                            {certificate.registryNumber}
                          </div>
                          <div className="col">
                            {certificate.certificateName}
                          </div>
                          <div className="col">
                            {new Date(
                              certificate.issueDate
                            ).toLocaleDateString()}
                          </div>
                          <div className="col">
                            {certificate.isValid === true
                              ? "Còn hiệu lực"
                              : "Hết hiệu lực"}
                          </div>
                          <div className="col">
                            {certificate.issuingOrganization}
                          </div>
                          <div className="col">{certificate.enrollmentID}</div>
                          <div className="col">{certificate.description}</div>
                          <div className="col">
                            <button className="btn btn-success">
                              <i
                                className="bi bi-eye-fill"
                                onClick={() =>
                                  handleNavigate(
                                    documentType,
                                    certificate.certificateID
                                  )
                                }
                              ></i>
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })
                ) : (
                  // Thông báo không tìm thấy
                  <div className="text-center text-danger">
                    <h5>
                      Không tìm thấy{" "}
                      {documentType === "diploma" ? "chứng chỉ" : "chứng nhận"}{" "}
                      với thông tin trên.
                    </h5>
                  </div>
                )
              ) : (
                // Khi chưa bấm tìm kiếm, không hiển thị gì thêm
                <div className="text-center text-muted">
                  <h5>Hãy nhập thông tin và nhấn tìm kiếm.</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
