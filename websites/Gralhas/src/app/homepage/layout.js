import Layout from "@/components/Layout/Layout";
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default async function DashboardLayout({ children }) {
    return (
        <Layout>
            <ToastContainer />
            {children}
        </Layout>
    )

}