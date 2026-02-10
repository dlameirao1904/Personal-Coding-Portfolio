import { useState } from "react";
import {
    Progress, Card, Divider, CardHeader, CardBody, Button,
    Modal, ModalBody, Input, ModalContent, ModalHeader, ModalFooter, useDisclosure,
    Image
} from "@nextui-org/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";


const Cartao = ({ title, idEvento, data, hora, imagem, descricao }) => {
    console.log("imagem", imagem);

    const pathname = usePathname();
    const router = useRouter();

    const handleCardClick = () => {
        router.push(pathname + "/eventos");
    };



    return (
        <>
            <div className="w-full h-full cursor-pointer" onClick={handleCardClick}>
                <Card className="w-full h-full cursor-pointer" >
                    <CardHeader className="flex gap-3 ">
                        <div className="flex justify-between w-full">
                            <div>
                                <label className="text-xl font-semibold">{title}</label>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-visible">
                        <div className="items-center">
                            <Image
                                width={500}
                                height={900}
                                src={imagem}
                                alt="Gralhas"
                            />
                        </div>
                        <div className="items-center">
                            {data} : {hora}
                        </div>
                        <div className="items-center">
                            {descricao}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default Cartao;