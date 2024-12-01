"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Cart";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

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
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:max-w-8xl mx-auto min-h-screen overflow-hidden">
      <main className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-9 grid grid-cols-3 gap-8">
          <Card
            header="AMAP PORTO"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun..."
            footer="Bjeras"
          />
          <Card
            header="AMAP LISBOA"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun..."
            footer="Bjeras"
          />
          <Card
            header="AMAP COIMBRA"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun..."
            footer="Bjeras"
          />
          <Card
            header="AMAP FARO"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun..."
            footer="Bjeras"
          />
          <Card
            header="AMAP BRAGA"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun..."
            footer="Bjeras"
          />
          <Card
            header="AMAP ÉVORA"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun..."
            footer="Bjeras"
          />
        </div>
      </main>
    </div>
  );
}
