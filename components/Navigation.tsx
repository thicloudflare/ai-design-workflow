"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex gap-6 items-start justify-center text-base text-center w-full">
      <Link
        href="/"
        className={`transition-colors underline decoration-kumo-line hover:decoration-kumo-brand ${
          isActive("/") ? "text-kumo-brand-text" : "text-text-default hover:text-kumo-brand-text"
        }`}
      >
        Home
      </Link>
      <Link
        href="/submit"
        className={`transition-colors underline decoration-kumo-line hover:decoration-kumo-brand ${
          isActive("/submit") ? "text-kumo-brand-text" : "text-text-default hover:text-kumo-brand-text"
        }`}
      >
        Submit a tool
      </Link>
      <Link
        href="/how-to-use"
        className={`transition-colors underline decoration-kumo-line hover:decoration-kumo-brand ${
          isActive("/how-to-use") ? "text-kumo-brand-text" : "text-text-default hover:text-kumo-brand-text"
        }`}
      >
        Guide & Contribute
      </Link>
    </nav>
  );
}
