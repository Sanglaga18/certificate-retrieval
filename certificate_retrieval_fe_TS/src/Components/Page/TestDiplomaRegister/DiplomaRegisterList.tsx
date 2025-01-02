import React, { useEffect, useState } from "react";
import { diplomaRegisterModel } from "../../../Interfaces";
import DiplomaRegisterCard from "./DiplomaRegisterCard";
import { useDispatch } from "react-redux";
import { setDiplomaRegister } from "../../../Storage/Redux/diplomaRegisterSlice";
import { useGetDiplomaRegisterQuery } from "../../../Apis/diplomaRegisterApi";

function DiplomaRegisterList() {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetDiplomaRegisterQuery(null);

  // const [DiplomaRegister, setDiplomaRegister] = useState<
  //   DiplomaRegisterModel[]
  // >([]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setDiplomaRegister(data.result));
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container row">
      {data.result.length > 0 &&
        data.result.map(
          (DiplomaRegister: diplomaRegisterModel, index: number) => (
            <DiplomaRegisterCard
              diplomaRegister={DiplomaRegister}
              key={index}
            />
          )
        )}
    </div>
  );
}

export default DiplomaRegisterList;
