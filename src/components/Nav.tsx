"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-white px-4 text-primary-foreground shadow-md w-full">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/" className="text-foreground hover:text-[#FF5733]">
            BRASOV PORTAL
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">{children}</div>
      </div>
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(
        "relative p-2 text-lg font-medium transition-all duration-300 hover:text-[#FF5733] focus-visible:text-[#FF5733]",
        pathname === props.href
          ? "text-[#FF5733] border-b-2 border-[#FF5733]"
          : "text-foreground"
      )}
    >
      {props.children}
      {pathname === props.href && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5733]"></span>
      )}
    </Link>
  );
}
