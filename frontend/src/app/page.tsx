"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Cart";
import { fetchAmaps } from "@/api/fetchAmaps";
import { Amap } from "@/types/amap";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [amaps, setAmaps] = useState<Amap[]>([]);
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
    const getAmaps = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedAmaps = await fetchAmaps(session.access_token);
          setAmaps(fetchedAmaps || []);
        } catch (error) {
          console.error("Error fetching amaps:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getAmaps();
  }, [session]);

  if (!session) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-9 grid grid-cols-3 gap-8 mt-8">
          {amaps.length > 0 ? (
            amaps.map((amap) => (
              <Card
                key={amap.id}
                header={amap.name}
                description={amap.description}
                footer=""
              />
            ))
          ) : (
            <div>No AMAPs found</div>
          )}
        </div>
      </main>
    </div>
  );
}
