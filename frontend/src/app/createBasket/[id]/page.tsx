"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../../components/Sidebar";
import { createBasket } from "@/api/createBasket";
import { Session } from "@supabase/auth-helpers-nextjs";
import { fetchProducts } from "@/api/fetchProducts";
import { Product } from "@/types/product";
import Select from "react-select";
import Modal from "../../../../components/Modal";
import { fetchImages } from "@/api/fetchImages";
import { fetchSeasons } from "@/api/fetchSeasons";
import { SeasonResponse } from "@/types/seasons";
import {fetchSeasonDates} from "@/api/fetchSeasonDates";

export default function CreateBasket({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    photoUrl: "",
    products: [],
    season: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [seasons, setSeasons] = useState<SeasonResponse[]>();
  const [selectedSeason, setSelectedSeason] = useState<SeasonResponse | null>(null);
  const [selectedDeliveryDates, setSelectedDeliveryDates] = useState<Date[]>();



  const { id } = params;

  // Fetch session on component mount
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


  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Modal handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Fetch images for modal
  const handleSearchImages = async () => {
    if (query.trim()) {
      try {
        const imageUrls = await fetchImages(query, 15);
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



  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please login to create a basket.");
      return;
    }

    try {
      const isSuccess = await createBasket(session.access_token, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        weight: parseFloat(formData.weight),
        type: "type1",
        photoUrl: formData.photoUrl,
        products: formData.products,
        createdAt: new Date(),
        updatedAt: new Date(),
        salesPeriod: Number(formData.season),
      });

      if (isSuccess) {
        alert("Basket created successfully!");
        router.push("/dashboard"); // Redirect to dashboard or appropriate page
      } else {
        alert("Failed to create basket.");
      }
    } catch (error) {
      console.error("Error creating basket:", error);
    }
  };

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

  console.log("seasons: ", seasons);



  const handleProductSelection = (selectedOptions: any) => {
    const selectedProducts = selectedOptions.map((option: any) => ({
      id: option.value, // This corresponds to the ProductId in the backend
      quantity: 1, // Default quantity or allow users to specify it later
    }));
    setFormData({ ...formData, products: selectedProducts });
  };

  const handleSeasonSelection = (season:SeasonResponse) => {
    setFormData({ ...formData, season: season.id });
    setSelectedSeason(season);
  };

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

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden text-white">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Create Basket</h2>
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
                htmlFor="weight"
                className="block text-sm font-medium mb-2"
              >
                Weight
              </label>
              <input
                type="number"
                step="0.01"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                className="w-full p-3 bg-gray-600 text-white rounded-md border-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="products"
                className="block text-sm font-medium mb-2"
              >
                Products
              </label>
              <Select
                isMulti
                options={products.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))}
                className="basic-multi-select text-black"
                classNamePrefix="select"
                onChange={handleProductSelection}
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
                aria-label="Select a photo for the basket"
              >
                Select Photo
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition"
            >
              Create Basket
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
    </div>
  );
}
