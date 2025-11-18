"use client";

import CTAContainer from "@/features/landing/CtaContainer/CtaContainer";
import styles from "./page.module.css";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Button from "@/elements/Button/Button";
import CircleButton from "@/elements/CircleButton/CircleButton";
import { useModal } from "@/contexts/ModalContext";
import MasonryBackground from "@/features/landing/MasonryBackground/MasonryBackground";

type HealthResponse = {
  status: string;
  statusCode: number;
  checks: { name: string; status: string }[];
};

const data = await apiClient<HealthResponse>("/health");

export default function Home() {
  const router = useRouter();
  const { openModal } = useModal();
  return (
    <div className={styles.landingPageWrapper}>
      <MasonryBackground />
      <CTAContainer>
        <div className={styles.landingPageCtaContainer}>
          <h1>Welcome to Ateljé</h1>
          <p>
            Have you been struggling to put up frames on your wall? Wrestling
            with too many options and not enough inspiration? We are here to
            help you. At Ateljé, we provide a 3D model picture wall designer.
            Get your room and your sofa just right and then start designing.
            Your inspiration is the only limit!
          </p>
          <Button
            className={styles.creatingButton}
            variant="cornflower"
            onClick={() => router.push("/designer")}
            buttonText="Start creating"
          />
        </div>
      </CTAContainer>
      <CircleButton
        buttonIcon="./icons/waving-blue-icon.svg"
        className={styles.aboutUsButton}
        onClick={() => openModal("about-us")}
      />
    </div>
  );
}
