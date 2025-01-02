import { useState, useEffect } from "react";
import {
  useDeleteDiplomaRegisterMutation,
  useCreateDiplomaRegisterMutation,
  useUpdateDiplomaRegisterMutation,
} from "../../Apis/diplomaRegisterApi";
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

export const useDiplomaRegisterService = (id?: string, data?: any) => {
  // State quản lý input form
  const [diplomaRegisterInputs, setDiplomaRegisterInputs] =
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
  const [deleteDiplomaRegister] = useDeleteDiplomaRegisterMutation();
  const [createDiplomaRegister] = useCreateDiplomaRegisterMutation();
  const [updateDiplomaRegister] = useUpdateDiplomaRegisterMutation();

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
      setDiplomaRegisterInputs(tempData);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleDiplomaRegisterInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, diplomaRegisterInputs);
    setDiplomaRegisterInputs(updatedData);
  };

  // Xử lý submit (Thêm/Sửa)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      ...(id && { diplomaRegisterID: id }),
      registerName: diplomaRegisterInputs.registerName,
      issuingInstitution: diplomaRegisterInputs.issuingInstitution,
      trainingProgram: diplomaRegisterInputs.trainingProgram ?? "",
      trainingDuration: diplomaRegisterInputs.trainingDuration ?? "",
      examBoard: diplomaRegisterInputs.examBoard ?? "",
    };

    let response;
    if (id) {
      // Cập nhật
      response = await updateDiplomaRegister({ data: requestData, id });
      toastNotify("Cập nhật sổ cấp chứng chỉ thành công", "success");
    } else {
      // Tạo mới
      response = await createDiplomaRegister(requestData);
      toastNotify("Thêm sổ cấp chứng chỉ thành công", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/diplomaRegister/diplomaregisterlist");
    }
    return response;
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    const response: apiResponse = await deleteDiplomaRegister(id);
    if (response.data) {
      toastNotify("Xóa sổ cấp chứng chỉ thành công", "success");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  return {
    diplomaRegisterInputs,
    loading,
    handleDiplomaRegisterInput,
    handleSubmit,
    handleDelete,
  };
};
