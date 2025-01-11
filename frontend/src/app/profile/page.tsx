"use client";

import React, {useState, useEffect} from "react";
import {supabase} from "@/lib/supabase";
import {Session} from "@supabase/auth-helpers-nextjs";
import {fetchBaskets} from "@/api/fetchBaskets";
import {fetchProducts} from "@/api/fetchProducts";
import {Product} from "@/types/product";
import {Basket} from "@/types/basket";
import Sidebar from "../../../components/Sidebar";
import {fetchProducerProducts} from "@/api/fetchProducerProducts";
import {fetchProducerBaskets} from "@/api/fetchProducerBaskets";
import {Producer} from "@/types/producer";
import {User} from "@/types/user";
import {ProducerView} from "@/app/profile/utils/producer-view";
import {ConsumerView} from "@/app/profile/utils/consumer-view";
import {deleteBasket} from "@/api/deleteBasket";
import {deleteProduct} from "@/api/deleteProduct";
import {updateBasket} from "@/api/updateBasket";
import {updateProduct} from "@/api/updateProduct";
import {AMAPAdminView} from "@/app/profile/utils/amap-admin-view";
import {AdminView} from "@/app/profile/utils/admin-view";


export default function Profile({params}: { params: { id: string } }) {
    const [user, setUser] = useState<User | null>(null);
    const [producer, setProducer] = useState<Producer | null>(null);
    const {id} = params;
    const [session, setSession] = useState<Session | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [baskets, setBaskets] = useState<Basket[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function getSession() {
            const {
                data: {session},
            } = await supabase.auth.getSession();
            setSession(session);

            if (!session?.user) {
                console.error('No authenticated user found.');
                return;
            }

            const userId = session.user.id;
            // Retrieve role and nif from metadata
            const role = session.user.user_metadata.role || 'Co-Producer';
            const user = await supabase.from('Users').select('*').eq('authuserid',userId).single();
            setUser(user.data);
            if(role == 'Producer'){
                const producerData = await supabase.from('Producers').select('*').eq('userId',user.data.id).single();
                setProducer(producerData.data);
            }
        }

        getSession();
    }, []);

    useEffect(() => {
        const getBaskets = async () => {
            if (session) {
                try {
                    setIsLoading(true);
                    const fetchedBaskets = await fetchProducerBaskets(session.access_token, producer?.id);
                    setBaskets(fetchedBaskets);
                } catch (error) {
                    console.error("Error fetching baskets:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        getBaskets();
    }, [session, producer]);

    useEffect(() => {
        const getProducts = async () => {
            if (session) {
                try {
                    setIsLoading(true);
                    const fetchedProducts = await fetchProducerProducts(session.access_token, producer?.id);
                    setProducts(fetchedProducts);
                } catch (error) {
                    console.error("Error fetching products:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        getProducts();
    }, [session, producer]);

    const renderContent = () => {
        switch (session?.user.user_metadata.role) {
            case "Co-Producer":
                return (<ConsumerView/>);
            case "Producer":
                return <ProducerView products={products} baskets={baskets} producer={producer} user={user} setBaskets={setBaskets} setProducts={setProducts} session={session} />;
            case "AMAP Admin":
                return <AMAPAdminView/>;
            case "Admin":
                return <AdminView/>;
            default:
                return <p className="text-gray-600">Loading profile...</p>;
        }
    };
    return (
        <div className="flex min-h-screen">
            <div className="w-1/4 bg-black p-4">
                <Sidebar/>
            </div>
            <div className="flex-1 p-7 dark:bg-black">
                {renderContent()}
            </div>
        </div>
    );
}





