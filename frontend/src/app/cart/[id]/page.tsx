"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import { createSubscription } from "@/api/createSubscription";
import { useSearchParams } from "next/navigation";
import { fetchBasket } from "@/api/fetchBasket";
import { fetchProduct } from "@/api/fetchProduct";

export default function Cart({ params }: { params: { id: number } }) {
  const [session, setSession] = useState<Session | null>(null);
  const { id } = params;
  const [periodType, setPeriodType] = useState("monthly");
  const [quantity, setQuantity] = useState(1);
  const [isSubscribing, setIsSubscribing] = useState(false); // State for tracking subscription status
  const [subscriptionSuccess, setSubscriptionSuccess] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const itemType = searchParams.get("itemType");
  const [itemName, setItemName] = useState("");

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    }
    getSession();
  }, []);

  const handleSubscription = async () => {
    setIsSubscribing(true);
    const subscriptionData = {
      periodType: periodType,
      itemType: itemType || "",
      itemId: id,
      quantity: quantity,
    };

    try {
      const success = await createSubscription(session?.access_token ?? "", subscriptionData);
      setSubscriptionSuccess(success);
    } catch (error) {
      setSubscriptionSuccess(false);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubscription();
    console.log({ id, periodType, quantity });
    // Stripe checkout can be implemented here
  };

  // Fetch product or basket details based on the itemType
  useEffect(() => {
    if (session) {
      if (itemType === "product") {
        fetchProduct(session.access_token, id.toString()).then((product) => {
          setItemName(product[0].name);
        });
      } else if (itemType === "basket") {
        fetchBasket(session.access_token, id.toString()).then((basket) => {
          setItemName(basket[0].name);
        });
      }
    }
  }, [session, id, itemType]);

  return (
    <div className="lg:max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {id ? (
        <form onSubmit={handleSubmit} className="bg-blue-900 p-6 rounded-lg shadow-md text-white">
          <p>
            <strong>{itemType === "product" ? "Product Name:" : "Basket Name:"}</strong> {itemName}
          </p>
          <div className="mt-4">
            <label htmlFor="subscriptionType" className="block mb-2">
              Subscription Type:
            </label>
            <select
              id="subscriptionType"
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value)}
              className="text-black p-2 rounded-lg w-full"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="single purchase">Single Purchase</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="quantity" className="block mb-2">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              className="text-black p-2 rounded-lg w-full"
              aria-invalid={quantity < 1 ? "true" : "false"}
            />
          </div>
          <button
            type="submit"
            className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg w-full"
          >
            Add Subscription
          </button>
          {subscriptionSuccess !== null && (
            <div className={`mt-2 ${subscriptionSuccess ? "text-green-500" : "text-red-500"}`}>
              {subscriptionSuccess ? "Subscription created successfully!" : "Failed to create subscription."}
            </div>
          )}
        </form>
      ) : (
        <p>No product selected.</p>
      )}
    </div>
  );
}
