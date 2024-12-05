"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Amap({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (!id) {
      router.push("/");
    }
  }, [id, router]);

  return <div>Amap ID: {id}</div>;
}
