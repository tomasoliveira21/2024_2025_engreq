"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../../../components/Sidebar";
import { fetchProducerCriticalKPIs } from "@/api/fetchProducerCriticalKPIs";
import ProducerCriticalKPIs from "../../../../../components/ProducerCriticalKPIs";

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

  if (!session) {
    return <div>Loading session...</div>;
  }

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden text-white">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-8 grid gap-8 mt-8">
          <ProducerCriticalKPIs sessionToken={session.access_token} />
        </div>
      </main>
    </div>
  );
}
