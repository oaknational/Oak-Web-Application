"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return router.replace("/404");
}
