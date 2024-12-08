"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../components/Sidebar";
import { fetchOrders } from "@/api/fetchOrders";
import { Order } from "@/types/orders";

export default function Subscription() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

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
          const fetchedOrders = await fetchOrders(session.access_token);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getProducts();
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
          <div className="flex flex-col w-full">
            <h1 className="text-lg font-bold mb-4">Orders:</h1>
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-md"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-blue-500">
                      Order #{order.id} - {order.periodType.toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Date: {new Date(order.orderDate).toLocaleDateString()} |{" "}
                      Status:{" "}
                      <span
                        className={`${
                          order.status === "completed"
                            ? "text-green-500"
                            : "text-yellow-500"
                        } font-medium`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Total Cost: {order.totalCost.toFixed(2)} EUR | Paid:
                      {order.paidCost.toFixed(2)} EUR
                    </p>
                  </div>
                  <div className="space-y-4">
                    {order.OrderDetails.map((detail) => (
                      <div
                        key={detail.id}
                        className="p-3 border rounded-lg bg-gray-900"
                      >
                        <h3 className="text-lg font-semibold text-yellow-400">
                          {detail.itemType === "product"
                            ? detail.Product?.name
                            : detail.Basket?.name}
                        </h3>
                        <p className="text-sm text-gray-300">
                          Quantity: {detail.quantity} | Price:
                          {detail.price.toFixed(2)} EUR
                        </p>
                        {detail.itemType === "product" && detail.Product && (
                          <p className="text-sm text-gray-400">
                            Description: {detail.Product.description}
                          </p>
                        )}
                        {detail.itemType === "basket" && detail.Basket && (
                          <>
                            <p className="text-sm text-gray-400">
                              Description: {detail.Basket.description}
                            </p>
                            <p className="text-sm text-gray-400">
                              Weight: {detail.Basket.weight}kg
                            </p>
                            <div className="mt-2">
                              <p className="text-sm font-medium">
                                Products in Basket:
                              </p>
                              <ul className="list-disc list-inside text-gray-400">
                                {detail.Basket.Products.map((product) => (
                                  <li key={product.id}>
                                    {product.name} - {product.price.toFixed(2)}{" "}
                                    EUR
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
