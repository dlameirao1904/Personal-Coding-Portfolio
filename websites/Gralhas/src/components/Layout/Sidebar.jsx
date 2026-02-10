'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { FaLaptopHouse, FaUser } from 'react-icons/fa';
import { FaTruck } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";

const Sidebar = ({children}) => {
    const listItems = {

        "Área Administração" : {
            icon: <FaUser size={20} />,
            active: true,
            items : [
                {
                    ref: "/homepage/administracao", label: "Administração", active: true
                }
            ]
        },

        "Associação": {
            icon: <FaCalendarAlt size={20} />,
            active: true,
            items: [
                {
                    ref: "/homepage/historia", label: "A nossa história", active: true
                },
                {
                    ref: "/homepage/missao", label: "A nossa missão", active: true
                },
                {
                    ref: "/homepage/gralhas", label: "Gralhas", active: true
                },
                {
                    ref: "/homepage/equipa", label: "Equipa e Membros", active: true
                },
                {
                    ref: "/homepage/parceiros", label: "Parceiros e Apoio", active: true
                }
            ]
        },

        "As Nossas Ações": {
            icon: <FaCalendarAlt size={20} />,
            active: true,
            items: [
                {
                    ref: "/homepage/luta", label: "Luta contra o isolamento", active: true
                },
                {
                    ref: "/homepage/promover", label: "Promover Gralhas", active: true
                }
            ]
        },

        "Eventos": {
            icon: <FaCalendarAlt size={20} />,
            active: true,
            items: [
                {
                    ref: "/homepage/foteca", label: "Foteca", active: true
                },
                {
                    ref: "/homepage/eventos", label: "Próximos Eventos", active: true
                }
            ]
        },

        "Atualidade": {
            icon: <FaCalendarAlt size={20} />,
            active: true,
            items: [
                {
                    ref: "/homepage/atualidade", label: "Atualidade", active: true
                }
            ]
        },

        "Contactar": {
            icon: <FaCalendarAlt size={20} />,
            active: true,
            items: [
                {
                    ref: "/homepage/mensagem", label: "Enviar Mensagem", active: true
                },
                {
                    ref: "/homepage/contactos", label: "Contactos", active: true
                }
            ]
        },

        "Agir": {
            icon: <FaCalendarAlt size={20} />,
            active: true,
            items: [
                {
                    ref: "/homepage/agir", label: "Agir", active: true
                }
            ]
        },


    }

    return (
        <>
            <aside>
                <ul className="space-y-4">
                    {
                        children
                    }
                    {
                        Object.entries(listItems).map(([k, { icon, items, active }], i) =>
                            <li key={i}>
                                <Dropdown title={k} labels={items} icon={icon} active={active} />
                            </li>
                        )
                    }
                </ul>
            </aside>
        </>
    )
}

const Dropdown = ({ title, labels, icon, active }) => {
    const pathname = usePathname()
    const router = useRouter();

    const actives = []
    labels.forEach((label) => {
        if (pathname != "/") actives.push(pathname.includes(label.ref))
    })
    const isActive = actives.some((val) => { return val == true })
    const [isOpen, setIsOpen] = useState(isActive)

    return (
        <>
            <header
                className={(isActive ? "text-primary-600 bg-primary-400" : "text-primary-600") + " flex items-center justify-between cursor-pointer p-1 pr-2 rounded-lg hover:bg-primary-600 hover:text-primary-800 transition ease-in-out duration-150"}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="ml-2 flex items-center">
                    {active ? icon && <span className="mr-2">{icon}</span> : null}
                    {active ? title && <h2 className="text-lg font-semibold">{title}</h2> : null}
                </div>
                {active ? ((isOpen) ? <IoIosArrowDown /> : <IoIosArrowForward />) : null}
            </header>

            <ul title={title} className={(isOpen) ? "my-2 " : "hidden" + " mb-2 "}>
                {labels.map(({ ref, label, active }, index) => {
                    const linkIsActive = pathname.includes(ref);
                    const disabled = !active && ref !== "/";

                    return (
                        <li
                            key={index}
                            className={(linkIsActive ? "text-primary-600 font-bold bg-primary-400" : "text-primary-600") + "  ml-2 my-1 p-2 text-sm  rounded-lg cursor-pointer hover:bg-primary-600 hover:text-primary-800 active:ring transition ease-in-out duration-150"}
                            onClick={() => !disabled && router.push(ref)}
                            style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
                        >
                            {!disabled ? label : null}
                            {disabled && (
                                <span className="ml-2 text-red-500"></span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

export default Sidebar;