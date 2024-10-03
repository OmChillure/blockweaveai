import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input, Chip} from "@nextui-org/react";
import { SearchIcon } from "../icons/SearchIcon";
import Filters from "./filters";

export default function Left() {
  return (
    <div className="w-full col-span-2 h-full mx-auto p-5 flex bg-gradient-to-br from-black to-gray-900 flex-col py-[15%] px-8 items-center gap-y-10">
         <Input
          fullWidth
          classNames={{
            base: "max-w-full h-10",
            mainWrapper: "h-full w-full",
            input: "text-small",
            inputWrapper: "h-full w-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          className="w-full"
          placeholder="Filter tasks by name..."
          size="lg"
          startContent={<SearchIcon height={20} width={15} size={18} />}
          type="search"
          width={200}
        />
        <div className="w-full space-y-4 text-white ">
            <Filters label="Multimodal"/>
            <Filters label="Computer Vision"/>
            <Filters label="OCR"/>
        </div>
    </div>
  );
}
