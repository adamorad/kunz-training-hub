import { notFound } from "next/navigation";
import { TOOLS } from "@/lib/training";
import ToolPage from "./tool";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ id: t.id }));
}

export default async function Page({ params }: PageProps<"/tools/[id]">) {
  const { id } = await params;
  if (!TOOLS.some((t) => t.id === id)) notFound();
  return <ToolPage id={id} />;
}
