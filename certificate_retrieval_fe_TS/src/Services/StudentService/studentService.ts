import { useState, useEffect } from "react";
import { inputHelper } from "../../Helper";
import { toastNotify } from "../../Helper";
import { useNavigate } from "react-router-dom";
import { useUpdateStudentMutation } from "../../Apis/studentApi";
import { apiResponse } from "../../Interfaces";

const studentData = {
  studentID: "",
  userID: 0,
  image: "",
  frontIdCard: "",
  backIdCard: "",
};

export const useStudentService = (id?: string, data?: any) => {
  // State quản lý input form
  const [studentInputs, setStudentInputs] = useState(studentData);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [frontIdCardToStore, setFrontIdCardToStore] = useState<any>();
  const [frontIdCardToDisplay, setFrontIdCardToDisplay] = useState<string>("");
  const [backIdCardToStore, setBackIdCardToStore] = useState<any>();
  const [backIdCardToDisplay, setBackIdCardToDisplay] = useState<string>("");

  // Hooks API
  const [updateStudent] = useUpdateStudentMutation();

  //Load dữ liệu khi có ID và data
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        studentID: data.result.studentID,
        userID: data.result.userID,
        image: data.result.image,
        frontIdCard: data.result.frontIdCard,
        backIdCard: data.result.backIdCard,
      };
      setStudentInputs(tempData);
      //console.log(tempData);
      setImageToDisplay(data.result.image);
      setFrontIdCardToDisplay(data.result.frontIdCard);
      setBackIdCardToDisplay(data.result.backIdCard);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleStudentInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, studentInputs);
    setStudentInputs(updatedData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]; // Lấy tệp đầu tiên
    const { name } = e.target; // Lấy name của input để phân biệt

    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];
      const isImageTypeValid = validImgTypes.includes(imgType);

      if (file.size > 5000 * 1024) {
        toastNotify("File phải nhỏ hơn 5 MB", "error");
        return;
      } else if (!isImageTypeValid) {
        toastNotify("File phải là định dạng jpeg, jpg hoặc png", "error");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;

        // Cập nhật đúng state dựa trên name
        if (name === "image") {
          setImageToStore(file);
          setImageToDisplay(imgUrl);
        } else if (name === "frontIdCard") {
          setFrontIdCardToStore(file);
          setFrontIdCardToDisplay(imgUrl);
        } else if (name === "backIdCard") {
          setBackIdCardToStore(file);
          setBackIdCardToDisplay(imgUrl);
        }
      };
    }
  };

  // Xử lý submit (Thêm/Sửa)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!imageToStore && !id) {
      toastNotify("Vui lòng chọn hình chứng nhận", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("studentID", studentInputs.studentID);
    if (imageToStore) formData.append("Image", imageToStore);
    if (frontIdCardToStore) formData.append("FrontIdCard", frontIdCardToStore);
    if (backIdCardToStore) formData.append("BackIdCard", backIdCardToStore);

    //console.log(Array.from(formData.entries()));

    let response: apiResponse;

    if (id) {
      //update
      formData.append("Id", id);
      response = await updateStudent({ data: formData, id });
      if (response.data) {
        toastNotify("Cập nhật ảnh cho học viên thành công", "success");
        setLoading(false);
        navigate("/student/studentlist");
      } else if (response.error) {
        toastNotify(response.error.data.errorMessages[0], "error");
        return;
      }
    }
    setLoading(false);
  };

  return {
    studentInputs,
    loading,
    imageToDisplay,
    frontIdCardToDisplay,
    backIdCardToDisplay,
    handleStudentInput,
    handleFileChange,
    handleSubmit,
  };
};
