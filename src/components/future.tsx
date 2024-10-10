import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function TimelineView() {
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
              alt="startup"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://utfs.io/f/Ejk0YhBR15NVtd6C6CDYTyqCWBULtkQvfZcOAMhoYDjEzenH"
              alt="dashboard image"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
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
            <span className="text-4xl font-bold"> During This time we will focus on </span>
            <br />
            1. Adding account abstraction methods for web2 users using services. <br />
            2. Launching our own API services. <br />
            3. Fine tuning and training our own AI models for dataset predictions.
          </p>

        </div>
      ),
    },
    {
      title: "2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-lg font-normal mb-8">
            <span className="text-4xl font-bold">More updates to go </span>
            <br />
            1. Providing GPU for the users will be our next priority. <br />
            2. Building our own api service for more easy access. <br />
            <br />
            and many more to come....
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://utfs.io/f/Ejk0YhBR15NV3oWWcTb20u1TLxahqMOdtE7y8FWpfb35Ug2m"
              alt="gpu image"
              width={400}
              height={400}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://utfs.io/f/Ejk0YhBR15NVARopMGcn0fqc1X79k4OWzaZQmojdsug8SRE6"
              alt="api image"
              width={400}
              height={400}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            {/* <Image
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://assets.aceternity.com/cards.png"
              alt="cards template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            /> */}
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full bg-[#5D2CA8]">
      <Timeline data={data} />
    </div>
  );
}
