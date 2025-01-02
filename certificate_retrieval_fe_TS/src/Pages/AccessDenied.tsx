import React from "react";

function AccessDenied() {
  return (
    <div className="container mt-5">
      <div className="alert alert-danger text-center mb-4">
        <h4 className="mb-3">Access Denied</h4>
        <p>Bạn không có quyền truy cập vào trang này.</p>
      </div>
    </div>
  );
}

export default AccessDenied;
