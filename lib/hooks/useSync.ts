export const useSync = () => {
  const handleGoogleSync = async (linkId: string) => {
    const response = await fetch("/api/sync/google-calendar-sync", {
      method: "POST",
      body: JSON.stringify({ linkId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to connect Google calendar");
    }

    const { url } = await response.json();
    window.location.href = url;
  };

  return {
    handleGoogleSync,
  };
};
