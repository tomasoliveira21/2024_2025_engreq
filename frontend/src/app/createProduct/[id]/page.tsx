"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Session} from "@supabase/auth-helpers-nextjs";
import {supabase} from "@/lib/supabase";
import Sidebar from "../../../../components/Sidebar";
import {createProduct} from "@/api/createProduct";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../../../components/Modal";
import {fetchImages} from "@/api/fetchImages";
import {fetchSeasons} from "@/api/fetchSeasons";
import {fetchSeasonDates} from "@/api/fetchSeasonDates";
import {SalePeriod, SeasonResponse} from "@/types/seasons";
import {Item, SeasonDatesResponse} from "@/types/seasonDates";

import Select from "react-select";

export default function CreateProduct({params}: { params: { id: string } }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "",
        price: "",
        quantity: "",
        photoUrl: "",
        season: "" as string | number,
    });
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [seasons, setSeasons] = useState<SeasonResponse[]>();
    const [selectedSeason, setSelectedSeason] = useState<SeasonResponse | null>(null);
    const [selectedDeliveryDates, setSelectedDeliveryDates] = useState<Date[]>();
    const {id} = params;

    useEffect(() => {
        async function getSession() {
            const {
                data: {session},
            } = await supabase.auth.getSession();
            setSession(session);
        }

        getSession();
    }, []);

    useEffect(() => {
        const getSeasons = async () => {
            if (session) {
                try {
                    setIsLoading(true);
                    const fetchedSeasons = await fetchSeasons(session.access_token, id);
                    setSeasons(fetchedSeasons);
                } catch (error) {
                    console.error("Error fetching Seasons:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        getSeasons();
    }, [session]);

    useEffect(() => {
        const getSeasonsDates = async () => {
            if (selectedSeason && session) {
                try {
                    const deliveryDates = await fetchSeasonDates(session.access_token, selectedSeason.id);
                    if (Array.isArray(deliveryDates.deliveryDates)) {
                        const dates = deliveryDates.deliveryDates.map((item: { date: string }) => new Date(item.date));
                        setSelectedDeliveryDates(dates);
                    } else {
                        setSelectedDeliveryDates([]);
                    }
                } catch (error) {
                    console.error("Error fetching Seasons:", error);
                    setSelectedDeliveryDates([]);
                }
            }
        };
        getSeasonsDates();
    }, [selectedSeason]);
    if (!session) {
        return <div>Loading session...</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSearchImages = async () => {
        if (query.trim()) {
            try {
                const imageUrls = await fetchImages(query, 15);
                console.log("Fetched images:", imageUrls);
                setImages(imageUrls);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        }
    };

    // Select photo from modal
    const handleSelectPhoto = (url: string) => {
        setFormData({...formData, photoUrl: url});
        handleCloseModal();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            setError("No active session. Please log in again.");
            return;
        }

        try {
            await createProduct(session.access_token, {
                name: formData.name,
                description: formData.description,
                type: formData.type,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10),
                photoUrl: formData.photoUrl,
                salesPeriod: Number(formData.season),
            });

            setFormData({
                name: "",
                description: "",
                type: "",
                price: "",
                quantity: "",
                photoUrl: "",
                season: "",
            });

            setError("");
        } catch (err) {
            setError("Failed to register the product. Please try again.");
        }
    };

    const handleSeasonSelection = (season: SeasonResponse) => {
        setFormData({...formData, season: season.id});
        setSelectedSeason(season);
    };

    return (
        <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden text-white">
            <main className="grid grid-cols-12 gap-8">
                <div className="col-span-3">
                    <Sidebar/>
                </div>
                <div className="col-span-8 mt-8">
                    <h2 className="text-2xl font-bold mb-6">Register Product</h2>
                    <form
                        className="bg-gray-700 p-6 rounded-lg shadow-lg space-y-4"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 bg-gray-600 text-white rounded-md border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium mb-2"
                            >
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 bg-gray-600 text-white rounded-md border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium mb-2">
                                Type
                            </label>
                            <input
                                type="text"
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 bg-gray-600 text-white rounded-md border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <table className="min-w-full bg-gray-700 text-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4">Select</th>
                                <th className="py-2 px-4">Season Name</th>
                                <th className="py-2 px-4">Start Date</th>
                                <th className="py-2 px-4">End Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {seasons?.map((season) => (
                                <tr key={season.id} className="border-t border-gray-600">
                                    <td className="py-2 px-4 text-center">
                                        <input
                                            type="radio"
                                            name="season"
                                            value={season.id}
                                            checked={formData.season === season.id}
                                            onChange={() => handleSeasonSelection(season)}
                                        />
                                    </td>
                                    <td className="py-2 px-4 text-center">{season.name}</td>
                                    <td className="py-2 px-4 text-center">{new Date(season.startDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 text-center">{new Date(season.endDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {selectedSeason && (
                            <div className="mt-4 p-4 bg-gray-800 rounded-md">
                                <h3 className="text-lg font-bold mb-2">Selected Season's Delivery Dates</h3>
                                <div>
                                    {selectedDeliveryDates?.map((item, index) => (
                                        <span key={item.toISOString()}>
                                            {item.toLocaleDateString()}
                                            {index < selectedDeliveryDates.length - 1 && " | "}
                                        </span>
                                    ))}
                                    {selectedDeliveryDates?.length === 0 && (
                                        <p>No delivery dates available for this season.</p>
                                    )}
                                </div>
                            </div>
                        )}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium mb-2">
                                Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 bg-gray-600 text-white rounded-md border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="quantity"
                                className="block text-sm font-medium mb-2"
                            >
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                                className="w-full p-3 bg-gray-600 text-white rounded-md border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Photo</label>
                            {formData.photoUrl ? (
                                <img
                                    src={formData.photoUrl}
                                    alt="Selected"
                                    className="w-40 h-40 object-cover mb-2"
                                />
                            ) : (
                                <p>No photo selected</p>
                            )}
                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                aria-label="Select a photo for the product"
                            >
                                Select Photo
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition"
                        >
                            Register Product
                        </button>
                    </form>
                    {isModalOpen && (
                        <Modal onClose={handleCloseModal}>
                            <div className="p-6">
                                <h2 className="text-lg font-bold mb-4">Search Photos</h2>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search images..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                                        aria-label="Type to search images"
                                    />
                                    <button
                                        onClick={handleSearchImages}
                                        className="px-4 py-2 mt-2 bg-blue-500 text-white rounded"
                                        aria-label="Search images"
                                    >
                                        Search
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {images.map((url) => (
                                        <img
                                            key={url}
                                            src={url}
                                            alt="Search result"
                                            className="w-full h-32 object-cover cursor-pointer"
                                            onClick={() => handleSelectPhoto(url)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            </main>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
