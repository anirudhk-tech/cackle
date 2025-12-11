"use client";

import AnonymousLinkPage from "@/components/pages/anonymousLinkPage";
import LinkPage from "@/components/pages/linkPage";
import { MainState } from "@/lib/store/store";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

export default function GroupLinkPage() {
  const params = useParams();
  const linkId = params.linkId as string;
  const user = useSelector((state: MainState) => state.auth.user);

  if (user) return <LinkPage linkId={linkId} />;

  return <AnonymousLinkPage linkId={linkId} />;
}
