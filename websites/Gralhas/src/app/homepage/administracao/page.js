"use client"
import React, { useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
    Card, CardHeader, CardBody, Button, CardFooter, Checkbox, Image,
    Modal, ModalBody, Input, ModalContent, ModalHeader, ModalFooter, useDisclosure
} from "@nextui-org/react";
import AreaAdministrativa from './areaAdministrativa';
import {EyeFilledIcon} from "./EyeFilledIcon";
import {EyeSlashFilledIcon} from "./EyeSlashFilledIcon";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Administracao = () => {

    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    const [area, setArea] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    
    console.log("area: ", area)

    const loginFixo = { user: "adminGralhas", pass: "adminGralhas" };

    const entrar = () => {
        if (username === loginFixo.user && pass === loginFixo.pass) {
            setArea(true);
            toast.success('Login feito com sucesso.');
        }
        else {
            setArea(false)
            toast.error('Username ou password incorretos.');
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            entrar();
        }
    };

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                {area === false ? <Card
                    className='w-80 h-80'
                >
                    <CardHeader>
                        <h1 className="text-black text-xl font-semibold">
                            Área de Administração
                        </h1>
                    </CardHeader>

                    <CardBody
                        className='flex flex-col gap-4'
                    >
                        <Input type="text" label="Username" value={username} onValueChange={setUsername} onKeyDown={handleKeyDown}/>
                        <Input label="Password" value={pass} onValueChange={setPass}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            onKeyDown={handleKeyDown}
                        />

                        <Button
                            color='primary'
                            className=''
                            onClick={() => { entrar() }}
                        >
                            Entrar
                        </Button>
                    </CardBody>

                </Card> : <AreaAdministrativa />}
            </div>



        </>
    );
}

export default Administracao;