const AccountPendingApproval = () => {
  return (
    <div className="container mt-5">
      <div className="alert alert-danger text-center mb-4">
        <h4 className="mb-3">Account Not Approved</h4>
        <p>
          Tài khoản chưa được duyệt, vui lòng liên hệ quản trị viên để duyệt.
        </p>
      </div>
    </div>
  );
};

export default AccountPendingApproval;
