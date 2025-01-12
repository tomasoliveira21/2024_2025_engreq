"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import { updateSubscription } from "@/api/updateSubscription";
import Sidebar from "../../../components/Sidebar";
import { Subscription } from "@/types/order";
import OrderCard from "../../../components/OrderCard";
import { fetchProducerOrders } from "@/api/fetchProducerOrders";

export default function Orders() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Subscription[]>([]);
  const [userRole, setUserRole] = useState(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      // Get the role from the database
      const userId = session?.user.id;
      const { data: existingUser } = await supabase
      .from('Users')
      .select('*')
      .eq('authuserid', userId)
      .single(); 

      const role = existingUser?.role;
      setUserRole(role);
      setSession(session);
    }
    getSession();
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      if (session) {
        try {
          setIsLoading(true);

          const userId = session?.user.id;
          const { data: existingUser } = await supabase
          .from('Users')
          .select('*')
          .eq('authuserid', userId)
          .single();

          const { data: producer } = await supabase
            .from('Producers')
            .select('id')
            .eq('userId', existingUser.id)
            .single();
          
          const producerId = producer?.id;

          console.log("producerId: ", producerId);
          
          const fetchedOrders = await fetchProducerOrders(session.access_token, producerId);
          setOrders(fetchedOrders);
  
          const initialQuantities = fetchedOrders.reduce((acc: { [key: number]: number }, order) => {
            order.OrderDetails.forEach((detail) => {
              acc[detail.id] = detail.quantity;
            });
            return acc;
          }, {});
          setQuantities(initialQuantities);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    getOrders();
  }, [session, userRole]);

  const handleUpdateSubscription = async (id: number, status: "pending" | "completed" | "cancelled") => {
    if (!session) return;
  
    const quantity = quantities[id];
    if (quantity < 1) return;
  
    const success = await updateSubscription(id, status, quantity, session.access_token);
  
    if (success) {
      window.location.reload();
    }
  };

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: value,
    }));
  };

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
          orders.map((order) => (
            <div key={order.id} className="space-y-4">
              <OrderCard order={order} />
              {
                userRole === "Producer" && (
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      value={quantities[order.id]}
                      onChange={(e) => handleQuantityChange(order.id, parseInt(e.target.value))}
                      className="w-16 p-1 border rounded text-center text-gray-600"
                    />
                    <button
                      onClick={() => handleUpdateSubscription(order.id, order.status)}
                      className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
                        !quantities[order.id] || quantities[order.id] < 1 ? 'cursor-not-allowed' : ''
                      }`}
                      disabled={!quantities[order.id] || quantities[order.id] < 1}
                    >
                      Update Order quantities
                    </button>
                  </div>
                )
              }
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
