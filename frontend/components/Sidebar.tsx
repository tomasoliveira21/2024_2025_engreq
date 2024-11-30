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

  return (
    <div className="flex flex-col col-span-2 items-center px-4 md:items-start">
      <img className="m-1 h-13 w-20" src="/soc.png" alt="" />
      <SidebarRow Icon={HomeIcon} title="AMAP's" onClick={goToHome} />
      <SidebarRow Icon={ShoppingCartIcon} title="Cart" onClick={goToCart} />
      <SidebarRow Icon={ClipboardIcon} title="Orders" onClick={goToOrders}/>
      <SidebarRow Icon={CreditCardIcon} title="Subsciptions" onClick={goToSubscriptions}/>
      {/* TODO: Validation according to the value received from RBAC */}
      <SidebarRow Icon={ShieldCheckIcon} title="Producer Page" onClick={goToProducer} />
      {/* TODO: Validation according to the value received from RBAC */}
      <SidebarRow Icon={AdjustmentsIcon} title="Admin Page" onClick={goToAdmin} />
      <SidebarRow Icon={UserIcon} title="Profile" onClick={goToProfile} />
      <SidebarRow Icon={LogoutIcon} title="Sign Out" onClick={logout} />
    </div>
  );
}

export default Sidebar;
