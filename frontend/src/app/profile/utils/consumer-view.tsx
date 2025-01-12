import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {Product} from "@/types/product";
import {Basket} from "@/types/basket";
import {Producer} from "@/types/producer";
import {User} from "@/types/user";
import {Session, SupabaseClient} from "@supabase/auth-helpers-nextjs";
import ProducerAccountValues from "../../../../components/ProducerAccountValues";
import { AccountValues } from "@/types/producerBalance";
import { fetchProducerAccountValues } from "@/api/fetchProducerAccountValues";

export function ConsumerView({ user, session, supabase }: { user: User | null; session: Session; supabase: SupabaseClient}) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [photo, setPhoto] = useState(user?.photoUrl || "");
    const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [producerAccountValues, setProducerAccountValues] = useState<AccountValues[]>([]);

    const [consumerDetails, setConsumerDetails] = useState({
        name: user?.name,
        email: user?.email,
        nif: user?.nif,
        role: user?.role,
        photo: user?.photoUrl,
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setNewPhotoFile(null); // Reset file selection
    };

    const handleSaveClick = async () => {
        try {
            let uploadedPhotoUrl = photo;

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

            // Save updates to user profile
            await supabase
                .from("Users")
                .update({ name, photoUrl: uploadedPhotoUrl })
                .eq("id", user?.id);

            setPhoto(uploadedPhotoUrl);
            setConsumerDetails((prevDetails) => ({
                ...prevDetails,
                photo: uploadedPhotoUrl,
            }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewPhotoFile(file);
            const url = URL.createObjectURL(file)
            setPhoto(url);
            setConsumerDetails((prevDetails) => ({
                ...prevDetails,
                photo: url,
            }));

        }
    };

    useEffect(() => {
        const getProducerAccountValues = async () => {
          if (session) {
            try {
              setIsLoading(true);
              const fetchedProducerAccountValues = await fetchProducerAccountValues(session.access_token);
              setProducerAccountValues(fetchedProducerAccountValues);
            } catch (error) {
              console.error("Error fetching Producer Account Values:", error);
            } finally {
              setIsLoading(false);
            }
          }
        };
    
        getProducerAccountValues();
      }, [session]);

    return (
        <div className="border-l-4 border-yellow-500 pl-4 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
                Consumer Dashboard
            </h2>
            <p className="text-gray-400 mb-6">
                Welcome, {consumerDetails.name}! Below are your user details:
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

                {isEditing ? (<div className="space-y-4">
                    <div>
                        <label className={"font-medium text-gray-200"}>Name: </label>
                        <input
                            type={"text"}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className={"m1-2 px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-600"}
                        />
                    </div>
                    <div>
                        <label className="font-medium text-gray-200">Upload Photo:</label>
                        <input
                            type="file"
                            onChange={handlePhotoChange}
                            className="ml-2 text-gray-300"
                        />
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={handleSaveClick}
                            className="px-4 py-2 bg-green-500 text-white rounded shadow"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelClick}
                            className="px-4 py-2 bg-gray-700 text-white rounded shadow"
                        >
                            Cancel
                        </button>
                    </div>
                </div>) : (
                    <div>
                        <div>
                            <span className="font-medium text-gray-200">Name:</span>{" "}
                            <span className="text-gray-300">{name}</span>
                        </div>
                        <button
                            onClick={handleEditClick}
                            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded shadow"
                        >
                            Edit
                        </button>
                    </div>
                )}

            <h1 className="text-3xl font-extrabold text-gray-100 border-b border-gray-700 pb-2 mt-8">
                Co-Producer Account Balances and Pending Values
            </h1>
            <ProducerAccountValues accountDetails={producerAccountValues} />

            </div>
        </div>
    );
}