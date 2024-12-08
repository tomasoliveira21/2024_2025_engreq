"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";
import Table from "../../../../components/Table";
import { fetchProduct } from "@/api/fetchProduct";
import { ProductDetails } from "@/types/productDetails";
import { fetchPhoto } from "@/api/fetchImages";

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
    const fetchProductData = async () => {
      if (!session) return;
  
      try {
        setIsLoading(true);

        const fetchedProduct = await fetchProduct(session.access_token, id);
        console.log("Fetched product:", fetchedProduct);
        const productDetails = fetchedProduct[0];
        console.log("Product details:", productDetails);
  
        if (productDetails?.photoUrl) {
          const photoId = productDetails.photoUrl.split("/").pop();
          if (photoId) {
            try {
              const token = "XJNrKpIxQT5zzanoRN7Ur9N0IQHXKmKr1VAxPrT76LUkzFwacrCGM8pi";
              const photoUrl = await fetchPhoto(photoId, token);
              productDetails.photoUrl = photoUrl;
            } catch (error) {
              console.error("Error fetching product photo:", error);
            }
          }
        }
  
        setProduct(productDetails);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProductData();
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
          <div className="flex flex-col w-full">
            <h1 className="text-lg font-bold mb-2">Product Details:</h1>
            <div className="bg-blue-900 p-6 rounded-lg shadow-md w-1/2 mb-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p>{product.description}</p>
              <p>
                <strong>Price:</strong> {product.price} €
              </p>
              <p>
                <strong>Quantity Available to Produce:</strong>{" "}
                {product.quantity}
              </p>
            </div>

            <div className="mt-10 mb-10 w-1/2">
              {product.photoUrl ? (
                <img
                  src={product.photoUrl}
                  alt={product.name || "Product Image"}
                  className="rounded-lg shadow-md max-w-full"
                  onError={() => console.error("Error displaying the image:", product.photoUrl)}
                />
              ) : (
                <p>No image available for this product.</p>
              )}
            </div>

            <h1 className="text-lg font-bold mb-2 mt-4">Producer Details:</h1>
            <div className="bg-blue-900 p-6 rounded-lg shadow-md w-1/2">
              <p>
                <strong>Business Name:</strong> {product.Producer.businessName}
              </p>
              <p>
                <strong>Contact Email:</strong> {product.Producer.User.email}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
