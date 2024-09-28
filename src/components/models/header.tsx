"use client"
import React from "react";
import {DropdownItem, DropdownTrigger, Dropdown, DropdownMenu} from "@nextui-org/dropdown";
import {Link} from "@nextui-org/link";
import {Input} from "@nextui-org/input";
import {Navbar, NavbarBrand, NavbarContent,NavbarMenu,NavbarMenuItem, NavbarItem, NavbarMenuToggle} from "@nextui-org/navbar";
import {Avatar} from "@nextui-org/avatar";
import {SearchIcon} from "../icons/SearchIcon.jsx";
import { WalletButton } from "../solana/solana-provider";

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
    <Navbar className="h-[10vh]" maxWidth="full" isBordered isBlurred shouldHideOnScroll disableAnimation>
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="mr-4">
          <Link href="/">
          <p className="hidden sm:block font-bold text-foreground">Blockweave.ai</p>
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
            <Link color="foreground" href="/docs">
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
        <Dropdown placement="bottom-end" className="bg-black ">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="Profile" variant="flat">
            <Link href="/profile">
              Profile
            </Link>
          </DropdownItem>
            <DropdownItem key="settings">
              <Link href="/privatemodel">
                Upload Models
              </Link>
            </DropdownItem>
            <DropdownItem key="team_settings">
              <Link href="/privatedataset">
              Upload Datasets
              </Link>
            </DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
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
