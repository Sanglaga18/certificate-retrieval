import { useState, useEffect } from "react";
import { inputHelper } from "../../Helper";
import { toastNotify } from "../../Helper";
import { useNavigate } from "react-router-dom";
import { apiResponse } from "../../Interfaces";
import {
  useCreateDiplomaMutation,
  useDeleteDiplomaMutation,
  useUpdateDiplomaMutation,
} from "../../Apis/diplomaApi";
import { format } from "date-fns";
import {
  clearDiplomaNumber,
  setDiplomaNumber,
} from "../../Storage/Redux/diplomaSlice";
import { useDispatch } from "react-redux";
import { useFetchStudentInfoByExamResultID } from "../StudentInfoService/studentInfoService";

const diplomaData = {
  diplomaNumber: "",
  registryNumber: "",
  diplomaRegisterID: "",
  diplomaName: "",
  issueDate: new Date(),
  isValid: "true",
  issuingOrganization: "",
  examResultID: "",
  description: "",
};

export const useDiplomaService = (id?: string, data?: any) => {
  // State quản lý input form
  const [diplomaInputs, setDiplomaInputs] = useState(diplomaData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");

  // State để lưu mã đăng ký học viên
  const [examResultID, setExamResultID] = useState<string | null>(null);

  // Hook lấy thông tin học viên
  const { studentInfo } = useFetchStudentInfoByExamResultID(examResultID);

  // Hooks API
  const [deleteDiploma] = useDeleteDiplomaMutation();
  const [createDiploma] = useCreateDiplomaMutation();
  const [updateDiploma] = useUpdateDiplomaMutation();

  const encodeSpecialChars = (input: string) => {
    return encodeURIComponent(input);
  };

  //Load dữ liệu khi có ID và data
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        diplomaNumber: data.result.diplomaNumber,
        registryNumber: data.result.registryNumber,
        diplomaRegisterID: data.result.diplomaRegisterID,
        diplomaName: data.result.diplomaName,
        issueDate: new Date(data.result.issueDate),
        isValid: String(data.result.isValid),
        issuingOrganization: data.result.issuingOrganization,
        examResultID: data.result.examResultID,
        description: data.result.description,
      };
      //console.log(tempData);
      setDiplomaInputs(tempData);
      //console.log(diplomaInputs);
      setExamResultID(data.result.examResultID);
      setImageToDisplay(data.result.image);
    }
  }, [data]);

  // Xử lý thay đổi input
  const handleDiplomaInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const updatedData = inputHelper(e, diplomaInputs);
    setDiplomaInputs(updatedData);
  };

  const handleExamResultIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Cập nhật giá trị examResultID trong diplomaInputs
    handleDiplomaInput(e);

    // Cập nhật state examResultID để gọi API
    const newExamResultID = e.target.value;
    setExamResultID(newExamResultID);
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
      toastNotify("Vui lòng chọn hình chứng chỉ", "error");
      setLoading(false);
      return;
    }

    if (hasDiacritics(diplomaInputs.diplomaNumber)) {
      toastNotify("Số hiệu chứng chỉ không được chứa ký tự có dấu", "error");
      setLoading(false);
      return;
    }

    if (hasDiacritics(diplomaInputs.registryNumber)) {
      toastNotify("Số vào sổ lưu không được chứa ký tự có dấu", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("diplomaNumber", diplomaInputs.diplomaNumber);
    formData.append("registryNumber", diplomaInputs.registryNumber);
    formData.append("diplomaRegisterID", diplomaInputs.diplomaRegisterID);
    formData.append("diplomaName", diplomaInputs.diplomaName);
    formData.append("issueDate", format(diplomaInputs.issueDate, "yyyy-MM-dd"));
    formData.append("isValid", diplomaInputs.isValid);
    formData.append("issuingOrganization", diplomaInputs.issuingOrganization);
    formData.append("examResultID", diplomaInputs.examResultID);
    if (imageToStore) formData.append("File", imageToStore);
    formData.append("description", diplomaInputs.description ?? "");

    //console.log(Array.from(formData.entries()));

    let response: apiResponse;

    if (id) {
      //update
      formData.append("Id", id);
      const encodedId = encodeSpecialChars(id);
      response = await updateDiploma({ data: formData, id: encodedId });
      if (response.data) {
        toastNotify("Sửa chứng chỉ thành công", "success");
        setLoading(false);
        navigate("/diploma/diplomalist");
      } else if (response.error) {
        //console.log(response.error.data.errorMessages[0]);
        toastNotify(response.error.data.errorMessages[0], "error");
        return;
      }
    } else {
      //create
      response = await createDiploma(formData);
      if (response.data) {
        toastNotify("Thêm chứng chỉ thành công", "success");
        setLoading(false);
        navigate("/diploma/diplomalist");
      } else if (response.error) {
        //console.log(response.error.data.errorMessages[0]);
        toastNotify(response.error.data.errorMessages[0], "error");
        return;
      }
    }

    // if (response.data) {
    //   setLoading(false);
    //   navigate("/diploma/diplomalist");
    // }

    setLoading(false);
  };

  const handleNavigate = async (id: string | undefined) => {
    if (id) {
      //console.log(id);
      dispatch(setDiplomaNumber(id));
      navigate("/diploma/diplomaUpsert/" + encodeSpecialChars(id));
    } else {
      dispatch(clearDiplomaNumber());
      navigate("/diploma/diplomaUpsert/");
    }
  };

  // Xử lý xóa
  const handleDelete = async (id: string) => {
    const response: apiResponse = await deleteDiploma(encodeSpecialChars(id));
    if (response.data) {
      toastNotify("Xóa chứng chỉ thành công", "success");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
      return;
    }
  };

  return {
    diplomaInputs,
    loading,
    imageToDisplay,
    studentInfo,
    handleDiplomaInput,
    handleExamResultIDChange,
    handleFileChange,
    handleSubmit,
    handleNavigate,
    handleDelete,
  };
};
