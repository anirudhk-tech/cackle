"use client";

import { useParams } from "next/navigation";

export default function GroupLinkPage() {
  const params = useParams();
  const linkId = params.linkId;

  return (
    <div className="justify-center items-center">
      <h1>Scheduling Page for {linkId}</h1>
    </div>
  );
}
