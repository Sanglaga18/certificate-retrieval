import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useGetCertificateQuery } from "../../Apis/certificateApi";
import { useGetDiplomaQuery } from "../../Apis/diplomaApi";
import { inputHelper } from "../../Helper";

export const useHomeService = () => {
  const navigate = useNavigate();
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  const [filters, setFilters] = useState({ searchString: "" });
  const [documentData, setDocumentData] = useState<any[]>([]);
  const [apiFilters, setApiFilters] = useState({ searchString: "" });
  const [inputError, setInputError] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [documentType, setDocumentType] = useState("diploma");

  const encodeSpecialChars = (input: string) => encodeURIComponent(input);

  const { data: certificateDataResult, isLoading: isLoadingCertificate } =
    useGetCertificateQuery(
      shouldSearch && documentType === "certificate"
        ? {
            ...(apiFilters && {
              userID: userData.id,
              searchString: apiFilters.searchString,
            }),
          }
        : {},
      { skip: !(shouldSearch && documentType === "certificate") }
    );

  const { data: diplomaDataResult, isLoading: isLoadingDiploma } =
    useGetDiplomaQuery(
      shouldSearch && documentType === "diploma"
        ? {
            ...(apiFilters && {
              userID: userData.id,
              searchString: apiFilters.searchString,
            }),
          }
        : {},
      { skip: !(shouldSearch && documentType === "diploma") }
    );

  const isLoading = isLoadingCertificate || isLoadingDiploma;
  const handleNavigate = async (type: string, id: string) => {
    if (type === "diploma") {
      navigate("/diploma/diplomaInfo/" + encodeSpecialChars(id));
    } else {
      navigate("/certificate/certificateInfo/" + encodeSpecialChars(id));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempValue = inputHelper(e, filters);
    setFilters(tempValue);

    if (tempValue.searchString.trim() === "") {
      setInputError(true);
    } else {
      setInputError(false);
    }
  };

  const handleChangeDocumentType = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedType = e.target.value;
    setDocumentType(selectedType);
    setFilters({ searchString: "" });
    setDocumentData([]);
    setHasSearched(false);
    setShouldSearch(false);
  };

  const handleFilters = () => {
    if (!userData.id) {
      navigate("/login");
      return;
    }
    if (userData.isActive === "false") {
      navigate("/account-pending-approval");
      return;
    }
    if (filters.searchString.trim() === "") {
      setInputError(true);
      return;
    }
    setApiFilters({ searchString: filters.searchString });
    setShouldSearch(true);
    setHasSearched(true);
  };

  useEffect(() => {
    if (shouldSearch) {
      if (documentType === "certificate" && certificateDataResult) {
        setDocumentData(
          certificateDataResult.statusCode === 404
            ? []
            : certificateDataResult.result
        );
      } else if (documentType === "diploma" && diplomaDataResult) {
        setDocumentData(
          diplomaDataResult.statusCode === 404 ? [] : diplomaDataResult.result
        );
      }
    }
  }, [certificateDataResult, diplomaDataResult, shouldSearch, documentType]);

  return {
    filters,
    documentData,
    documentType,
    isLoading,
    inputError,
    hasSearched,
    handleChange,
    handleNavigate,
    handleChangeDocumentType,
    handleFilters,
    encodeSpecialChars,
  };
};
