"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import CodeInterface from "@/components/CodeInterface";

export default function PracticePage() {

  const { user } = useAuth();

  return (
    <>
      <CodeInterface/>
    </>
  );
}
