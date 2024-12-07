"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";
import Table from "../../../../components/Table";
import { fetchProduct } from "@/api/fetchProduct";
import { ProductDetails } from "@/types/productDetails";

export default function Product({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetails | null>(null);

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
          setProduct(fetchedProduct[0]);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getProducts();
  }, [session, id]);

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

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden text-white">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-8 grid gap-8 mt-8">
          <h1 className="text-lg font-bold mb-2">Product Details:</h1>
          <div className="bg-blue-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <p>
              <strong>Price:</strong> {product.price} €
            </p>
            <p>
              <strong>Quantity Available to Produce:</strong> {product.quantity}
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <img
              src="https://cdn.apexminecrafthosting.com/img/uploads/2021/09/20185354/c503d10178dc6c224b8223417619dfae-1.png"
              alt="Random"
              className="rounded-lg shadow-md max-w-full max-h-[350px]"
              />
          </div>

          <h1 className="text-lg font-bold mb-2">Producer Details:</h1>
          <div className="bg-blue-900 p-6 rounded-lg shadow-md">
            <p>
              <strong>Business Name:</strong> {product.Producer.businessName}
            </p>
            <p>
              <strong>Contact Email:</strong> {product.Producer.User.email}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
