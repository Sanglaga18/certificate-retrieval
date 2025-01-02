import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useRegisterUserMutation } from "../../Apis/authApi";
import { inputHelper, toastNotify } from "../../Helper";
import { apiResponse } from "../../Interfaces";

export const useRegisterService = () => {
  const [registerUser] = useRegisterUserMutation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: new Date(),
    roleID: "1",
    fullName: "",
    email: "",
  });

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra mật khẩu nhập lại
    if (userInput.password !== userInput.confirmPassword) {
      toastNotify("Mật khẩu không khớp vui lòng nhập lại", "error");
      setLoading(false);
      return;
    }

    // Kiểm tra tên tài khoản
    const usernamePattern = /^[a-zA-Z0-9_.]{5,50}$/;
    if (!usernamePattern.test(userInput.username)) {
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

    if (!passwordPattern.test(userInput.password)) {
      toastNotify(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        "error"
      );
      setLoading(false);
      return;
    }

    const response: apiResponse = await registerUser({
      username: userInput.username,
      password: userInput.password,
      fullName: userInput.fullName,
      email: userInput.email,
      phone: userInput.phone ?? "",
      dateOfBirth: format(userInput.dateOfBirth, "yyyy-MM-dd"),
      roleID: userInput.roleID,
    });

    if (response.data) {
      toastNotify("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
    }
    setLoading(false);
  };

  return {
    userInput,
    loading,
    handleUserInput,
    handleSubmit,
  };
};
