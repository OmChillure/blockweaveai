import Image from "next/image";
import React, { forwardRef } from "react";
import { Timeline } from "@/components/ui/timeline";

export const Updates = forwardRef<HTMLDivElement>((_, ref) => {
  const data = [
    {
      title: "October, 2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal mb-8">
            Built and launched <span className="font-semibold">Blockweave AI</span> & <span className="font-semibold"> Blockweave Docs </span> from scratch.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://utfs.io/f/Ejk0YhBR15NVnDt3s3j9lyQeXoMD1bKVItFxjGuScJ2Z8Hmz"
              alt="Blockweave AI launch"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05)]"
              priority
            />
            <Image
              src="https://utfs.io/f/Ejk0YhBR15NVtd6C6CDYTyqCWBULtkQvfZcOAMhoYDjEzenH"
              alt="Dashboard"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05)]"
              priority
            />
          </div>
        </div>
      ),
    },
    {
      title: "December 2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-lg font-normal mb-8">
            <span className="text-4xl font-bold">Our focus:</span><br />
            1. Account abstraction for Web2 users.<br />
            2. Launching our own API services.<br />
            3. Fine-tuning and training AI models for dataset predictions.
          </p>
        </div>
      ),
    },
    {
      title: "2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-lg font-normal mb-8">
            <span className="text-4xl font-bold">Future goals:</span><br />
            1. Providing GPU services for users.<br />
            2. Expanding API services for easier access.<br />
            ... and more updates to come.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://utfs.io/f/Ejk0YhBR15NV3oWWcTb20u1TLxahqMOdtE7y8FWpfb35Ug2m"
              alt="GPU services"
              width={400}
              height={400}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05)]"
            />
            <Image
              src="https://utfs.io/f/Ejk0YhBR15NVARopMGcn0fqc1X79k4OWzaZQmojdsug8SRE6"
              alt="API services"
              width={400}
              height={400}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05)]"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#5D2CA8]" ref={ref}>
      <Timeline data={data} />
    </div>
  );
});
