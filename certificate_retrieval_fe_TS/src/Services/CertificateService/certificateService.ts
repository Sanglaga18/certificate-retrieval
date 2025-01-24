import { useState, useEffect } from "react";
import { inputHelper } from "../../Helper";
import { toastNotify } from "../../Helper";
import { useNavigate } from "react-router-dom";
import {
  useCreateCertificateMutation,
  useDeleteCertificateMutation,
  useUpdateCertificateMutation,
} from "../../Apis/certificateApi";
import { format } from "date-fns";
import { apiResponse } from "../../Interfaces";
import { useDispatch } from "react-redux";
import {
  clearCertificateID,
  setCertificateID,
} from "../../Storage/Redux/certificateSlice";

import { useFetchStudentInfoByEnrollmentID } from "../StudentInfoService/studentInfoService";

const certificateData = {
  certificateID: "",
  registryNumber: "",
  certificateRegisterID: "",
  certificateName: "",
  issueDate: new Date(),
  isValid: "true",
  issuingOrganization: "",
  enrollmentID: "",
  description: "",
};

export const useCertificateService = (id?: string, data?: any) => {
  // State quản lý input form
  const [certificateInputs, setCertificateInputs] = useState(certificateData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");

  // State để lưu mã đăng ký học viên
  const [enrollmentID, setEnrollmentID] = useState<string | null>(null);

  // Hook lấy thông tin học viên
  const { studentInfo } = useFetchStudentInfoByEnrollmentID(enrollmentID);

  // Hooks API
  const [deleteCertificate] = useDeleteCertificateMutation();
  const [createCertificate] = useCreateCertificateMutation();
  const [updateCertificate] = useUpdateCertificateMutation();

  const encodeSpecialChars = (input: string) => {
    return encodeURIComponent(input);
  };

  //Load dữ liệu khi có ID và data
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        certificateID: data.result.certificateID,
        registryNumber: data.result.registryNumber,
        certificateRegisterID: data.result.certificateRegisterID,
        certificateName: data.result.certificateName,
        issueDate: new Date(data.result.issueDate),
        isValid: String(data.result.isValid),
        issuingOrganization: data.result.issuingOrganization,
        enrollmentID: data.result.enrollmentID,
        description: data.result.description,
      };
      setCertificateInputs(tempData);
      setEnrollmentID(data.result.enrollmentID);
      setImageToDisplay(data.result.image);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleCertificateInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, certificateInputs);
    setCertificateInputs(updatedData);
  };

  const handleEnrollmentIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Cập nhật giá trị enrollmentID trong certificateInputs
    handleCertificateInput(e);

    // Cập nhật state enrollmentID để gọi API
    const newEnrollmentID = e.target.value;
    setEnrollmentID(newEnrollmentID);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];
      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });
      if (file.size > 5000 * 1024) {
        setImageToStore("");
        toastNotify("File phải nhỏ hơn 5 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File phải là định dạng jpeg, jpg hoặc png", "error");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToDisplay(imgUrl);
      };
    }
  };

  // Hàm kiểm tra chuỗi có chứa ký tự có dấu
  const hasDiacritics = (text: string): boolean => {
    const diacriticsRegex =
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    return diacriticsRegex.test(text);
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

    if (hasDiacritics(certificateInputs.certificateID)) {
      toastNotify("Số hiệu chứng nhận không được chứa ký tự có dấu", "error");
      setLoading(false);
      return;
    }

    if (hasDiacritics(certificateInputs.registryNumber)) {
      toastNotify("Số vào sổ lưu không được chứa ký tự có dấu", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("certificateID", certificateInputs.certificateID);
    formData.append("registryNumber", certificateInputs.registryNumber);
    formData.append(
      "certificateRegisterID",
      certificateInputs.certificateRegisterID
    );
    formData.append("certificateName", certificateInputs.certificateName);
    formData.append(
      "issueDate",
      format(certificateInputs.issueDate, "yyyy-MM-dd")
    );
    formData.append("isValid", certificateInputs.isValid);
    formData.append(
      "issuingOrganization",
      certificateInputs.issuingOrganization
    );
    formData.append("enrollmentID", certificateInputs.enrollmentID);
    if (imageToStore) formData.append("File", imageToStore);
    formData.append("description", certificateInputs.description ?? "");

    //console.log(Array.from(formData.entries()));

    let response: apiResponse;

    if (id) {
      //update
      formData.append("Id", id);
      const encodedId = encodeSpecialChars(id);
      response = await updateCertificate({ data: formData, id: encodedId });
      if (response.data) {
        toastNotify("Sửa chứng nhận thành công", "success");
        setLoading(false);
        navigate("/certificate/certificatelist");
      } else if (response.error) {
        toastNotify(response.error.data.errorMessages[0], "error");
        return;
      }
    } else {
      //create
      response = await createCertificate(formData);
      if (response.data) {
        toastNotify("Thêm chứng nhận thành công", "success");
        setLoading(false);
        navigate("/certificate/certificatelist");
      } else if (response.error) {
        toastNotify(response.error.data.errorMessages[0], "error");
        return;
      }
    }

    setLoading(false);
  };

  const handleNavigate = async (id: string | undefined) => {
    if (id) {
      //console.log(id);
      dispatch(setCertificateID(id));
      navigate("/certificate/certificateUpsert/" + encodeSpecialChars(id));
    } else {
      dispatch(clearCertificateID());
      navigate("/certificate/certificateUpsert/");
    }
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    const response: apiResponse = await deleteCertificate(
      encodeSpecialChars(id)
    );
    if (response.data) {
      toastNotify("Xóa chứng nhận thành công", "success");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  return {
    certificateInputs,
    loading,
    imageToDisplay,
    studentInfo,
    handleCertificateInput,
    handleEnrollmentIDChange,
    handleFileChange,
    handleSubmit,
    handleNavigate,
    handleDelete,
  };
};
