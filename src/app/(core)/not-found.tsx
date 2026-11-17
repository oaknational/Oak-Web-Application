"use client";
import ErrorPage from "@/components/GenericPagesComponents/ErrorPane";

export default function NotFound() {
  return <ErrorPage statusCode={404} />;
}
