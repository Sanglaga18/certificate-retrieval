/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const inputHelper = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >,
  data: any
) => {
  const tempData: any = { ...data };
  tempData[e.target.name] = e.target.value;
  //console.log("Updated data:", tempData); // Xem giá trị cập nhật
  return tempData;
};

export default inputHelper;
