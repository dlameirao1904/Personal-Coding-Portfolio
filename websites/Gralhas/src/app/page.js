import Image from "next/image";
import Layout from "@/components/Layout/Layout";
import { redirect } from "next/navigation";

const Home = ({ children }) => {


    redirect('/homepage')


    return (
        <>
            <main className="light flex flex-col items-center min-h-screen ">
                <Layout>
                    {children}
                </Layout>
            </main>
        </>
    );
}

export default Home;
