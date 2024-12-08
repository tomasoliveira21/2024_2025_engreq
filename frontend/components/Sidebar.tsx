import React, { useEffect, useState } from "react";

import {
  UserIcon,
  HomeIcon,
  LogoutIcon,
  ShoppingCartIcon,
  ClipboardIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  AdjustmentsIcon
} from "@heroicons/react/outline";

import SidebarRow from "./SidebarRow";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function Sidebar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const goToHome = () => {
    router.push("/");
  };

  const goToCart = () => {
    router.push("/cart");
  };

  const goToOrders = () => {
    router.push("/orders");
  };

  const goToSubscriptions = () => {
    router.push("/subscriptions");
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  const goToProducer = () => {
    router.push("/producer");
  };

  const goToAdmin = () => {
    router.push("/admin");
  };


  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Get the role from the registration metadata
        const role = session.user.user_metadata.role;
        setUserRole(role);
      }
    };
  
    fetchUserRole();
  }, []);
  

  return (
    <div className="flex flex-col col-span-2 items-center px-4 md:items-start" aria-label="Sidebar Navigation">
      <img className="m-1 h-13 w-20" src="/soc.png" alt="" />
      <SidebarRow Icon={HomeIcon} title="AMAP's" onClick={goToHome} aria-label="Go to AMAP's page" />
      <SidebarRow Icon={ShoppingCartIcon} title="Cart" onClick={goToCart} aria-label="Go to Cart's page" />
      <SidebarRow Icon={ClipboardIcon} title="Orders" onClick={goToOrders} aria-label="Go to Orders page"/>
      <SidebarRow Icon={CreditCardIcon} title="Subscriptions" onClick={goToSubscriptions}/>
      {/* SidebarRow only visible to Producers and Admins */}
      {
        (userRole === "Producer" || userRole === "Admin") && (
          <SidebarRow Icon={ShieldCheckIcon} title="Producer Page" onClick={goToProducer} aria-label="Go to Producer's page" />
        )
      }
      {/* SidebarRow only visible to Admins */}
      {
        userRole === "Admin" && (
          <SidebarRow Icon={AdjustmentsIcon} title="Admin Page" onClick={goToAdmin} aria-label="Go to Admin's page" />
        )
      }
      <SidebarRow Icon={UserIcon} title="Profile" onClick={goToProfile} aria-label="Go to Profile's page" />
      <SidebarRow Icon={LogoutIcon} title="Sign Out" onClick={logout} aria-label="Back to login page" />
    </div>
  );
}

export default Sidebar;
