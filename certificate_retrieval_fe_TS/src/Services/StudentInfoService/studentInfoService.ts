import { useState, useEffect } from "react";
import { useGetStudentInfoByEnrollmentIdQuery } from "../../Apis/enrollmentApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetStudentInfoByExamResultIdQuery } from "../../Apis/examResultApi";

// Custom hook xử lý logic lấy thông tin học viên qua enrollmentID
export const useFetchStudentInfoByEnrollmentID = (
  enrollmentID: string | null
) => {
  const [studentInfo, setStudentInfo] = useState<any>(null);

  // Sử dụng query API khi enrollmentID có giá trị
  const {
    data: studentData,
    isLoading,
    isError,
  } = useGetStudentInfoByEnrollmentIdQuery(
    enrollmentID ? enrollmentID : skipToken
  );

  // Cập nhật state khi API trả về dữ liệu
  useEffect(() => {
    if (isError) {
      setStudentInfo(null);
    } else if (enrollmentID) {
      // Kiểm tra nếu không có dữ liệu, reset thông tin học viên
      if (studentData?.result) {
        setStudentInfo(studentData.result);
      } else {
        setStudentInfo(null);
      }
    } else {
      setStudentInfo(null);
    }
  }, [enrollmentID, studentData, isError]);

  return { studentInfo, isLoading, isError };
};

// Custom hook xử lý logic lấy thông tin học viên qua examResultID
export const useFetchStudentInfoByExamResultID = (
  examResultID: string | null
) => {
  const [studentInfo, setStudentInfo] = useState<any>(null);

  // Sử dụng query API khi examResultID có giá trị
  const {
    data: studentData,
    isLoading,
    isError,
  } = useGetStudentInfoByExamResultIdQuery(
    examResultID ? examResultID : skipToken
  );

  // Cập nhật state khi API trả về dữ liệu
  useEffect(() => {
    if (isError) {
      setStudentInfo(null);
    } else if (examResultID) {
      // Kiểm tra nếu không có dữ liệu, reset thông tin học viên
      if (studentData?.result) {
        setStudentInfo(studentData.result);
      } else {
        setStudentInfo(null);
      }
    } else {
      setStudentInfo(null);
    }
  }, [examResultID, studentData, isError]);

  return { studentInfo, isLoading, isError };
};
