import { useEffect, useState } from "react";

export const useSyncCookieEvents = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCookieEvents = () => {
      console.log("Fetching events from cookie...");
      console.log("Document cookies:", document.cookie.split(";"));

      const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("events_payload="))
        ?.split("=")[1];

      console.log("Raw cookie data:", raw);

      if (!raw) return;

      const parsedEvents = JSON.parse(decodeURIComponent(raw));

      console.log("Events from cookie:", parsedEvents);
      setLoading(false);
    };

    getCookieEvents();
  }, []);

  return { loading };
};
