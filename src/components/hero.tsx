"use client"

import { Button } from "@nextui-org/react"

export default function Hero() {
    return(
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
    )
}