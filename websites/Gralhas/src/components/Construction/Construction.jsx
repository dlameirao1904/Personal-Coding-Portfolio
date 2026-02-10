"use client"
import Image from 'next/image';

const Construction = () => {

    return (
        <>

            <p className="mt-12 text-black text-center text-2xl font-bold">
                Página em construção. Volte em breve!
            </p>

            <div className="flex justify-center -mt-16 items-center h-screen">

                <Image
                    src="/images/componentes/construction.jpg"
                    alt="Gralhas"
                    className="w-50 h-50"
                    width={100}
                    height={100}
                />

            </div>
        </>
    );
}

export default Construction;