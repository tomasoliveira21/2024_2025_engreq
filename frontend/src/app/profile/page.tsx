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
import {deleteBasket} from "@/api/deleteBasket";
import {deleteProduct} from "@/api/deleteProduct";
import {updateBasket} from "@/api/updateBasket";
import {updateProduct} from "@/api/updateProduct";


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

function ConsumerView() {
    const consumerDetails = {
        name: "John Doe", // Replace with actual data
        email: "john.doe@example.com", // Replace with actual data
        nif: "123456789", // Replace with actual data
        role: "Consumer", // Replace with actual data
    };

    return (
        <div className="border-l-4 border-yellow-500 pl-4 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
                Consumer Dashboard
            </h2>
            <p className="text-gray-400 mb-6">
                Welcome, {consumerDetails.name}! Below are your business details:
            </p>
            <div className="space-y-4">
                {consumerDetails.photo ? (
                    <div>
                        <img
                            src={consumerDetails.photo}
                            alt="Consumer Photo"
                            className="w-32 h-32 rounded-full object-cover border border-gray-700 shadow-md"
                        />
                    </div>
                ) : (
                    <div
                        className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-600">
                        No Photo
                    </div>
                )}
                <div>
                    <span className="font-medium text-gray-200">Name:</span>{" "}
                    <span className="text-gray-300">{consumerDetails.name}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Email:</span>{" "}
                    <span className="text-gray-300">{consumerDetails.email}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">NIF:</span>{" "}
                    <span className="text-gray-300">{consumerDetails.nif}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Role:</span>{" "}
                    <span className="text-gray-300">{consumerDetails.role}</span>
                </div>
            </div>
        </div>
    );
}

function ProducerView({ products, baskets, producer, user,setProducts,setBaskets, session }: { products: Product[]; baskets: Basket[]; producer: Producer; user: User; setProducts:{setProducts}; setBaskets:{setBaskets}; session: Session  }) {
    const [selectedItem, setSelectedItem] = useState<Product | Basket | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const openEditModal = (item: Product | Basket) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalOpen(false);
    };

    const handleSave = async (updatedItem: Product | Basket) => {
        console.log("Save updated item:", updatedItem);

        // Determine if the item is a Basket or Product based on its properties
        const isBasket = (item: any): item is Basket => "weight" in item; // Replace "basketProperty" with a unique property of Basket
        const isProduct = (item: any): item is Product => "quantity" in item; // Replace "productProperty" with a unique property of Product

        if (isBasket(updatedItem)) {
            await updateBasket(session.access_token,updatedItem.id, updatedItem);
            let updatedBaskets = baskets.map((basket) =>
                    basket.id === updatedItem.id ? updatedItem : basket);

            setBaskets(updatedBaskets);
        } else if (isProduct(updatedItem)) {
            await updateProduct(session.access_token,updatedItem.id, updatedItem);

            let updatedProducts = products.map((product) =>
                product.id === updatedItem.id ? updatedItem : product);

            setProducts(updatedProducts);
        }

        closeModal();
    };

    const handleDelete = async (item: Product | Basket) => {
        console.log("Delete item:", item);

        const isBasket = (item: any): item is Basket => "weight" in item; // Replace with unique property of Basket
        const isProduct = (item: any): item is Product => "quantity" in item; // Replace with unique property of Product

        if (isBasket(item)) {
            await deleteBasket(session.access_token,item.id);
            let updatedBaskets = baskets.filter((basket) => basket.id !== item.id)
            setBaskets(updatedBaskets);
        } else if (isProduct(item)) {
            await deleteProduct(session.access_token, item.id);
            let updatedProducts = products.filter((product) => product.id !== item.id)
            setProducts(updatedProducts);
        }
    };

    return (
        <div className="border-l-4 border-yellow-500 pl-4 dark:bg-gray-900">
            {/* Producer Details */}
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Producer Dashboard</h2>
            <p className="text-gray-400 mb-6">Welcome, {user?.name}! Below are your business details:</p>
            <div className="space-y-4">
                {producer?.photoUrl ? (
                    <div>
                        <img
                            src={producer?.photoUrl}
                            alt="Producer Photo"
                            className="w-32 h-32 rounded-full object-cover border border-gray-700 shadow-md"
                        />
                    </div>
                ) : (
                    <div
                        className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-600"
                    >
                        No Photo
                    </div>
                )}
                <div>
                    <span className="font-medium text-gray-200">Name:</span>{" "}
                    <span className="text-gray-300">{user?.name}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Business Name:</span>{" "}
                    <span className="text-gray-300">{producer?.businessName}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Description:</span>{" "}
                    <span className="text-gray-300">{producer?.description}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Location:</span>{" "}
                    <span className="text-gray-300">{producer?.locationId}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Email:</span>{" "}
                    <span className="text-gray-300">{user?.email}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">NIF:</span>{" "}
                    <span className="text-gray-300">{user?.nif}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Role:</span>{" "}
                    <span className="text-gray-300">{user?.role}</span>
                </div>
            </div>

            {/* Products Section */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Products</h3>
                <div className="grid gap-4">
                    {products.map((product) => (
                        <div
                            key={product?.id}
                            className="p-4 bg-gray-800 rounded-lg shadow-sm border border-gray-700"
                        >
                            <h4 className="text-gray-100 font-medium text-lg">{product?.name}</h4>
                            <p className="text-gray-400 text-sm mb-2">{product?.description}</p>
                            <div className="flex space-x-2 mt-2">
                                <button
                                    onClick={() => openEditModal(product)}
                                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg shadow hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product)}
                                    className="px-4 py-2 bg-red-600 text-gray-100 rounded-lg shadow hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Baskets Section */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Baskets</h3>
                <div className="grid gap-4">
                    {baskets.map((basket) => (
                        <div
                            key={basket?.id}
                            className="p-4 bg-gray-800 rounded-lg shadow-sm border border-gray-700"
                        >
                            <h4 className="text-gray-100 font-medium text-lg">{basket?.name}</h4>
                            <p className="text-gray-400 text-sm mb-2">{basket?.description}</p>
                            <div className="flex space-x-2 mt-2">
                                <button
                                    onClick={() => openEditModal(basket)}
                                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg shadow hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(basket)}
                                    className="px-4 py-2 bg-red-600 text-gray-100 rounded-lg shadow hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && selectedItem && selectedItem.hasOwnProperty("id") && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold text-gray-100 mb-4">Edit Product</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave(selectedItem);
                            }}
                        >
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-gray-400 font-medium mb-1"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={(selectedItem as Product).name}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, name: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="description"
                                    className="block text-gray-400 font-medium mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={(selectedItem as Product).description}
                                    onChange={(e) =>
                                        setSelectedItem({
                                            ...selectedItem,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg shadow hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg shadow hover:bg-yellow-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}



function AMAPAdminView() {
    return (
        <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                AMAP Admin Dashboard
            </h2>
            <p className="text-gray-600">
                Welcome, AMAP Admin! Approve memberships and manage AMAP
                settings.
            </p>
        </div>
    );
}

function AdminView() {
    return (
        <div className="border-l-4 border-red-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Admin Dashboard
            </h2>
            <p className="text-gray-600">
                Welcome, Admin! Manage users and global marketplace settings
                here.
            </p>
        </div>
    );
}