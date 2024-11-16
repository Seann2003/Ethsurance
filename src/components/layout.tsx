import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Navbar, { type NavbarItem } from "./navbar";
import { useRouter } from "next/navigation";

type Props = {
  children?: React.ReactNode;
};

export default function Layout({
  children,
}: Props) {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const navbarItems: Array<NavbarItem> =
    [
      { id: "123", name: "Hello", resource: "hello" },
      { id: "456", name: "IDK", resource: "idk" },
    ];

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <React.Fragment>
      {user &&
        <Navbar accountId={user.id} items={navbarItems} />
      }
      {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div> */}
      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        {children}
      </main>
    </React.Fragment>
  );
}
