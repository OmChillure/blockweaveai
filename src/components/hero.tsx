"use client"

import { Button } from "@nextui-org/react"
import Image from 'next/image'

export default function Hero() {
    return(
        <>
        <div className="md:w-[70%] w-full h-[90svh] flex justify-center items-center flex-col gap-y-3">
            <div className="md:text-9xl text-5xl font-bold bg-gradient-to-b from-primary-700 to-primary-200 bg-clip-text text-transparent py-3">
                Hugging Face
            </div>
            <div className="md:text-2xl md:w-[70%] w-[90%] text-center font-normal text-foreground/80">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, perspiciatis!
            </div>
            <div className="mt-3">
                <Button className="font-semibold" color="primary" variant="shadow">
                    Get started
                </Button>
            </div>
        </div>
        <div>
        <div className="relative flex max-w-6xl justify-center overflow-hidden mt-7">
            <div className="relative rounded-xl">
                <Image
                    src="https://utfs.io/f/Ejk0YhBR15NVAvtOGen0fqc1X79k4OWzaZQmojdsug8SRE6Y"
                    alt="Nextjs Starter Kit Dashboard Preview"
                    width={1100}
                    height={550}
                    priority={true}
                    className="block rounded-[inherit] border object-contain shadow-lg dark:hidden"
                />
                <Image
                    src="https://utfs.io/f/Ejk0YhBR15NVAvtOGen0fqc1X79k4OWzaZQmojdsug8SRE6Y"
                    width={1100}
                    height={550}
                    alt="Nextjs Starter Kit Dark Mode Dashboard Preview"
                    priority={true}
                    className="dark:block rounded-[inherit] border object-contain shadow-lg hidden"
                />
            </div>
        </div>
    </div>
    </>
    )
}