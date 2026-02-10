"use client"
import { useRouter } from "next/navigation"
import Slider from "@/components/Foteca/Slider"

const Foteca = () => {

    return (
        <main className="w-full min-h-screen mx-auto grid place-items-center">
            <Slider />
        </main>
    );

}

export default Foteca;