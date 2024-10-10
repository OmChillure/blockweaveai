"use client"
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LogoTicker } from "@/components/LogoTicker";
import { Features } from "@/components/Features";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FAQs } from "@/components/FAQs";
import { Footer } from "@/components/Footer";
import { Updates } from "@/components/future";
import { useRef } from "react";

export default function Home() {
  const featuresRef = useRef(null);
  const updatesRef = useRef(null);

  return (
    <>
      <div className="overflow-y-hidden md:overflow-x-hidden">
      <Navbar featuresRef={featuresRef} updatesRef={updatesRef}/>
        <Hero />
        <LogoTicker />
        <Features ref={featuresRef}/>
        <ProductShowcase />
        <Updates ref={updatesRef} />
        <FAQs />
      </div>
      <Footer />
    </>
  );
}
