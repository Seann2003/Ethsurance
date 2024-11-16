'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { sepolia } from "viem/chains";

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#6D28D9'
        },
        supportedChains: [sepolia],
        defaultChain: sepolia,
        // Create wallet for all users, regardless of external wallet
        embeddedWallets: {
          createOnLogin: 'all-users'
        }
      }}
      onSuccess={() => router.push("/dashboard")}
    >
      {children}
    </PrivyProvider>
  );
}
