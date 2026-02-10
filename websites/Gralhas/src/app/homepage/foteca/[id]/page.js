"use client"
import { useEffect, useState } from 'react';
import Image from "next/image"
import "./carrousel.css"

const FotoBiblio = ({ params }) => {
    const { id } = params;
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                console.log("tentou funçao com id", id);
                const response = await fetch(`/api/images?id=${id}`);
                const data = await response.json();
                if (response.ok) {
                    setImages(data.images);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, [id]);

    console.log("images", images);

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='slider'>

                <div className='slider-track'>
                    {images.length > 0 && images.map((image, index) => (
                        <div className='slide' key={index}>
                            <Image
                                src={`/images/eventos/evento${id}/${image}`}
                                alt={`foto/${image}`}
                                width={1000}
                                height={1000}
                            />
                        </div>
                    ))}

                    {images.length > 0 && images.map((image, index) => (
                        <div className='slide' key={index + images.length}>
                            <Image
                                src={`/images/eventos/evento${id}/${image}`}
                                alt={`foto/${image}`}
                                width={1000}
                                height={1000}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FotoBiblio;
