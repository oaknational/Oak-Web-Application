import { useUser } from "@clerk/nextjs";
import useSWR from "swr";

export async function useCheckUserMetadata() {
  const { user } = useUser();

  const updateRegionApiRoute = "/api/update-region";

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  };

  useSWR(
    user && user.unsafeMetadata?.requiresGeoLocation
      ? updateRegionApiRoute
      : null,
    fetcher,
  );
}
