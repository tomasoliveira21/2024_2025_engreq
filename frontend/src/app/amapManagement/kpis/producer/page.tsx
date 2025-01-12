"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../../../components/Sidebar";
import { fetchProducerCriticalKPIs } from "@/api/fetchProducerCriticalKPIs";

export default function KPIsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          const fetchedCriticalKPIs = await fetchProducerCriticalKPIs(session.access_token);
          console.log('fetchedKPIs: ', fetchedCriticalKPIs);
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

  /*
  if (isLoading) {
    return <div>Loading data...</div>;
  }
   */

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden text-white">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-8 grid gap-8 mt-8">
            {/* Faça o componente com Valor entregue por produtor por entrega e por periodo, apresente a info do endpoint aqui */}
        </div>
      </main>
    </div>
  );
}
