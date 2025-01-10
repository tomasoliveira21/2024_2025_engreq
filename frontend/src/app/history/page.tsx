"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../components/Sidebar";
import { fetchHistory } from "@/api/fetchHistory";
import { fetchKPIs } from "@/api/fetchKPIs";
import { HistoryS } from "@/types/historyS";
import { KPIs } from "@/types/kpis";
import OrderCard from "../../../components/OrderCard";

export default function Subscription() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<HistoryS[]>([]);
  const [kpis, setKpis] = useState<KPIs | null>(null);

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
          const fetchedOrders = await fetchHistory(session.access_token);
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

  useEffect(() => {
    const getKPIs = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedKPIs = await fetchKPIs(session.access_token);
          setKpis(fetchedKPIs);
        } catch (error) {
          console.error("Error fetching KPIs:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getKPIs();
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
          {kpis && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-blue-500 mb-4">Summary</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-lg text-gray-400">Total Orders</p>
                  <p className="text-4xl font-bold text-yellow-400">
                    {kpis.orderCount}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg text-gray-400">Total Cost</p>
                  <p className="text-4xl font-bold text-green-500">
                    €{kpis.orderCosts.totalCostSum.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg text-gray-400">Total Paid</p>
                  <p className="text-4xl font-bold text-blue-500">
                    €{kpis.orderCosts.paidCostSum.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col w-full">
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
