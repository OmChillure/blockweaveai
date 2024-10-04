import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LogoTicker } from "@/components/LogoTicker";
import { Features } from "@/components/Features";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FAQs } from "@/components/FAQs";
import { Footer } from "@/components/Footer";
import { TimelineView } from "@/components/future";

export default function Home() {
  return (
    <>
      <div className="overflow-y-hidden md:overflow-x-hidden">
        <Navbar />
        <Hero />
        <LogoTicker />
        <Features />
        <ProductShowcase />
        <TimelineView />
        <FAQs />
      </div>
      <Footer />
    </>
  );
}
