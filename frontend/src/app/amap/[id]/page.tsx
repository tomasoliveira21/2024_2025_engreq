"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";
import { fetchProducts } from "@/api/fetchProducts";
import { Product } from "@/types/product";
import Table from "../../../../components/Table";
import { fetchBaskets } from "@/api/fetchBaskets";
import { Basket } from "@/types/basket";

export default function Amap({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [baskets, setBaskets] = useState<Basket[]>([]);

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
          const fetchedProducts = await fetchProducts(session.access_token, id);
          setProducts(fetchedProducts);
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
    const getProducts = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedBaskets = await fetchBaskets(session.access_token, id);
          setBaskets(fetchedBaskets);
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
          <h1 className="text-lg font-bold mb-2">Amap Products:</h1>
          {products.length > 0 ? (
            <Table
              headers={["Product Name", "Product Type", "Product Price per kg"]}
              data={products}
              renderRow={(product) => (
                <tr key={product.id}>
                  <td
                    className="border border-gray-300 px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    {product.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.price} €
                  </td>
                </tr>
              )}
            />
          ) : (
            <div>No products available.</div>
          )}

          <h1 className="text-lg font-bold mb-2">Amap Baskets:</h1>
          {baskets.length > 0 ? (
            <Table
              headers={["Basket Name", "Basket Type", "Basket Price"]}
              data={baskets}
              renderRow={(basket) => (
                <tr key={basket.id}>
                  <td
                    className="border border-gray-300 px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push(`/basket/${basket.id}`)}
                  >
                    {basket.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {basket.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {basket.price} €
                  </td>
                </tr>
              )}
            />
          ) : (
            <div>No baskets available.</div>
          )}
        </div>
      </main>
    </div>
  );
}
