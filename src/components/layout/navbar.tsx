import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NavbarClient } from "@/components/layout/navbar-client";

export async function Navbar() {
  const session = await auth();

  let wishlistCount = 0;
  if (session?.user?.id) {
    try {
      wishlistCount = await db.wishlist.count({
        where: { userId: session.user.id },
      });
    } catch (err) {
      console.error("Failed to fetch initial wishlist count:", err);
    }
  }

  return (
    <NavbarClient
      user={session?.user}
      wishlistCount={wishlistCount}
    />
  );
}
