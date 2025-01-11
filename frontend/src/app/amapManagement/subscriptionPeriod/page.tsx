"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../../components/Sidebar";


export default function Orders() {
  const [session, setSession] = useState<Session | null>(null);
  //const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    }
    getSession();
  }, []);

/*
  useEffect(() => {
    const getProducerBalance = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedProducerBalance = await fetchProducerBalance(session.access_token);
        } catch (error) {
          console.error("Error fetching Producer Balance:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getProducerBalance();
  }, [session]);
  */

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
            YO
        </div>
      </main>
    </div>
  );
}
