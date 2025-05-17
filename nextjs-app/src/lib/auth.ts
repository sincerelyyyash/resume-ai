import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseAuthOptions {
  required?: boolean;
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { required = false, redirectTo = "/signin" } = options;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    if (required && status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [status, required, redirectTo, router]);

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading,
    status,
  };
} 