"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";
import { fetchProducts } from "@/api/fetchProducts";
import { fetchBaskets } from "@/api/fetchBaskets";
import { Product } from "@/types/product";
import { Basket } from "@/types/basket";
import Table from "../../../../components/Table";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import RefreshIcon from "@heroicons/react/outline/RefreshIcon";

export default function Amap({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [productFilter, setProductFilter] = useState("");
  const [basketFilter, setBasketFilter] = useState("");

  const [productSortKey, setProductSortKey] = useState<keyof Product | null>(
    null
  );
  const [productSortOrder, setProductSortOrder] = useState<"asc" | "desc">(
    "asc"
  );
  const [basketSortKey, setBasketSortKey] = useState<keyof Basket | null>(null);
  const [basketSortOrder, setBasketSortOrder] = useState<"asc" | "desc">("asc");

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
    const getBaskets = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedBaskets = await fetchBaskets(session.access_token, id);
          setBaskets(fetchedBaskets);
        } catch (error) {
          console.error("Error fetching baskets:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    getBaskets();
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

  // Filter products and baskets by name
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productFilter.toLowerCase())
  );

  const filteredBaskets = baskets.filter((basket) =>
    basket.name.toLowerCase().includes(basketFilter.toLowerCase())
  );

  const handleSort = <T,>(
    key: keyof T,
    setSortKey: React.Dispatch<React.SetStateAction<keyof T | null>>,
    sortOrder: "asc" | "desc",
    setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>,
    data: T[]
  ) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newSortOrder);

    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return newSortOrder === "asc" ? -1 : 1;
      if (a[key] > b[key]) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedProducts = productSortKey
    ? [...filteredProducts].sort((a, b) =>
        productSortOrder === "asc"
          ? a[productSortKey]! < b[productSortKey]!
            ? -1
            : 1
          : a[productSortKey]! > b[productSortKey]!
          ? -1
          : 1
      )
    : filteredProducts;

  const sortedBaskets = basketSortKey
    ? [...filteredBaskets].sort((a, b) =>
        basketSortOrder === "asc"
          ? a[basketSortKey]! < b[basketSortKey]!
            ? -1
            : 1
          : a[basketSortKey]! > b[basketSortKey]!
          ? -1
          : 1
      )
    : filteredBaskets;

  const handleProductsRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...");

    const fetchedProducts = await fetchProducts(session.access_token, id);
    setProducts(fetchedProducts);

    toast.success("Product list updated!", {
      id: refreshToast,
    });
  };

  const handleBasketsRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...");

    const fetchedBaskets = await fetchBaskets(session.access_token, id);
    setBaskets(fetchedBaskets);

    toast.success("Basket list updated!", {
      id: refreshToast,
    });
  };

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden">
      <Toaster />
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-8 grid gap-8 mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold">Amap Products:</h1>
            <div className="flex gap-2">
              <RefreshIcon
                onClick={handleProductsRefresh}
                className="h-8 w-8 cursor-pointer mr-5 mt-1 transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
              />
              <input
                type="text"
                placeholder="Search product"
                className="px-2 py-1 border border-gray-300 rounded text-gray-700"
                onChange={(e) => setProductFilter(e.target.value)}
                value={productFilter}
              />
              <button
                className="px-4 py-2 text-white bg-blue-900 rounded"
                onClick={() => router.push("/createProduct")}
              >
                Create Product
              </button>
            </div>
          </div>
          {sortedProducts.length > 0 ? (
            <Table
              headers={[
                { label: "Product Name", key: "name" },
                { label: "Product Type", key: "type" },
                { label: "Product Price per kg", key: "price" },
              ]}
              data={sortedProducts}
              onSort={(key) =>
                handleSort(
                  key,
                  setProductSortKey,
                  productSortOrder,
                  setProductSortOrder,
                  products
                )
              }
              sortKey={productSortKey}
              sortOrder={productSortOrder}
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

          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold">Amap Baskets:</h1>
            <div className="flex gap-2">
              <RefreshIcon
                onClick={handleBasketsRefresh}
                className="h-8 w-8 cursor-pointer mr-5 mt-1 transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
              />
              <input
                type="text"
                placeholder="Search basket"
                className="px-2 py-1 border border-gray-300 rounded text-gray-700"
                onChange={(e) => setBasketFilter(e.target.value)}
                value={basketFilter}
              />
              <button
                className="px-4 py-2 text-white bg-blue-900 rounded"
                onClick={() => router.push(`/createBasket/${id}`)}
              >
                Create Basket
              </button>
            </div>
          </div>
          {sortedBaskets.length > 0 ? (
            <Table
              headers={[
                { label: "Basket Name", key: "name" },
                { label: "Basket Type", key: "type" },
                { label: "Basket Price", key: "price" },
              ]}
              data={sortedBaskets}
              onSort={(key) =>
                handleSort(
                  key,
                  setBasketSortKey,
                  basketSortOrder,
                  setBasketSortOrder,
                  baskets
                )
              }
              sortKey={basketSortKey}
              sortOrder={basketSortOrder}
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
