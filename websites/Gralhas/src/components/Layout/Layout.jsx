"use client"
import Head from 'next/head';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';

const Layout = ({children}) => {
    return (
        <>
            <div className='h-screen w-full absolute'>
                <Head>
                    <title>ARDSC</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Navbar/>

                <div className="">
                    {children}
                </div>
            </div>
        </>
    );
}

export default Layout;