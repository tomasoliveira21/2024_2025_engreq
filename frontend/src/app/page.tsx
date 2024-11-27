"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import "react-toastify/dist/ReactToastify.css";

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
    <div>
      <h1>Homepage</h1>
    </div>
  );
}
