"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";
import { fetchProduct } from "@/api/fetchProduct";
import { fetchBasket } from "@/api/fetchBasket";
import { BasketDetails } from "@/types/basketDetails";

export default function Product({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [basket, setBaskets] = useState<BasketDetails | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // Get the role from the database
        const userId = session?.user.id;
        const { data: existingUser } = await supabase
        .from('Users')
        .select('*')
        .eq('authuserid', userId)
        .single(); 

        const role = existingUser?.role;
        setUserRole(role);
      }
    }
    getSession();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedBasket = await fetchBasket(session.access_token, id);
          setBaskets(fetchedBasket[0]);
        } catch (error) {
          console.error("Error fetching baskets:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    getProducts();
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

  const handleAddToCart = async (actionType: 'addToCart' | 'subscribe') => {
    if (actionType === 'addToCart') {
      setIsAddingToCart(true);
      router.push(`/cart/${basket.id}?itemType=basket&action=addToCart`);
    } else if (actionType === 'subscribe') {
      setIsSubscribing(true);
      router.push(`/cart/${basket.id}?itemType=basket&action=subscribe`);
    }
  };


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

            <div className="flex items-center mt-10 mb-10 w-full">
              <div className="w-1/2">
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
              <div className="ml-24">
                {userRole === "Co-Producer" && (
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={() => handleAddToCart('addToCart')}
                      disabled={isAddingToCart}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                    >
                      <div aria-live="assertive">
                        {isAddingToCart ? "Adding basket to cart..." : "Add basket to cart"}
                      </div>
                    </button>
                    <button
                      onClick={() => handleAddToCart('subscribe')}
                      disabled={isSubscribing}
                      className="bg-green-500 text-white mt-4 py-2 px-4 rounded-lg"
                    >
                      <div aria-live="assertive">
                        {isSubscribing ? "Subscribing to basket..." : "Subscribe to basket"}
                      </div>
                    </button>
                  </div>
                )}
              </div>
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
