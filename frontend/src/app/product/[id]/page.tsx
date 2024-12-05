"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";
import Table from "../../../../components/Table";
import { fetchProduct } from "@/api/fetchProduct";

export default function Product({ params }: { params: { id: string } }) {
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
    const getProducts = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedProduct = await fetchProduct(session.access_token, id);
          console.log('fetchedProduct: ', fetchedProduct);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getProducts();
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
        <div className="col-span-8 grid gap-8 mt-8">
          <h1 className="text-lg font-bold mb-2">Product Information:</h1>
        </div>
      </main>
    </div>
  );
}
