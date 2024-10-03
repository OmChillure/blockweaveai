"use client";
import React, { useState } from "react";
import Image from 'next/image';
import LogoImage from '../assets/icons/logo.png';
import MenuIcon from '../assets/icons/menu.svg';
import { ModeToggle } from './toggle';
import { isWalletConnected as checkWalletConnection, WalletButton } from "./solana/solana-provider";
import { Button } from "./ui/button";
import Link from "next/link";


export const Navbar = () => {
  const walletConnected = checkWalletConnection();

  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="bg-black">
      <div className="px-4">
    <div className="container bg-black">
      <div className="py-4 flex items-center justify-between">

      <div className="relative">
        {/* <div className='absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#F7AABE,#B57CEC,#E472D1)] blur-md '></div> */}
      <Image src={LogoImage} alt="Logo" className="h-16 w-16 relative mt-1 ml-5"/>
      {/* <LogoImage className="h-12 w-12 relative mt-1"/> */}
      </div>
      <div className='border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden'>

      <MenuIcon className="text-white" />
      </div>
      <nav className='text-white gap-6 items-center hidden sm:flex'>
        
        <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition' >About</a>
        <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Features</a>
        <a href="#" className='text-opacity-60 text-white hover:text-opacity-100 transition'>Updates</a>
        {walletConnected && (
          <div className="flex justify-center items-center">
          <Button color="primary">
            <Link href="/models">
              Models
            </Link>
          </Button>
      </div>
        )}
        <div className="flex justify-center items-center">
          <WalletButton
            style={{
              backgroundColor: "#9823C2",
              padding: "0px 10px",
              borderRadius: "8px",
            }}
          />
        </div>
      </nav>

      </div>




    </div>
    </div>
    </div>
  )
};
