"use client"
import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Example = () => {
    const images = [
        "/images/gralhas_foto1.jpg",
        "/images/gralhas_foto2.jpg",
        "/images/gralhas_foto3.jpg",
        "/images/gralhas_foto4.jpg"
    ];

    const properties = {
        duration: 3000,
        prevArrow: (
            <div className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </div>
        ),
        nextArrow: (
            <div className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        )
    };

    return (
        <Slide {...properties} >
            <div className="flex items-center justify-center bg-contain bg-center bg-no-repeat h-[300px]" style={{ backgroundImage: `url(${images[0]})` }}>
                <span className="p-8 text-lg bg-gray-300 text-center"><a href='/homepage/eventos'>Evento 1</a></span>
            </div>
            <div className="flex items-center justify-center bg-contain bg-center bg-no-repeat h-[300px]" style={{ backgroundImage: `url(${images[1]})` }}>
                <span className="p-8 text-lg bg-gray-300 text-center"><a href='/homepage/eventos'>Evento 2</a></span>
            </div>
            <div className="flex items-center justify-center bg-contain bg-center bg-no-repeat h-[300px]" style={{ backgroundImage: `url(${images[2]})` }}>
                <span className="p-8 text-lg bg-gray-300 text-center"><a href='/homepage/eventos'>Evento 3</a></span>
            </div>
            <div className="flex items-center justify-center bg-contain bg-center bg-no-repeat h-[300px]" style={{ backgroundImage: `url(${images[3]})` }}>
                <span className="p-8 text-lg bg-gray-300 text-center"><a href='/homepage/eventos'>Evento 4</a></span>
            </div>
        </Slide>
    );
};

export default Example;
