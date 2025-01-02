import { useState, useEffect } from "react";
import {
  useDeleteExamResultMutation,
  useCreateExamResultMutation,
  useUpdateExamResultMutation,
  useGetStudentInfoByExamResultIdQuery,
} from "../../Apis/examResultApi";
import { inputHelper } from "../../Helper";
import { toastNotify } from "../../Helper";
import { useNavigate } from "react-router-dom";
import { apiResponse } from "../../Interfaces";

interface FormValues {
  studentID: string;
  examID: number;
  marksObtained: number;
  examStatus: string;
}

export const useExamResultService = (id?: string, data?: any) => {
  // State quản lý input form
  const [examResultInputs, setExamResultInputs] = useState<FormValues>({
    studentID: "",
    examID: 0,
    marksObtained: 0,
    examStatus: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Hooks API
  const [deleteExamResult] = useDeleteExamResultMutation();
  const [createExamResult] = useCreateExamResultMutation();
  const [updateExamResult] = useUpdateExamResultMutation();
  const { data: studentData } = useGetStudentInfoByExamResultIdQuery(id);

  //Load dữ liệu khi có ID và data
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        studentID: data.result.studentID,
        examID: data.result.examID,
        marksObtained: data.result.marksObtained,
        examStatus: data.result.examStatus,
      };
      setExamResultInputs(tempData);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleExamResultInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, examResultInputs);
    setExamResultInputs(updatedData);
  };

  // Xử lý submit (Thêm/Sửa)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      ...(id && { ResultID: id }),
      studentID: examResultInputs.studentID,
      examID: examResultInputs.examID,
      marksObtained: examResultInputs.marksObtained,
      examStatus: examResultInputs.examStatus,
    };

    let response: apiResponse;
    if (id) {
      // Cập nhật
      response = await updateExamResult({ data: requestData, id });
      if (response.data) {
        toastNotify("Cập nhật kết quả kỳ thi thành công", "success");
        setLoading(false);
        navigate("/examResult/examResultlist");
      } else if (response.error) {
        toastNotify(response.error.data.errorMessages[0], "error");
        return;
      }
    } else {
      // Tạo mới
      response = await createExamResult(requestData);
      if (response.data) {
        toastNotify("Thêm kết quả kỳ thi thành công", "success");
        setLoading(false);
        navigate("/examResult/examResultlist");
      } else if (response.error) {
        toastNotify(response.error.data.errorMessages[0], "error");
        return;
      }
    }

    setLoading(false);
    return response;
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    const response: apiResponse = await deleteExamResult(id);
    if (response.data) {
      toastNotify("Xóa kết quả kỳ thi thành công", "success");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  return {
    examResultInputs,
    loading,
    studentData,
    handleExamResultInput,
    handleSubmit,
    handleDelete,
  };
};
