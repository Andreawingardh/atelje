//This hook was written by Deepak V on Medium: https://medium.com/@deepak.v2701/next-js-prevent-navigation-handle-back-button-page-reload-with-userouter-fbead4d69051
//It monkey-patches the router.push("/url") in order to allow it to take in parameters that checks if the user is trying to navigate away from a page with unsaved changes. We use this on our designer and designer[id] pages in order to show a modal to confirm that the user wants to leave.

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
const useBlockNavigation = (
  shouldBlock: boolean,
  allowedRoutes: string[] = []
) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAttemptingNavigation, setIsAttemptingNavigation] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const originalPushRef = useRef(router.push); // Store original router.push
  const lastLocationRef = useRef<string | null>(null); // Store last visited route    // Check if navigation is allowed
  const canNavigate = (url: string) => {
    const { pathname } = new URL(url, window.location.origin);
    return allowedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
  };
  useEffect(() => {
    const handleNavigation = (url: string) => {
      if (!shouldBlock || canNavigate(url) || url === pathname) {
        originalPushRef.current(url);
        return;
      }
      setIsAttemptingNavigation(true);
      setNextRoute(url);
    };
    router.push = ((url, _options) => {
      handleNavigation(url);
    }) as typeof router.push;
    return () => {
      router.push = originalPushRef.current;
    };
  }, [shouldBlock, pathname, allowedRoutes]); // Prevent Page Reloads
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldBlock) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldBlock]); // 🔙 Handle Back Button Navigation
  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      if (shouldBlock) {
        event.preventDefault();
        const previousURL = lastLocationRef.current || document.referrer || "/"; // Fallback to home if unknown
        setIsAttemptingNavigation(true);
        setNextRoute(previousURL);
        history.pushState(null, "", window.location.href); // Keep user on the same page
      }
    };
    lastLocationRef.current = pathname; // Track last known location
    history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [shouldBlock, pathname]); // Proceed or Cancel Navigation
  const proceedNavigation = () => {
    if (nextRoute) {
      setIsAttemptingNavigation(false);
      originalPushRef.current(nextRoute); // Navigate to previous or next route
      setNextRoute(null);
    }
  };
  const cancelNavigation = () => {
    setIsAttemptingNavigation(false);
    setNextRoute(null);
  };
  return { isAttemptingNavigation, proceedNavigation, cancelNavigation };
};
export default useBlockNavigation;
