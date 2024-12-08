"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../../components/Sidebar";
import { createBasket } from "@/api/createBasket"; // Backend API for creating a basket
import { Session } from "@supabase/auth-helpers-nextjs";
import { fetchProducts } from "@/api/fetchProducts";
import { Product } from "@/types/product";
import Select from "react-select";

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
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
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

  if (!session) {
    return <div>Loading session...</div>;
  }

  const handleProductSelection = (selectedOptions: any) => {
    const selectedProducts = selectedOptions.map((option: any) => ({
      id: option.value, // This corresponds to the ProductId in the backend
      quantity: 1, // Default quantity or allow users to specify it later
    }));
    setFormData({ ...formData, products: selectedProducts });
  };  

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-8 grid gap-8 mt-8">
          <h1 className="text-2xl font-bold mb-4">Create Basket</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Weight</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Products</label>
              <Select
                isMulti
                options={products.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))}
                className="basic-multi-select text-black"
                classNamePrefix="select"
                onChange={handleProductSelection}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Create Basket
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
