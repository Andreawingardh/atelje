"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { apiClient } from "@/lib/api-client";
import LogOutButton from "@/features/auth/LogOutButton/LogOutButton";
import { useRouter } from "next/navigation";
import Button from "@/elements/Button/Button";

type HealthResponse = {
  status: string;
  statusCode: number;
  checks: { name: string; status: string }[];
};

const data = await apiClient<HealthResponse>("/health");

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.landingPageWrapper}>
      <h1>Welcome to Ateljé</h1>
      <p>Have you been struggling to put up frames on your wall? Wrestling with too many options and not enough inspiration? We are here to help you. At Ateljé, we provide a 3D model picture wall designer. Get your room and your sofa just right and then start designing. Your inspiration is the only limit!</p>
      <Button onClick={() => router.push('/designer')} buttonText="Start creating"/>
      <Image src="/landingpage-design.jpg" width={800} height={500} alt="A 3D model of a room with a sofa and frames on the wall" />
    </div>
  );
}
