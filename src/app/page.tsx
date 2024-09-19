import { AccordionComponent } from "@/components/accordion-component";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center flex-col bg-background">
      <Header />
      <Hero/>
      <div className="flex justify-center items-center w-full my-[8rem]">
      <AccordionComponent />
      </div>
      <Footer /> 
    </div>
  );
}
