import Header from "@/components/models/header";
import Left from "@/components/models/left-wrapper";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="min-h-screen w-full bg-background">
        <Header/>
        <div className="min-h-[90vh] grid grid-cols-12 grid-rows-1 place-content-center">
          <Left/>
          {children}
        </div>
      </div>        
    );
  }
  