import { useEffect, useState } from "react";

export const useUsername = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const setRandomUsername = async () => {
      const response = await fetch("api/user/random-username", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate random username");
      }

      const data = await response.json();
      setUsername(data.username);
    };

    setRandomUsername();
  }, []);

  return username;
};
