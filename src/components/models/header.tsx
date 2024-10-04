"use client"
import React from "react";
import {DropdownItem, DropdownTrigger, Dropdown, DropdownMenu} from "@nextui-org/dropdown";
import {Link} from "@nextui-org/link";
import Image from "next/image";
import {Navbar, NavbarBrand, NavbarContent,NavbarMenu,NavbarMenuItem, NavbarItem, NavbarMenuToggle} from "@nextui-org/navbar";
import {Avatar} from "@nextui-org/avatar";
import { WalletButton } from "../solana/solana-provider";
import { PlusSquareIcon } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar className="h-[10vh] bg-gradient-to-br from-black to-gray-900 text-white" maxWidth="full" shouldHideOnScroll isBlurred disableAnimation>
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="mr-4">
          <Link href="/">
            <Image src={"/logos.png"} height={50} width={50} alt="logo image"></Image>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-6 w-[70vw]">
          <NavbarItem>
            <Link color="foreground" href="/models">
              Models
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/dataset" aria-current="page" color="primary">
              Datasets
            </Link>
          </NavbarItem>
          <NavbarItem >
            <Link href="/ips" aria-current="page" color="primary">
              IPS
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="https://blockweave-docs.vercel.app" target="_blank" rel="noopener noreferrer">
              Docs
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      <NavbarContent as="div" className="items-center" justify="end">
      <WalletButton />
        <Dropdown placement="bottom-end" className="bg-white rounded-md ">
          <DropdownTrigger>
            <PlusSquareIcon size={36} className="cursor-pointer" />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="Profile" variant="flat" className="hover:bg-slate-800">
            <Link href="/profile">
              Profile
            </Link>
          </DropdownItem>
            <DropdownItem className="hover:bg-slate-800">
              <Link href="/privatemodel">
                Upload Models
              </Link>
            </DropdownItem>
            <DropdownItem className="hover:bg-slate-800">
              <Link href="/privatedataset">
              Upload Datasets
              </Link>
            </DropdownItem>
            <DropdownItem key="logout" className="hover:bg-orange-800">
              <Link href="/">
              Log Out
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
