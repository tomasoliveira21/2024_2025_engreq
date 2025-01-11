"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import { fetchCart } from "@/api/fetchCart";
import { fetchProduct } from "@/api/fetchProduct";
import { deleteCartItem } from "@/api/deleteCartItem";
import { updateCartItem } from "@/api/updateCartItem";
import { handleCheckout } from "@/api/handleCheckout";
import { Carts } from "@/types/cart";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState<Carts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState<Session | null>(null);

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

  // Fetch cart items from the backend
  useEffect(() => {
    const fetchCartItems = async () => {
      if (session) {
        try {
          const items = await fetchCart(session.access_token);
          const itemsWithProductNames = await Promise.all(
            items.map(async (item) => {
              const product = await fetchProduct(session.access_token, item.itemId.toString());
              return { ...item, productName: product[0].name, price: product[0].price };
            })
          );
          setCartItems(itemsWithProductNames);
        } catch (err) {
          setError("Failed to fetch cart items.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCartItems();
  }, [session]);


  const handleUpdateCartItem = async (id: number, quantity: number) => {
    if (!session) return;

    const success = await updateCartItem(id, quantity, session.access_token);
    if (success) {
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.itemId === id ? { ...item, quantity } : item))
      );
    } else {
      setError("Failed to update item quantity.");
    }
  }

  const handleDeleteCartItem = async (id: number) => {
    if (!session) return;

    const success = await deleteCartItem(id, session.access_token);
    if (success) {
      setCartItems((prevItems) => prevItems.filter((item) => item.itemId !== id));
    } else {
      setError("Failed to delete item from the cart.");
    }
  };    

  const handleCheckoutSubmit = async () => {
    if (!session) return;

    const refreshToast = toast.loading("Processing checkout...");

    const success = await handleCheckout(session.access_token);

    if (success) {     
      toast.success("Checkout successful!", {
        id: refreshToast
      });
      setCartItems([]);
    } else {
      toast.error("Failed to checkout.", {
        id: refreshToast,
      });
      setError("Failed to checkout.");
    }
  }

  // Calculate total price
  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.quantity * (item.price || 0),
      0
    ).toFixed(2);

  if (!session) {
    return <div>Loading session...</div>;
  }

  if (loading) {
    return <p>Loading cart items...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden text-white">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-8 grid gap-8 mt-8">
          <div className="w-3/5 mx-auto p-4 bg-blue-500 rounded-lg shadow-md">
            <Toaster />
            <h2 className="text-2xl font-bold mb-4 text-center">Shopping Cart</h2>
            {Array.isArray(cartItems) && cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-black">{item.productName}</h3>
                      <p className="text-gray-600">${(item.price || 0).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateCartItem(item.itemId, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded text-center text-gray-600"
                      />
                      <button
                        onClick={() => handleDeleteCartItem(item.itemId)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="text-right font-bold text-lg">
                  Total: ${calculateTotal()}
                </div>

                <button
                  onClick={handleCheckoutSubmit}
                  className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                  Checkout
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
