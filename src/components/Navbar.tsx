"use client";
import React, { useState } from "react";
import Image from 'next/image';
import LogoImage from '../assets/icons/logo.png';
import MenuIcon from '../assets/icons/menu.svg';
import { IsWalletConnected as checkWalletConnection, WalletButton } from "./solana/solana-provider";
import { Button } from "./ui/button";
import Link from "next/link";
import { Cross2Icon } from "@radix-ui/react-icons";

export const Navbar = () => {
  const walletConnected = checkWalletConnection();

  // State to manage mobile menu visibility
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu visibility on click
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-black">
      <div className="px-4">
        <div className="container bg-black">
          <div className="py-4 flex items-center justify-between">
            {/* Logo Section */}
            <div className="relative">
              <Image src={LogoImage} alt="Logo" className="h-12 w-12 relative mt-1 ml-2" />
            </div>

            {/* Hamburger Menu for Mobile */}
            <div className='border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden' onClick={toggleMenu}>
              {menuOpen ? (
                <Cross2Icon className="h-6 w-6 text-white" /> // Close icon when the menu is open
              ) : (
                <MenuIcon className="text-white" />  // Hamburger icon when the menu is closed
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className='text-white gap-6 items-center hidden sm:flex'>
              <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition'>About</a>
              <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Features</a>
              <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Updates</a>
              {walletConnected && (
                <Button color="primary">
                  <Link href="/models">Models</Link>
                </Button>
              )}
              <WalletButton
                style={{
                  backgroundColor: "#9823C2",
                  padding: "0px 10px",
                  borderRadius: "8px",
                }}
              />
            </nav>
          </div>

          {/* Mobile Menu (visible only on mobile) */}
          <div className={`sm:hidden ${menuOpen ? 'block' : 'hidden'} transition-all duration-300`}>
            <nav className="flex flex-col items-center gap-4 py-4 text-white">
              <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition'>About</a>
              <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Features</a>
              <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Updates</a>
              {walletConnected && (
                <Button color="primary">
                  <Link href="/models">Models</Link>
                </Button>
              )}
              <WalletButton
                style={{
                  backgroundColor: "#9823C2",
                  padding: "0px 10px",
                  borderRadius: "8px",
                }}
              />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
