'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/homepage");
  }, [router]);

  return null; // No UI is needed since we're redirecting
}

