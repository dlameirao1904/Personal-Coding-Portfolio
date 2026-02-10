'use client'
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { FaExpand } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import Loader from '../Loader/Loader';
import { FaInfoCircle } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import Sidebar from './Sidebar';



export default function Navbar({ toggle, children, breadcrumbs }) {

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    const [sidebarOpen, setSidebarOpen] = useState(false);

    function toggleSidebar() {
        setSidebarOpen(!sidebarOpen);
    }

    return (
        <nav className="bg-white w-full shadow-md sticky top-0 z-30 h-16">
            <div className="w-full flex items-center justify-between py-4 px-6">
                <div className='flex items-center space-x-4'>
                    <a href="#" onClick={toggleSidebar} className="cursor-pointer text-black hover:text-bold py-2 px-4 flex items-center">
                        <FaList className="mt-1" /><span className="ml-1 hidden sm:block"></span>
                    </a>

                    <a href="#" className="cursor-pointer text-black hover:text-bold py-2 px-4 flex items-center">
                        <FaInfoCircle className="mt-1" /><span className="ml-1 hidden sm:block"></span>
                    </a>
                </div>

                <div className='items-center text-sm font-semibold'>
                    <h1 className=''><a href='/homepage'>Associação ARDSC de Gralhas</a></h1>
                </div>

                <div className="flex items-center space-x-4">
                    <a href="#" className="cursor-pointer text-black hover:text-bold py-2 px-4 flex items-center">
                        <FaShoppingCart className="mt-1" />
                    </a>

                    <a onClick={toggleFullScreen} className="cursor-pointer text-black hover:text-bold py-2 px-4 flex items-center">
                        <FaExpand className="mt-1" /><span className="ml-1 hidden sm:block"></span>
                    </a>
                </div>
            </div>

            {sidebarOpen && (
                <div className="bg-white w-64 h-screen fixed left-0 top-16 z-20">
                    <Sidebar/>
                </div>
            )}
        </nav>
    );
}