import { useState, useEffect } from "react";
import {
  useDeleteCertificateRegisterMutation,
  useCreateCertificateRegisterMutation,
  useUpdateCertificateRegisterMutation,
} from "../../Apis/certificateRegisterApi";
import { inputHelper } from "../../Helper";
import { toastNotify } from "../../Helper";
import { useNavigate } from "react-router-dom";
import { apiResponse } from "../../Interfaces";

interface FormValues {
  registerName: string;
  issuingInstitution: string;
  trainingProgram: string;
  trainingDuration: string;
  examBoard: string;
}

export const useCertificateRegisterService = (id?: string, data?: any) => {
  // State quản lý input form
  const [certificateRegisterInputs, setCertificateRegisterInputs] =
    useState<FormValues>({
      registerName: "",
      issuingInstitution: "",
      trainingProgram: "",
      trainingDuration: "",
      examBoard: "",
    });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Hooks API
  const [deleteCertificateRegister] = useDeleteCertificateRegisterMutation();
  const [createCertificateRegister] = useCreateCertificateRegisterMutation();
  const [updateCertificateRegister] = useUpdateCertificateRegisterMutation();

  // Load dữ liệu khi có ID và data
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        registerName: data.result.registerName,
        issuingInstitution: data.result.issuingInstitution,
        trainingProgram: data.result.trainingProgram,
        trainingDuration: data.result.trainingDuration,
        examBoard: data.result.examBoard,
      };
      setCertificateRegisterInputs(tempData);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleCertificateRegisterInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, certificateRegisterInputs);
    setCertificateRegisterInputs(updatedData);
  };

  // Xử lý submit (Thêm/Sửa)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      ...(id && { certificateRegisterID: id }),
      registerName: certificateRegisterInputs.registerName,
      issuingInstitution: certificateRegisterInputs.issuingInstitution,
      trainingProgram: certificateRegisterInputs.trainingProgram ?? "",
      trainingDuration: certificateRegisterInputs.trainingDuration ?? "",
      examBoard: certificateRegisterInputs.examBoard ?? "",
    };

    let response;
    if (id) {
      // Cập nhật
      response = await updateCertificateRegister({ data: requestData, id });
      toastNotify("Cập nhật sổ cấp chứng nhận thành công", "success");
    } else {
      // Tạo mới
      response = await createCertificateRegister(requestData);
      toastNotify("Thêm sổ cấp chứng nhận thành công", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/certificateRegister/certificateregisterlist");
    }
    return response;
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    const response: apiResponse = await deleteCertificateRegister(id);
    if (response.data) {
      toastNotify("Xóa sổ chứng nhận thành công", "success");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  return {
    certificateRegisterInputs,
    loading,
    handleCertificateRegisterInput,
    handleSubmit,
    handleDelete,
  };
};
