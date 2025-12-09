"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex gap-6 items-start justify-center font-source-code text-[16px] text-center underline w-full">
      <Link
        href="/"
        className={`transition-colors ${
          isActive("/")
            ? "text-[#FFA60C]"
            : "text-white hover:text-white/80"
        }`}
      >
        Home
      </Link>
      <Link
        href="/submit"
        className={`transition-colors ${
          isActive("/submit")
            ? "text-[#FFA60C]"
            : "text-white hover:text-white/80"
        }`}
      >
        Submit a tool
      </Link>
      <Link
        href="/how-to-use"
        className={`transition-colors ${
          isActive("/how-to-use")
            ? "text-[#FFA60C]"
            : "text-white hover:text-white/80"
        }`}
      >
        How to use
      </Link>
    </nav>
  );
}
