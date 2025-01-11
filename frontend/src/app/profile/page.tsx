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

    // State variables for editable fields
    const [editableName, setEditableName] = useState("");
    const [editableBusinessName, setEditableBusinessName] = useState("");
    const [editableDescription, setEditableDescription] = useState("");
    const [editableLocation, setEditableLocation] = useState("");

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
            const role = session.user.user_metadata.role || 'Co-Producer';
            const user = await supabase.from('Users').select('*').eq('authuserid', userId).single();

            if (user.data) {
                setUser(user.data);
                // Set user name immediately when we have the data
                setEditableName(user.data.name || "");
            }

            if (role === 'Producer') {
                const producerData = await supabase.from('Producers')
                    .select('*')
                    .eq('userId', user.data?.id)
                    .single();

                if (producerData.data) {
                    setProducer(producerData.data);
                    // Set producer-specific fields with fallbacks to empty strings
                    setEditableBusinessName(producerData.data.businessName || "");
                    setEditableDescription(producerData.data.description || "");
                    setEditableLocation(producerData.data.locationId || "");
                }
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

    const handleSave = async () => {
        if (!user) return;

        try {
            // Update user details
            await supabase.from('Users')
                .update({ name: editableName || "" })
                .eq('id', user.id);

            // Update producer details if applicable
            if (producer) {
                await supabase.from('Producers')
                    .update({
                        businessName: editableBusinessName || "",
                        description: editableDescription || "",
                        locationId: editableLocation || ""
                    })
                    .eq('id', producer.id);

                setProducer(prev => ({
                    ...prev!,
                    businessName: editableBusinessName || "",
                    description: editableDescription || "",
                    locationId: editableLocation || ""
                }));
            }

            setUser(prev => ({
                ...prev!,
                name: editableName || ""
            }));

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };


    const renderContent = () => {
        switch (session?.user.user_metadata.role) {
            case "Producer":
                return (
                    <div>
                        <ProducerView
                            products={products}
                            baskets={baskets}
                            producer={producer}
                            user={user}
                            setBaskets={setBaskets}
                            setProducts={setProducts}
                            session={session}
                            supabase={supabase}
                        />
                    </div>
                );
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





