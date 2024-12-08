"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../../../../components/Sidebar";
import { supabase } from "@/lib/supabase";
import { fetchProduct } from "@/api/fetchProduct";
import { ProductDetails } from "@/types/productDetails";

export default function Product({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const role = session.user.user_metadata.role;
        setUserRole(role);
      }
    }
    getSession();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      if (session) {
        try {
          setIsLoading(true);
          const fetchedProduct = await fetchProduct(session.access_token, id);
          console.log("fetchedProduct: ", fetchedProduct);
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

  const handleSubscription = async () => {
    setIsSubscribing(true);
    router.push(`/cart/${product.id}?itemType=product`);
  };

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

            <div className="flex items-center mt-10 mb-10 w-full">
              <div className="w-1/2">
                {product.photoUrl ? (
                  <img
                    src={product.photoUrl}
                    alt={product.name || "Product Image"}
                    className="rounded-lg shadow-md max-w-full"
                    onError={() =>
                      console.error(
                        "Error displaying the image:",
                        product.photoUrl
                      )
                    }
                  />
                ) : (
                  <p>No image available for this product.</p>
                )}
              </div>
              <div className="ml-24">
                {userRole === "Co-Producer" && (
                  <button
                    onClick={handleSubscription}
                    disabled={isSubscribing}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  >
                    {isSubscribing ? "Subscribing..." : "Subscribe to Product"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex">
              {/* Producer Details */}
              <div className="bg-blue-900 p-6 rounded-lg shadow-md w-1/2">
                <h1 className="text-lg font-bold mb-2 mt-4">
                  Producer Details:
                </h1>
                <p>
                  <strong>Business Name:</strong>{" "}
                  {product.Producer.businessName}
                </p>
                <p>
                  <strong>Contact Email:</strong> {product.Producer.User.email}
                </p>
              </div>

              {product.Producer.Certificates &&
                product.Producer.Certificates.length > 0 && (
                  <div className=" p-6 rounded-lg shadow-md w-1/2 ml-8">
                    <h1 className="text-lg font-bold mb-2 mt-4 text-white"></h1>
                    <div className="grid grid-cols-1 gap-4">
                      {product.Producer.Certificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="  p-4 rounded-lg  flex items-center text-white"
                        >
                          <img
                            src="https://cdn3.iconfinder.com/data/icons/approve-3/100/check_mark_approve_ok-10-512.png"
                            alt="Certificate Icon"
                            className="w-12 h-12 mr-4"
                          />
                          <div>
                            <p>
                              <strong>Certificate:</strong> {cert.name}
                            </p>
                            <p>
                              <strong>Issuing Authority:</strong>{" "}
                              {cert.issuingAuthority}
                            </p>
                            <p>
                              <strong>Issue Date:</strong>{" "}
                              {new Date(cert.issueDate).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Expiration Date:</strong>{" "}
                              {new Date(
                                cert.expirationDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
