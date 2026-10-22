import { redirect } from "next/navigation";

export default async function OrderRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  redirect(`/orders/${p.id}`);
}
