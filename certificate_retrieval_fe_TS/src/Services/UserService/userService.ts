import { useState, useEffect } from "react";
import {
  useChangePasswordMutation,
  useCreateUserMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
} from "../../Apis/userApi";
import { inputHelper } from "../../Helper";
import { toastNotify } from "../../Helper";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { apiResponse } from "../../Interfaces";
import { useDispatch } from "react-redux";
import {
  emptyUserState,
  setLoggedInUser,
} from "../../Storage/Redux/userAuthSlice";

const userData = {
  userID: "",
  username: "",
  password: "",
  newPassword: "",
  confirmPassword: "",
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: new Date(),
  roleID: "1",
  isActive: "true",
};

export const useUserService = (id?: string, data?: any) => {
  // State quản lý input form
  const [userInputs, setUserInputs] = useState(userData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Hooks API
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [changePassword] = useChangePasswordMutation();

  //Load dữ liệu khi có ID và data
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        userID: data.result.userID,
        username: data.result.username,
        password: "",
        newPassword: "",
        confirmPassword: "",
        fullName: data.result.fullName,
        email: data.result.email,
        phone: data.result.phone,
        dateOfBirth: new Date(data.result.dateOfBirth),
        roleID: data.result.roleID,
        isActive: String(data.result.isActive),
      };
      setUserInputs(tempData);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleUserInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, userInputs);
    setUserInputs(updatedData);
  };

  // Xử lý submit Sửa người dùng của Staff
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      ...(id && { userID: id }),
      fullName: userInputs.fullName,
      email: userInputs.email,
      phone: userInputs.phone ?? "",
      dateOfBirth: format(userInputs.dateOfBirth, "yyyy-MM-dd"),
      isActive: userInputs.isActive === "true",
    };
    //console.log(requestData);
    // Cập nhật
    const response: apiResponse = await updateUser({ data: requestData, id });
    if (response.data) {
      toastNotify("Cập nhật thông tin người dùng thành công", "success");
      setLoading(false);
      navigate("/user/userlist");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  // Xử lý submit của người dùng tự sửa thông tin
  const handleInfoUpdateSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      ...(id && { userID: id }),
      fullName: userInputs.fullName,
      email: userInputs.email,
      phone: userInputs.phone ?? "",
      dateOfBirth: format(userInputs.dateOfBirth, "yyyy-MM-dd"),
    };
    //console.log(requestData);
    // Cập nhật
    const response: apiResponse = await updateUser({ data: requestData, id });
    if (response.data) {
      toastNotify("Cập nhật thông tin người dùng thành công", "success");
      setLoading(false);
      navigate("/user/userInfo/");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  // Xử lý submit Tạo người dùng của Staff
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra mật khẩu nhập lại
    if (userInputs.newPassword !== userInputs.confirmPassword) {
      toastNotify("Mật khẩu không khớp vui lòng nhập lại", "error");
      setLoading(false);
      return;
    }

    // Kiểm tra tên tài khoản
    const usernamePattern = /^[a-zA-Z0-9_.]{5,50}$/;
    if (!usernamePattern.test(userInputs.username)) {
      toastNotify(
        "Tên tài khoản phải có ít nhất 5 ký tự, chỉ bao gồm chữ, số, dấu gạch dưới và dấu chấm.",
        "error"
      );
      setLoading(false);
      return;
    }

    // Kiểm tra mật khẩu
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,50}$/;

    if (!passwordPattern.test(userInputs.newPassword)) {
      toastNotify(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        "error"
      );
      setLoading(false);
      return;
    }

    const requestData = {
      username: userInputs.username,
      password: userInputs.newPassword,
      fullName: userInputs.fullName,
      email: userInputs.email,
      phone: userInputs.phone ?? "",
      dateOfBirth: format(userInputs.dateOfBirth, "yyyy-MM-dd"),
      roleID: userInputs.roleID,
      isActive: userInputs.isActive === "true",
    };

    // Gọi API để tạo người dùng
    const response: apiResponse = await createUser(requestData);
    if (response.data) {
      toastNotify("Tạo người dùng thành công", "success");
      setLoading(false);
      navigate("/user/userlist");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      setLoading(false);
      return;
    }
  };

  // Xử lý reset mật khẩu
  const handleResetPassword = async (id: number) => {
    const response: apiResponse = await resetPassword(id);
    if (response.data) {
      toastNotify(
        `Đặt lại mật khẩu cho người dùng có Id = ${id} thành công`,
        "success"
      );
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra newPassword khớp với confirmPassword
    if (userInputs.newPassword !== userInputs.confirmPassword) {
      toastNotify("Mật khẩu mới và xác nhận mật khẩu không khớp.", "error");
      setLoading(false);
      return;
    }

    // Kiểm tra điều kiện mật khẩu
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,50}$/;

    if (!passwordPattern.test(userInputs.newPassword)) {
      toastNotify(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        "error"
      );
      setLoading(false);
      return;
    }

    const requestData = {
      ...(id && { userID: id }),
      oldPassword: userInputs.password,
      newPassword: userInputs.newPassword,
    };

    //console.log(requestData);
    // Đổi mật khẩu
    const response: apiResponse = await await changePassword({
      data: requestData,
      id,
    });
    if (response.data) {
      toastNotify("Đổi mật khẩu thành công, vui lòng đăng nhập lại", "success");
      localStorage.removeItem("token");
      dispatch(setLoggedInUser({ ...emptyUserState }));
      setLoading(false);
      navigate("/login");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  return {
    userInputs,
    loading,
    handleUserInput,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleResetPassword,
    handleInfoUpdateSubmit,
    handleChangePasswordSubmit,
  };
};
