"use client"
import React, { useState } from 'react';
import styles from './eventos.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import "./globals.css"
import { Button } from '@nextui-org/react';
import { useRouter, usePathname } from "next/navigation";

const Eventos = ({ Component, pageProps }) => {

    const pathname = usePathname();
    const router = useRouter();
    const pathnameString = router.pathname;

    const photos = [
        { id: 1, src: "/images/gralhas_foto1.jpg", name: 'Evento 1', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' },
        { id: 2, src: "/images/gralhas_foto2.jpg", name: 'Evento 2', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' },
        { id: 3, src: "/images/gralhas_foto3.jpg", name: 'Evento 3', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' },
        { id: 4, src: "/images/gralhas_foto4.jpg", name: 'Evento 4', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' },
    ];

    const foteca = (id) => {
        console.log("id do evento: ", id);
        router.push(`/homepage/foteca/${id}`);
    }

    const [items, setItems] = useState(photos);

    const nextSlide = () => {
        setItems([...items.slice(1), items[0]]);
    };

    const prevSlide = () => {
        setItems([items[items.length - 1], ...items.slice(0, -1)]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.slide}>
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={styles.item}
                        style={{ backgroundImage: `url(${item.src})` }}
                    >
                        {index === 1 && (
                            <div className={styles.content}>
                                <div className={styles.name}>{item.name}</div>
                                <div className={styles.des}>{item.des}</div>
                                <Button
                                    onClick={() => foteca(item.id)}
                                    color='primary'
                                >
                                    Veja Mais
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.button}>
                <button className={styles.button} onClick={prevSlide}><FontAwesomeIcon icon={faArrowLeft} /></button>
                <button className={styles.button} onClick={nextSlide}><FontAwesomeIcon icon={faArrowRight} /></button>
            </div>
        </div>
    );

}

export default Eventos;