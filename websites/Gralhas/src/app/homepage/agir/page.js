"use client"
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
    Card, CardHeader, CardBody, Button, CardFooter, Checkbox, Image,
    Modal, ModalBody, Input, ModalContent, ModalHeader, ModalFooter, useDisclosure
} from "@nextui-org/react";


const Agir = () => {

    const { isOpen: isOpenSocio, onOpen: onOpenSocio, onClose: onCloseSocio } = useDisclosure();
    const { isOpen: isOpenDoar, onOpen: onOpenDoar, onClose: onCloseDoar } = useDisclosure();

    const openSocio = () => { onOpenSocio(); }

    const openDoar = () => { onOpenDoar(); }

    const [assinatura, setAssinatura] = React.useState(null);
    const sigCanvas = useRef({});

    const limparAssinatura = () => {
        sigCanvas.current.clear();
        setAssinatura(null);
    };

    const salvarAssinatura = () => {
        if (sigCanvas.current.isEmpty()) {
            alert('Por favor, assine antes de salvar.');
        } else {
            setAssinatura(sigCanvas.current.toDataURL());
        }
    };

    const [signiture, setSigniture] = useState("");

    const assinaturaDigital = () => {
        setSigniture("assinaturaDigital");
    }

    const assinaturaEscrever = () => {
        setSigniture("assinaturaEscrever");
    }


    return (
        <>
            <div className="flex min-h-screen w-full justify-center bg-contain bg-center bg-no-repeat md:bg-cover items-center relative overflow-clip sm:overflow-hidden">
                <Image
                    src="/images/Gralhas.jpg"
                    alt="Gralhas"
                    className="absolute top-0 left-0 h-full w-full object-cover z-0 opacity-70"
                    width={100}
                    height={100}
                />
                <div className="flex justify-between">

                    <div className="flex space-x-8">
                        <div className="w-68">
                            <Card
                                className="w-48 h-80"
                            >
                                <CardHeader>
                                    <h1 className="text-black text-xl font-semibold">Ser Sócio</h1>
                                </CardHeader>

                                <CardBody>
                                    Aproveite e faça parte desta aventura! Desde a promoção do meio rural Barrosão até à luta contra a solidão!
                                </CardBody>

                                <CardFooter className="items-center flex justify-center">
                                    <Button
                                        color="success"
                                        onPress={() => { openSocio() }}
                                    >
                                        Ser sócio
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="w-68">
                            <Card
                                className="w-48 h-80"
                            >
                                <CardHeader>
                                    <h1 className="text-black text-xl font-semibold">Doar</h1>
                                </CardHeader>

                                <CardBody>
                                    Ao ajudar, não só faz feliz a quem cá está, mas também a quem virá!
                                </CardBody>

                                <CardFooter className="items-center flex justify-center">
                                    <Button
                                        color="success"
                                        onPress={() => { openDoar() }}
                                    >
                                        Doar
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>

                    <div>
                        <Modal
                            size={"5xl"}
                            isOpen={isOpenSocio}
                            onClose={onCloseSocio}
                        >
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Fazer-se Sócio</ModalHeader>
                                        <ModalBody>
                                            <div className="w-full flex flex-col gap-4">
                                                <Input type="text" label="Nome Completo" isRequired />
                                                <Input type="email" label="Email" isRequired />
                                                <Input type="number" label="Telemóvel" isRequired />
                                                <Input type="number" label="Telefone" />
                                                <Input type="text" label="Data de Nascimento" placeholder="format: dd-MM-yyyy" isRequired />
                                                <Checkbox defaultSelected>Tomo conhecimento das regras e normas da associação e aceito receber informações e notícias via correio eletrónico.</Checkbox>
                                                <div>
                                                    <h2 className="font-bold">Assinatura Digital</h2>
                                                    <SignatureCanvas
                                                        ref={sigCanvas}
                                                        canvasProps={{ width: 400, height: 50, style: { border: '2px solid black' } }}
                                                    />
                                                    <div className="flex space-x-2 mt-2">
                                                        <Button
                                                            color="danger"
                                                            onClick={limparAssinatura}
                                                            className="h-8 w-20"
                                                        >
                                                            Limpar
                                                        </Button>

                                                        <Button
                                                            onClick={salvarAssinatura}
                                                            color="primary"
                                                            className="h-8 w-20"
                                                        >
                                                            Guardar
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div>
                                                    {assinatura && (
                                                        <div>
                                                            <h2>Assinatura Salva</h2>
                                                            <Image width={300} height={100} src={assinatura} alt="Assinatura" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Cancelar
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>

                    <div>
                        <Modal
                            size={"5xl"}
                            isOpen={isOpenDoar}
                            onClose={onCloseDoar}
                        >
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Doar à Associação</ModalHeader>
                                        <ModalBody>
                                            <p>
                                                Neste momento pedimos que todas as doações/ajudas sejam feitas pela realização de uma transferência ou por MBWay, entrando em contacto com a nossa equipa.
                                            </p>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Cancelar
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>
                </div >
            </div >
        </>
    );
}

export default Agir;