"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../components/Sidebar";
import { fetchProducerBalance } from "@/api/fetchProducerBalance";
import { fetchCoproducerBalance } from "@/api/fetchCoproducerBalance";
import { BalanceDetail } from "@/types/producerBalance";
import ProducerBalanceList from "../../../components/ProducerBalanceList";
import CoProducerBalanceList from "../../../components/CoProducerBalanceList";
import { fetchProducerAccountValues } from "@/api/fetchProducerAccountValues";
import ProducerAccountValues from "../../../components/ProducerAccountValues";
import { AccountValues } from "@/types/producerBalance";

export default function Orders() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [producerBalance, setProducerBalance] = useState<BalanceDetail[]>([]);
  const [coproducerBalance, setCoproducerBalance] = useState<BalanceDetail[]>([]);
  const [producerAccountValues, setProducerAccountValues] = useState<AccountValues[]>([]);

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
    const getCoproducerBalance = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedCoproducerBalance = await fetchCoproducerBalance(session.access_token);
          setCoproducerBalance(fetchedCoproducerBalance);
        } catch (error) {
          console.error("Error fetching Co-Producer Balance:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getCoproducerBalance();
  }, [session]);

  useEffect(() => {
    const getProducerBalance = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedProducerBalance = await fetchProducerBalance(session.access_token);
          setProducerBalance(fetchedProducerBalance);
        } catch (error) {
          console.error("Error fetching Producer Balance:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getProducerBalance();
  }, [session]);

  useEffect(() => {
    const getProducerAccountValues = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedProducerAccountValues = await fetchProducerAccountValues(session.access_token);
          setProducerAccountValues(fetchedProducerAccountValues);
        } catch (error) {
          console.error("Error fetching Producer Account Values:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getProducerAccountValues();
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
          <h1 className="text-3xl font-extrabold text-gray-100 border-b border-gray-700 pb-2">
            Define Subscription Period
          </h1>
          <button
            onClick={() => router.push(`amapManagement/subscriptionPeriod`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            style={{ alignSelf: "flex-start" }}
          >
            Navigate to Subscription Period page
          </button>

          <h1 className="text-3xl font-extrabold text-gray-100 border-b border-gray-700 pb-2">
            Critical KPIs
          </h1>
          <button
            onClick={() => router.push(`amapManagement/kpis`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            style={{ alignSelf: "flex-start" }}
          >
            Navigate to KPIs page
          </button>

          <h1 className="text-3xl font-extrabold text-gray-100 border-b border-gray-700 pb-2 mt-8">
            Amounts to be Paid by Co-Producers
          </h1>
          <CoProducerBalanceList balanceDetails={coproducerBalance} />

          <h1 className="text-3xl font-extrabold text-gray-100 border-b border-gray-700 pb-2 mt-8">
            Amounts to be Received by Producers
          </h1>
          <ProducerBalanceList balanceDetails={producerBalance} />
        </div>
      </main>
    </div>
  );
}
