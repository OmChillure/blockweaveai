"use client"
import React from "react";
import {CheckboxGroup} from "@nextui-org/react";
import {CustomCheckbox} from "./checkbox";

export default function Filters({label}:{label:string}) {
  return (
    <div className="w-full">
      <CheckboxGroup
        label={label}
        classNames={{
          base: "w-full",
          label: "text-white mb-2"
        }}
      >
        <div className="grid grid-cols-3 gap-2">
          <CustomCheckbox value="wifi">Wifi</CustomCheckbox>
          <CustomCheckbox value="tv">TV</CustomCheckbox>
          <CustomCheckbox value="kitchen">Kitchen</CustomCheckbox>
          <CustomCheckbox value="parking">Parking</CustomCheckbox>
          <CustomCheckbox value="pool">Pool</CustomCheckbox>
          <CustomCheckbox value="gym">Gym</CustomCheckbox>
        </div>
      </CheckboxGroup>
    </div>
  );
}