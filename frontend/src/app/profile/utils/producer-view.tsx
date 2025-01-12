import {Product} from "@/types/product";
import {Basket} from "@/types/basket";
import {Producer} from "@/types/producer";
import {User} from "@/types/user";
import {Session, SupabaseClient} from "@supabase/auth-helpers-nextjs";
import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {updateBasket} from "@/api/updateBasket";
import {updateProduct} from "@/api/updateProduct";
import {deleteBasket} from "@/api/deleteBasket";
import {deleteProduct} from "@/api/deleteProduct";
import {LocationPicker} from "@/app/profile/utils/location-picker";



export function ProducerView({ products, baskets, producer, user,setProducts,setBaskets, session, supabase }: { products: Product[]; baskets: Basket[]; producer: Producer | null; user: User | null; setProducts:Dispatch<SetStateAction<Product[]>>; setBaskets:Dispatch<SetStateAction<Basket[]>>; session: Session; supabase: SupabaseClient}) {
    const [selectedItem, setSelectedItem] = useState<Product | Basket | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
    const [locationDetails, setLocationDetails] = useState<{
        address: string;
        city: string;
        country: string;
        postalCode: string;
        latitude: number;
        longitude: number;
    } | null>(null);

    useEffect(() => {
        if (producer?.locationId) {
            fetchLocationDetails(String(producer.locationId));
        }
    }, [producer]);

    const fetchLocationDetails = async (locationId: string) => {
        try {
            const { data, error } = await supabase
                .from("Locations")
                .select("address, city, country, postalCode, latitude, longitude")
                .eq("id", locationId)
                .single();

            if (error) {
                console.error("Failed to fetch location details:", error);
            } else {
                setLocationDetails(data);
            }
        } catch (error) {
            console.error("Error fetching location details:", error);
        }
    };

    const [editableDetails, setEditableDetails] = useState({
        name: user?.name || "",
        businessName: producer?.businessName || "",
        description: producer?.description || "",
        location: {
            address: "",
            city: "",
            country: "",
            postalCode: "",
            latitude: 0,
            longitude: 0,
        },
        photoUrl: user?.photoUrl
    });

    const handleEditDetails = () => {
        setEditableDetails({
            name: user?.name || "",
            businessName: producer?.businessName || "",
            description: producer?.description || "",
            location: locationDetails || {
                address: "",
                city: "",
                country: "",
                postalCode: "",
                latitude: 0,
                longitude: 0,
            },
            photoUrl: user?.photoUrl
        });
        setIsEditingDetails(true);
    };

    const openEditModal = (item: Product | Basket) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalOpen(false);
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewPhotoFile(file);
            const url = URL.createObjectURL(file)
            setEditableDetails((prevDetails) => ({
                ...prevDetails,
                photoUrl: url,
            }));

        }
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

    const handleSaveDetails = async () => {
        try {
            let uploadedPhotoUrl = editableDetails.photoUrl;

            if (newPhotoFile) {
                const { data, error } = await supabase.storage
                    .from("photos")
                    .upload(`users/${user?.id}/profile.jpg`, newPhotoFile, {
                        upsert: true,
                    });

                if (error) throw error;

                const { data: urlData } = supabase.storage
                    .from("photos")
                    .getPublicUrl(`users/${user?.id}/profile.jpg`);
                uploadedPhotoUrl = urlData.publicUrl;
            }

            setEditableDetails((prevDetails) => ({
                ...prevDetails,
                photo: uploadedPhotoUrl,
            }));

            const locationData = {
                address: editableDetails.location.address,
                city: editableDetails.location.city,
                country: editableDetails.location.country,
                postalCode: editableDetails.location.postalCode,
                latitude: editableDetails.location.latitude,
                longitude: editableDetails.location.longitude,
            };

            let locationId = producer?.locationId;

            if (locationId) {
                await supabase.from("Locations").update(locationData).eq("id", locationId);
            } else {
                const { data: newLocation, error } = await supabase
                    .from("Locations")
                    .insert(locationData)
                    .select()
                    .single();

                if (error) throw error;
                locationId = newLocation.id;
            }

            await supabase
                .from("Users")
                .update({ name: editableDetails.name, photoUrl: editableDetails.photoUrl })
                .eq("id", user?.id);

            await supabase
                .from("Producers")
                .update({
                    businessName: editableDetails.businessName,
                    description: editableDetails.description,
                    locationId: locationId,
                })
                .eq("id", producer?.id);

            window.location.reload();
            setIsEditingDetails(false);
        } catch (error) {
            console.error("Error updating details:", error);
            alert("Failed to update details");
        }
    };


    return (
        <div className="border-l-4 border-yellow-500 pl-4 dark:bg-gray-900">
            {/* Producer Details */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-100">Producer Dashboard</h2>
                {!isEditingDetails && (
                    <button
                        onClick={handleEditDetails}
                        className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg shadow hover:bg-yellow-600"
                    >
                        Edit Details
                    </button>
                )}
            </div>
            <p className="text-gray-400 mb-6">Welcome, {user?.name}! Below are your business details:</p>
            <div className="space-y-4">
                {editableDetails.photoUrl ? (
                    <div>
                        <img
                            src={editableDetails.photoUrl}
                            alt="Producer Photo"
                            className="w-32 h-32 rounded-full object-cover border border-gray-700 shadow-md"
                        />
                    </div>
                ) : (
                    <div
                        className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-600">
                        No Photo
                    </div>
                )}
                {isEditingDetails ? (
                    <div className="space-y-4">
                        <div>
                            <label className="font-medium text-gray-200">Upload Photo:</label>
                            <input
                                type="file"
                                onChange={handlePhotoChange}
                                className="ml-2 text-gray-300"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={editableDetails.name}
                                onChange={(e) => setEditableDetails({...editableDetails, name: e.target.value})}
                                className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Business Name</label>
                            <input
                                type="text"
                                value={editableDetails.businessName}
                                onChange={(e) =>
                                    setEditableDetails({...editableDetails, businessName: e.target.value})
                                }
                                className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Description</label>
                            <textarea
                                value={editableDetails.description}
                                onChange={(e) =>
                                    setEditableDetails({...editableDetails, description: e.target.value})
                                }
                                className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 font-medium mb-1">Location</label>
                            <LocationPicker
                                onLocationSelect={(location) =>
                                    setEditableDetails((prev) => ({
                                        ...prev,
                                        location,
                                    }))
                                }
                                initialLocation={editableDetails.location}
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setIsEditingDetails(false)}
                                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg shadow hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveDetails}
                                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg shadow hover:bg-yellow-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
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
                        {locationDetails && (
                            <div>
                                <span className="font-medium text-gray-200">Location:</span>{" "}
                                <span className="text-gray-300">
                {locationDetails.address}, {locationDetails.city}, {locationDetails.country} -{" "}
                                    {locationDetails.postalCode}
              </span>
                            </div>
                        )}
                    </div>
                )}
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
                                        setSelectedItem({...selectedItem, name: e.target.value})
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