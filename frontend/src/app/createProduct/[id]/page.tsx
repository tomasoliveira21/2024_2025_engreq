"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../../components/Sidebar";
import { createProduct } from "@/api/createProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../../../components/Modal";
import { fetchImages } from "@/api/fetchImages";
import { fetchSeasons } from "@/api/fetchSeasons";
import { SalePeriod, SeasonResponse } from "@/types/seasons";
import Select from "react-select";

export default function CreateProduct({ params }: { params: { id: string } }) {
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
  const { id } = params;

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
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

  if (!session) {
    return <div>Loading session...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    setFormData({ ...formData, photoUrl: url });
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
        //season: formData.season, TODO
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
      // TODO: Redirect
    } catch (err) {
      setError("Failed to register the product. Please try again.");
    }
  };

  const handleSeasonSelection = (selectedOptions: any) => {
    const selectedSeasons = selectedOptions.map((option: any) => ({
      id: option.value,
      name: option.label,
    }));

    setFormData({ ...formData, season: selectedSeasons });
  };
  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden text-white">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
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
            <Select
              isMulti
              options={
                seasons?.map((salePeriod) => ({
                  value: salePeriod.id,
                  label: salePeriod.name,
                })) || []
              }
              onChange={handleSeasonSelection}
              placeholder="Select seasons..."
              className="basic-multi-select text-black"
              classNamePrefix="select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#4B5563",
                  color: "white",
                  borderRadius: "0.375rem",
                  padding: "0.5rem",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#374151",
                  color: "white",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#1F2937" : "#374151",
                  color: "white",
                }),
              }}
            />
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
