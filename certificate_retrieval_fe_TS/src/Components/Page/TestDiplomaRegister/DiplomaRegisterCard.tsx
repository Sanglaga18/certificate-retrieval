import React from "react";
import { diplomaRegisterModel } from "../../../Interfaces";

interface Props {
  diplomaRegister: diplomaRegisterModel;
}

function DiplomaRegisterCard(prop: Props) {
  return <div>{prop.diplomaRegister.registerName}</div>;
}

export default DiplomaRegisterCard;
