"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import { fetchOrders } from "@/api/fetchOrders";
import Sidebar from "../../../components/Sidebar";

export default function Orders() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

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
    const getOrders = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedOrders = await fetchOrders(session.access_token);
          console.log("fetchedOrders: ", fetchedOrders);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getOrders();
  }, [session]);

  if (!session) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden text-white">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-8 grid gap-8 mt-8">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded">
                {/* TODO: FAZER UPDATE A ISTO */}
                <p>{JSON.stringify(order)}</p>
              </div>
            ))
          ) : (
            <div>No orders found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
