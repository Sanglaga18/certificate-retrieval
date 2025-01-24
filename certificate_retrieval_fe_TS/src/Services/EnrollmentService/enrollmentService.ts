import { useState, useEffect } from "react";
import {
  useDeleteEnrollmentMutation,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
} from "../../Apis/enrollmentApi";
import { inputHelper } from "../../Helper";
import { toastNotify } from "../../Helper";
import { useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { apiResponse } from "../../Interfaces";

interface FormValues {
  studentID: string;
  courseID: number;
  enrollmentDate: Date;
  finalTestScore: number;
}

export const useEnrollmentService = (id?: string, data?: any) => {
  // State quản lý input form
  const [enrollmentInputs, setEnrollmentInputs] = useState<FormValues>({
    studentID: "",
    courseID: 0,
    enrollmentDate: new Date(),
    finalTestScore: 0,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Hooks API
  const [deleteEnrollment] = useDeleteEnrollmentMutation();
  const [createEnrollment] = useCreateEnrollmentMutation();
  const [updateEnrollment] = useUpdateEnrollmentMutation();

  //Load dữ liệu khi có ID và data
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        studentID: data.result.studentID,
        courseID: data.result.courseID,
        enrollmentDate: parseISO(data.result.enrollmentDate),
        finalTestScore: data.result.finalTestScore,
      };
      setEnrollmentInputs(tempData);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleEnrollmentInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, enrollmentInputs);
    setEnrollmentInputs(updatedData);
  };

  // Xử lý submit (Thêm/Sửa)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      ...(id && { enrollmentID: id }),
      studentID: enrollmentInputs.studentID,
      courseID: enrollmentInputs.courseID,
      enrollmentDate: enrollmentInputs.enrollmentDate
        ? format(enrollmentInputs.enrollmentDate, "yyyy-MM-dd")
        : "",
      finalTestScore: enrollmentInputs.finalTestScore,
    };

    let response: apiResponse;
    if (id) {
      // Cập nhật
      response = await updateEnrollment({ data: requestData, id });
      if (response.data) {
        toastNotify(
          "Cập nhật thông tin đăng ký khóa học thành công",
          "success"
        );
        setLoading(false);
        navigate("/enrollment/enrollmentlist");
      } else if (response.error) {
        toastNotify(response.error.data.errorMessages[0], "error");
        return;
      }
    } else {
      // Tạo mới
      response = await createEnrollment(requestData);
      if (response.data) {
        toastNotify("Thêm thông tin đăng ký khóa học thành công", "success");
        setLoading(false);
        navigate("/enrollment/enrollmentlist");
      } else if (response.error) {
        toastNotify(response.error.data.errorMessages[0], "error");
        return;
      }
    }
    setLoading(false);
    //return response;
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    const response: apiResponse = await deleteEnrollment(id);
    if (response.data) {
      toastNotify("Xóa thông tin đăng ký khóa học thành công", "success");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  return {
    enrollmentInputs,
    loading,
    handleEnrollmentInput,
    handleSubmit,
    handleDelete,
  };
};
