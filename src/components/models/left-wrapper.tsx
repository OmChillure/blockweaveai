"use client"
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Input, Chip, Button } from "@nextui-org/react";
import { SearchIcon } from "../icons/SearchIcon";
import MenuIcon from '../../assets/icons/menu.svg';
import Filters from "./filters";

export default function Left() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && !isOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50"
          size="sm"
          isIconOnly
        >
          <MenuIcon className="text-white" /> 
        </Button>
      )}
      <div className={`
        w-screen md:w-auto col-span-2 h-full mx-auto p-5 
        flex bg-gradient-to-br from-black to-gray-900 flex-col 
        py-[15%] px-8 items-center gap-y-10
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'fixed top-0 left-0 z-40 w-64' : ''}
      `}>
        {isMobile && (
          <Button
            onClick={toggleSidebar}
            className="absolute top-4 right-4"
            size="sm"
            isIconOnly
          >
           <MenuIcon className="text-white" /> 
          </Button>
        )}
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
    </>
  );
}