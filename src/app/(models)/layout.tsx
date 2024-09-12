import Header from "@/components/models/header";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        {children}
      </div>        
    );
  }
  