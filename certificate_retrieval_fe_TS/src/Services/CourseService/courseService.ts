import { useState, useEffect } from "react";
import {
  useDeleteCourseMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../../Apis/courseApi";
import { inputHelper } from "../../Helper";
import { toastNotify } from "../../Helper";
import { useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { apiResponse } from "../../Interfaces";

interface FormValues {
  courseName: string;
  startDate: Date;
  endDate: Date;
}

export const useCourseService = (id?: string, data?: any) => {
  // State quản lý input form
  const [courseInputs, setCourseInputs] = useState<FormValues>({
    courseName: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Hooks API
  const [deleteCourse] = useDeleteCourseMutation();
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();

  //Load dữ liệu khi có ID và data
  // useEffect(() => {
  //   if (data && data.result) {
  //     const tempData = {
  //       courseName: data.result.courseName,
  //       startDate: data.result.startDate,
  //       endDate: data.result.endDate,
  //     };
  //     console.log(tempData.startDate);
  //     console.log(tempData.endDate);
  //     setCourseInputs(tempData);
  //   }
  // }, [data]);

  // Thay đổi trong useEffect
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        courseName: data.result.courseName,
        startDate: parseISO(data.result.startDate), // Sử dụng parseISO để chuyển đổi string thành Date
        endDate: parseISO(data.result.endDate),
      };
      console.log(tempData.startDate);
      console.log(tempData.endDate);
      setCourseInputs(tempData);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleCourseInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, courseInputs);
    setCourseInputs(updatedData);
  };

  // Xử lý submit (Thêm/Sửa)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      ...(id && { courseID: id }),
      courseName: courseInputs.courseName,
      // startDate: courseInputs.startDate ?? "",
      // endDate: courseInputs.endDate ?? "",
      startDate: courseInputs.startDate
        ? format(courseInputs.startDate, "yyyy-MM-dd")
        : "", // Định dạng ngày
      endDate: courseInputs.endDate
        ? format(courseInputs.endDate, "yyyy-MM-dd")
        : "",
    };

    let response;
    if (id) {
      // Cập nhật
      response = await updateCourse({ data: requestData, id });
      toastNotify("Cập nhật khóa học thành công", "success");
    } else {
      // Tạo mới
      response = await createCourse(requestData);
      toastNotify("Thêm khóa học thành công", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/course/courselist");
    }
    return response;
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    const response: apiResponse = await deleteCourse(id);
    if (response.data) {
      toastNotify("Xóa khóa học thành công", "success");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  return {
    courseInputs,
    loading,
    handleCourseInput,
    handleSubmit,
    handleDelete,
  };
};
