import { useAuth } from "@/contexts/AuthContext";
import styles from "./UserDesigns.module.css";
import { notFound } from "next/navigation";
import { DesignService, ApiError, DesignDto } from "@/api/generated";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserDesigns() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [designs, setDesigns] = useState<DesignDto[]>();

  useEffect(() => {
    (async () => {
      const getAllDesigns = async () => {
        if (!user) {
          return null;
        }
        try {
          const designs = await DesignService.getAllDesigns();
          console.log(designs);
          return designs;
        } catch (error) {
          setError(
            error instanceof ApiError
              ? error.body?.errors?.[0] || "An error occurred"
              : "An unexpected error occurred"
          );
          return undefined;
        } finally {
          setIsLoading(false);
        }
      };
      const designs = await getAllDesigns();
      if (designs != undefined) {
        setDesigns(designs);
      }
    })();
  }, [user]);

  return (
    <div>
      {error && <p>{error}</p>}
      <h1>My Designs</h1>
      <div>
        {designs?.map((design) => {
          return <Link href={"/designer/" + design.id} key={design.id}><div key={design.id}>{design.name}</div></Link>;
        })}
      </div>
      {isLoading && "Loading designs"}
    </div>
  );
}
