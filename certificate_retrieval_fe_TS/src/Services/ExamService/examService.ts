import { useState, useEffect } from "react";
import {
  useDeleteExamMutation,
  useCreateExamMutation,
  useUpdateExamMutation,
} from "../../Apis/examApi";
import { inputHelper } from "../../Helper";
import { toastNotify } from "../../Helper";
import { useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { apiResponse } from "../../Interfaces";

interface FormValues {
  examName: string;
  examDate: Date;
}

export const useExamService = (id?: string, data?: any) => {
  // State quản lý input form
  const [examInputs, setExamInputs] = useState<FormValues>({
    examName: "",
    examDate: new Date(),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Hooks API
  const [deleteExam] = useDeleteExamMutation();
  const [createExam] = useCreateExamMutation();
  const [updateExam] = useUpdateExamMutation();

  // Thay đổi trong useEffect
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        examName: data.result.examName,
        examDate: parseISO(data.result.examDate), // Sử dụng parseISO để chuyển đổi string thành Date
      };
      setExamInputs(tempData);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleExamInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, examInputs);
    setExamInputs(updatedData);
  };

  // Xử lý submit (Thêm/Sửa)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      ...(id && { examID: id }),
      examName: examInputs.examName,
      examDate: examInputs.examDate
        ? format(examInputs.examDate, "yyyy-MM-dd")
        : "", // Định dạng ngày
    };

    let response;
    if (id) {
      // Cập nhật
      response = await updateExam({ data: requestData, id });
      toastNotify("Cập nhật kỳ thi thành công", "success");
    } else {
      // Tạo mới
      response = await createExam(requestData);
      toastNotify("Thêm kỳ thi thành công", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/exam/examlist");
    }
    return response;
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    const response: apiResponse = await deleteExam(id);
    if (response.data) {
      toastNotify("Xóa kỳ thi thành công", "success");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  return {
    examInputs,
    loading,
    handleExamInput,
    handleSubmit,
    handleDelete,
  };
};
