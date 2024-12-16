"use client";

import { useState, useEffect } from "react";
import {supabase} from "@/lib/supabase";
import {Session} from "@supabase/auth-helpers-nextjs";
import {fetchBaskets} from "@/api/fetchBaskets";
import {fetchProducts} from "@/api/fetchProducts";
import {Product} from "@/types/product";
import {Basket} from "@/types/basket";


export default function Profile({params}:{params: {id: string}}) {
    const [userRole, setUserRole] = useState(null);
    const { id } = params;
    const [session, setSession] = useState<Session | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [baskets, setBaskets] = useState<Basket[]>([]);
    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {
        async function getSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setSession(session);
        }
        getSession();
    }, []);

    // Mock fetching user role (replace with your actual user fetching logic)
    useEffect(() => {
        // Simulating fetching user role
        const fetchUserRole = async () => {
            let role = 'Producer';
            setUserRole(role);
        };
        fetchUserRole();
    }, []);

    useEffect(() => {
        const getBaskets = async () => {
            if (session) {
                try {
                    setIsLoading(true);
                    const fetchedBaskets = await fetchBaskets(session.access_token, id);
                    setBaskets(fetchedBaskets);
                } catch (error) {
                    console.error("Error fetching baskets:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        getBaskets();
    }, [session]);

    useEffect(() => {
        const getProducts = async () => {
            if (session) {
                try {
                    setIsLoading(true);
                    const fetchedProducts = await fetchProducts(session.access_token, id);
                    setProducts(fetchedProducts);
                } catch (error) {
                    console.error("Error fetching products:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        getProducts();
    }, [session]);

    const renderContent = () => {
        switch (userRole) {
            case "Consumer":
                return <ConsumerView />;
            case "Producer":
                return <ProducerView />;
            case "AMAPAdmin":
                return <AMAPAdminView />;
            case "Admin":
                return <AdminView />;
            default:
                return <p className="text-gray-600">Loading profile...</p>;
        }
    };
    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 dark:bg-gray-900 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center text-gray-300-600 mb-6">
                User Profile
            </h1>
            {renderContent()}
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
        <div className="border-l-4 border-green-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Consumer Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
                Welcome, {consumerDetails.name}! Below are your details:
            </p>
            <div className="space-y-2">
                <div>
                    <span className="font-medium text-gray-800">Name:</span>{" "}
                    {consumerDetails.name}
                </div>
                <div>
                    <span className="font-medium text-gray-800">Email:</span>{" "}
                    {consumerDetails.email}
                </div>
                <div>
                    <span className="font-medium text-gray-800">NIF:</span>{" "}
                    {consumerDetails.nif}
                </div>
                <div>
                    <span className="font-medium text-gray-800">Role:</span>{" "}
                    {consumerDetails.role}
                </div>
            </div>
        </div>
    );
}

function ProducerView() {
    const producerDetails = {
        name: "Alice Smith",
        businessName: "Alice's Organic Farm",
        description: "Providing fresh, organic produce directly from the farm.",
        photo: null,
        location: "123 Greenway Blvd, Countryside",
        email: "alice.smith@example.com",
        nif: "987654321",
        role: "Producer",
    };

    const products = [
        {
            name: "Organic Apples",
            description: "Fresh and juicy organic apples.",
            sold: 120,
            inStock: 50,
        },
        {
            name: "Free-Range Eggs",
            description: "Farm fresh free-range eggs.",
            sold: 200,
            inStock: 30,
        },
        {
            name: "Raw Honey",
            description: "Pure, natural raw honey.",
            sold: 75,
            inStock: 25,
        },
    ];

    return (
        <div className="border-l-4 border-yellow-500 pl-4 dark:bg-gray-900">
            {/* Producer Details */}
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
                Producer Dashboard
            </h2>
            <p className="text-gray-400 mb-6">
                Welcome, {producerDetails.name}! Below are your business details:
            </p>
            <div className="space-y-4">
                {producerDetails.photo ? (
                    <div>
                        <img
                            src={producerDetails.photo}
                            alt="Producer Photo"
                            className="w-32 h-32 rounded-full object-cover border border-gray-700 shadow-md"
                        />
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-600">
                        No Photo
                    </div>
                )}
                <div>
                    <span className="font-medium text-gray-200">Name:</span>{" "}
                    <span className="text-gray-300">{producerDetails.name}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Business Name:</span>{" "}
                    <span className="text-gray-300">{producerDetails.businessName}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Description:</span>{" "}
                    <span className="text-gray-300">{producerDetails.description}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Location:</span>{" "}
                    <span className="text-gray-300">{producerDetails.location}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Email:</span>{" "}
                    <span className="text-gray-300">{producerDetails.email}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">NIF:</span>{" "}
                    <span className="text-gray-300">{producerDetails.nif}</span>
                </div>
                <div>
                    <span className="font-medium text-gray-200">Role:</span>{" "}
                    <span className="text-gray-300">{producerDetails.role}</span>
                </div>
            </div>

            {/* Products Section */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Products</h3>
                <div className="grid gap-4">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-800 rounded-lg shadow-sm border border-gray-700"
                        >
                            <h4 className="text-gray-100 font-medium text-lg">
                                {product.name}
                            </h4>
                            <p className="text-gray-400 text-sm mb-2">
                                {product.description}
                            </p>
                            <div className="text-gray-400 text-sm space-y-1">
                                <p>
                                    <span className="font-medium text-gray-300">Sold:</span>{" "}
                                    {product.sold}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-300">
                                        In Stock:
                                    </span>{" "}
                                    {product.inStock}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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
