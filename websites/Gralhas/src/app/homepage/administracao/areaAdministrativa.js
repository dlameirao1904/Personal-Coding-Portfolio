"use client"
import {
    Card, CardHeader, CardBody, Button, CardFooter, Checkbox, Image,
    Modal, ModalBody, Input, ModalContent, ModalHeader, ModalFooter, useDisclosure
} from "@nextui-org/react";

const AreaAdministrativa = () => {
    return (
        <>

            <div  className="flex flex-col gap-8 justify-center items-center h-screen">
                <div>
                    <Button color="">
                        Sair
                    </Button>
                </div>

                <div className="text-black text-md">
                    <p>
                        Aqui consegues modificar o website à tua medida.
                    </p>
                    <p>
                        Desde editar textos até adicionar novos eventos.
                    </p>
                    <p>
                        A página de administração estará associada diretamente com ligação remota à base de dados da associação, 
                        por isso deverá ser usada com muita precaução.
                    </p>
                </div>

                <div>
                    <Card>
                        <CardHeader className="text-black text-xl font-semibold">
                            Áreas
                        </CardHeader>

                        <CardBody className='flex flex-col gap-4'>
                            <p>Escolhe a Área que pretendes editar.</p>

                            <Button color="primary">
                                Foteca
                            </Button>

                            <Button color="primary">
                                Eventos
                            </Button>

                            <Button color="primary">
                                Membros
                            </Button>

                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default AreaAdministrativa