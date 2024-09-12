"use client"
import React from "react";
import {CheckboxGroup} from "@nextui-org/react";
import {CustomCheckbox} from "./checkbox";

export default function Filters({label}:{label:string}) {

  return (
    <div className="flex flex-wrap gap-1 w-full">
      <CheckboxGroup
        className="gap-1"
        label={label}
        orientation="horizontal"
      >
        <CustomCheckbox value="wifi">Wifi</CustomCheckbox>
        <CustomCheckbox value="tv">TV</CustomCheckbox>
        <CustomCheckbox value="kitchen">Kitchen</CustomCheckbox>
        <CustomCheckbox value="parking">Parking</CustomCheckbox>
        <CustomCheckbox value="pool">Pool</CustomCheckbox>
        <CustomCheckbox value="gym">Gym</CustomCheckbox>
      </CheckboxGroup>
    </div>
  );
}
