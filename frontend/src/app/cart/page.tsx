"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import { fetchCart } from "@/api/fetchCart";
import { fetchProduct } from "@/api/fetchProduct";
import { deleteCartItem } from "@/api/deleteCartItem";
import { updateCartItem } from "@/api/updateCartItem";
import { Carts } from "@/types/cart";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";

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
              const product = await fetchProduct(session.access_token, item.itemId);
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

  // Checkout the cart
  const handleCheckout = async () => {
    if (!session) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:3001/subscription/cart/checkout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Checkout failed.");
      }

      setCartItems([]);
      alert("Checkout successful!");
    } catch (err) {
      setError("Checkout failed. Please try again.");
    }
  };

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
    <div className="max-w-xl mx-auto p-4 bg-blue-500 rounded-lg shadow-md">
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
            onClick={handleCheckout}
            className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Checkout
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
