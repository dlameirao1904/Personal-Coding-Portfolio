"use client"
import Image from 'next/image';
import { useEffect, useState } from 'react';
import "./styles.css"
import { Card, CardHeader, CardFooter, CardBody } from "@nextui-org/react"

const HistoriaDeGralhas = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const getOpacity = (index) => {
        const basePosition = index * window.innerHeight;
        const diff = scrollPosition - basePosition;
        const opacity = Math.max(0, Math.min(1, 1 - diff / window.innerHeight));
        return opacity;
    }

    return (
        <>
            <div className="relative flex flex-col overflow-hidden">
                <div className="relative h-screen" style={{ opacity: getOpacity(0) }}>
                    <Image
                        src="/images/gralhas_foto6.jpg"
                        alt="Gralhas"
                        className='image'
                        layout='fill'
                        objectFit='cover'
                    />
                </div>
                <div className="relative h-screen" style={{ opacity: getOpacity(1) }}>
                    <Image
                        src="/images/gralhas_foto7.jpg"
                        alt="Gralhas"
                        className='image'
                        layout='fill'
                        objectFit='cover'
                    />
                </div>
                <div className="relative h-screen" style={{ opacity: getOpacity(2) }}>
                    <Image
                        src="/images/gralhas_foto2.jpg"
                        alt="Gralhas"
                        className='image'
                        layout='fill'
                        objectFit='cover'
                    />
                </div>


                <div>
                    <div className="text-center font-bold text-black bg-green-300 p-4">
                        <h1 className="text-2xl text-black font-bold mt-12">GRALHAS - UMA ALDEIA COM HISTÓRIA</h1>
                        <br />
                        <p>Gralhas é uma aldeia portuguesa do concelho de Montalegre, faz parte do Barroso transmontano, situa-se no sopé da Serra do Larouco, onde nasce o Rio Cávado. A história da freguesia de Gralhas é milenar!... As principais actividades económicas situam-se nas áreas da agricultura e pecuária.</p>
                        <p>A história da freguesia de Gralhas é milenar. Segundo alguns autores, por aqui cruzaram estradas romanas, passando pelo &quot;opidum&quot; romano, hoje relembrado pelo lugar de Castelo Romão (castro romano). Nesta terra, aparece, com alguma frequência, cerâmica com fortes sinais de romanização. Gralhas é uma terra com uma história antiga tal como a maior parte das aldeias de Barroso, muitas delas ligadas ao movimento da fundação de Portugal iniciado por D. Afonso Henriques. Gralhas no tempo da Monarquia até ao ano de 1836, foi um concelho com Casa da Câmara, com Vereação, oficiais para o governo económico, aplicação da justiça e controlo social. Era um concelho cujo território era apenas a actual freguesia, que pertencia à Casa de Bragança, tal como Montalegre, Chaves, Barcelos e tantas outras terras que faziam parte do Ducado de Bragança.</p>

                        <br />
                        <br />
                        <br />
                        <br />
                        <br />

                        <h1 className="text-2xl text-black font-bold">A HONRA DE GRALHAS</h1>
                        <br />
                        <p>O que individualiza Gralhas, é o facto de ser uma das seis honras de Barroso a saber, as honras de Gralhas, Meixedo, Padornelos, Padroso, Tourém, Vilar de Perdizes. Todas estas honras eram terras sob protecção senhorial, detinham identidade e jurisdição própria sobre o seu território, organizando-se com um governo próprio e autónomo desde o início da nacionalidade. Por volta dos finais do século XII estas honras de Barroso aparecem associadas às alcaidarias dos castelos de Portelo e Piconha, castelos que dão nome e são apontadas como cabeça de circunscrições concelhias onde se inserem as referidas honras.</p>

                        <br />
                        <br />
                        <br />
                        <br />
                        <br />

                        <div className='flex justify-center space-x-8'>
                            <div className='h-74'>
                                <Card className='bg-amber-200 w-64 h-74'>
                                    <CardHeader>PATRIMÓNIO NATURAL</CardHeader>
                                    <CardBody>
                                        <>
                                            <ul>
                                                <li>Serra do Larouco</li>
                                            </ul>
                                        </>
                                    </CardBody>
                                </Card>
                            </div>

                            <div className='h-74'>
                                <Card className='bg-amber-200 w-64 h-74'>
                                    <CardHeader>PATRIMÓNIO ARQUITETÓNICO</CardHeader>
                                    <CardBody>
                                        <>
                                            <ul>
                                                <li>Antigo Seminário de Gralhas</li>
                                                <li>Igreja de Nossa Senhora da Assunção</li>
                                                <li>Capela de Santa Rufina</li>
                                                <li>Cruzeiros</li>
                                                <li>Fontes</li>
                                                <li>Forno do Povo</li>
                                            </ul>
                                        </>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default HistoriaDeGralhas;
