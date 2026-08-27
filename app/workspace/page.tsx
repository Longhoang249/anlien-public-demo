import type { Metadata } from "next";
import { PrivateWorkspacePreview } from "@/src/showroom/PrivateWorkspacePreview";

export const metadata: Metadata = {
  title: "ANLIEN Private Workspace Preview",
  description: "Synthetic access-state preview for the ANLIEN private workspace.",
};

export default function WorkspacePage() {
  return <PrivateWorkspacePreview />;
}
