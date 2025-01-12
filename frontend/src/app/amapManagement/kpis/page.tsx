"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import Sidebar from "../../../../components/Sidebar";
import { useRouter } from "next/navigation";

export default function KPIsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

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
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => router.push(`kpis/producer`)}
                className="bg-blue-500 text-white py-10 px-10 rounded-lg hover:bg-blue-600 transition"
              >
                Producer KPIs
              </button>
              <button
                onClick={() => router.push(`kpis/coproducer`)}
                className="bg-green-500 text-white py-10 px-10 rounded-lg hover:bg-green-600 transition"
              >
                Co-Producer KPIs
              </button>
            </div>
            <div className="flex-shrink-0 ml-4">
              <img
                src="https://blog.autoforce.com/wp-content/uploads/2023/02/blog-kpis.png"
                alt="KPIs Illustration"
                className="w-500px h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
