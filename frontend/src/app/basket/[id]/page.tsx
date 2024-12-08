"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";
import { fetchProduct } from "@/api/fetchProduct";
import { fetchBasket } from "@/api/fetchBasket";
import { BasketDetails } from "@/types/basketDetails";
import { fetchPhoto } from "@/api/fetchImages";

export default function Product({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [basket, setBaskets] = useState<BasketDetails | null>(null);

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
    const fetchBasketData = async () => {
      if (!session) return;
  
      try {
        setIsLoading(true);
  
        // Fetch the basket
        const fetchedBasket = await fetchBasket(session.access_token, id);
        const basketDetails = fetchedBasket[0];
  
        // Fetch the basket photo if `photoUrl` exists
        if (basketDetails?.photoUrl) {
          const photoId = basketDetails.photoUrl.split("/").pop(); // Extract photo ID from URL
          if (photoId) {
            try {
              const token = "XJNrKpIxQT5zzanoRN7Ur9N0IQHXKmKr1VAxPrT76LUkzFwacrCGM8pi"; // Replace with your Pexels API key
              const photoUrl = await fetchPhoto(photoId, token);
              basketDetails.photoUrl = photoUrl;
            } catch (error) {
              console.error("Error fetching basket photo:", error);
            }
          }
        }
  
        // Update the basket state
        setBaskets(basketDetails);
      } catch (error) {
        console.error("Error fetching basket data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBasketData();
  }, [session, id]);
  

  useEffect(() => {
    if (!id) {
      router.push("/");
    }
  }, [id, router]);

  if (!session) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (!basket) {
    return <div>Basket not found</div>;
  }


  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden text-white">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-8 grid gap-8 mt-8">
          <div className="flex flex-col w-full">
            <h1 className="text-lg font-bold mb-2">Basket Details:</h1>
            <div className="bg-blue-900 p-6 rounded-lg shadow-md w-1/2 mb-4">
              <h2 className="text-xl font-semibold">{basket.name}</h2>
              <p>{basket.description}</p>
              <p>
                <strong>Price:</strong> {basket.price} €
              </p>
              <p>
                <strong>Basket Weight:</strong>{" "}
                {basket.weight} kg
              </p>
            </div>

            <div className="mt-10 mb-10 w-1/3">
            {basket.photoUrl ? (
            <img
              src={basket.photoUrl}
              alt={basket.name || "Basket Image"}
              className="rounded-lg shadow-md max-w-full"
              onError={() => console.error("Error displaying the image:", basket.photoUrl)}
            />
            ) : (
              <p>No image available for this basket.</p>
            )}
            </div>

            <h1 className="text-lg font-bold mb-2 mt-4">Producer Details:</h1>
            <div className="bg-blue-900 p-6 rounded-lg shadow-md w-1/2">
              <p>
                <strong>Business Name:</strong> {basket.Producer.businessName}
              </p>
              <p>
                <strong>Contact Email:</strong> {basket.Producer.User.email}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
