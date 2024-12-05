"use client";

import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";
import { fetchAmaps } from "@/api/fetchAmaps";
import { fetchProducts } from "@/api/fetchProducts";

export default function Amap({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
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
    const getAmaps = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedProducts = await fetchProducts(session.access_token, id);
          console.log("fetchedProducts: ", fetchedProducts);
        } catch (error) {
          console.error("Error fetching amaps:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getAmaps();
  }, [session]);

  useEffect(() => {
    if (!id) {
      router.push("/");
    }
  }, [id, router]);

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
          <h1>Amap Products:</h1>
        </div>
      </main>
    </div>
  );
}
