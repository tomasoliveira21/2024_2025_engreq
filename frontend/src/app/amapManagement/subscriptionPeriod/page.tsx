"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../../components/Sidebar";
import { fetchAmapSeasons } from "@/api/fetchAmapSeasons";
import { SeasonDetail } from "@/types/amapSeasons";
import SeasonList from "../../../../components/SeasonList";
import CreateSeasonForm from "../../../../components/CreateSeasonForm";

export default function Orders() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seasons, setSeasons] = useState<SeasonDetail[]>([]);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    }
    getSession();
  }, []);

  const getAmapSeasons = async () => {
    if (session) {
      try {
        setIsLoading(true);
        const fetchedAmapSeasons = await fetchAmapSeasons(session.access_token);
        setSeasons(fetchedAmapSeasons);
      } catch (error) {
        console.error("Error fetching Amap Seasons:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getAmapSeasons();
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
          <h1 className="text-2xl font-bold mb-4">Seasons</h1>
          <CreateSeasonForm
            sessionToken={session.access_token}
            onSeasonCreated={getAmapSeasons}
          />
          <SeasonList seasons={seasons} />
        </div>
      </main>
    </div>
  );
}
