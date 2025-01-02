import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const accessToken = localStorage.getItem("token");
    const navigate = useNavigate();
    if (!accessToken) {
      window.location.replace("/login");
      return null;
    }

    // Decode token để kiểm tra isActive
    try {
      const decodedToken: any = jwtDecode(accessToken);

      if (decodedToken.isActive === "false") {
        navigate("/account-pending-approval");
        return null;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      window.location.replace("/login");
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
