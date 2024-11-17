'use client';

import Portal from "../components/graphics/portal";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";

export default function LoginPage() {
  const { login } = usePrivy();

  return (
    <>
      <Head>
        <title>Login · Ethsurance</title>
      </Head>
    
      <main className="flex min-h-screen min-w-full bg-gray-100">
        <div className="flex flex-1 p-6 justify-center items-center">
          <div className="max-w-lg w-full text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Ethsurance</h1>
            <p className="text-lg text-gray-600 mb-8">
              Ethsurance is a decentralized insurance platform that uses a subscription-based model to allow users to create and cancel subscription policies based on a natural disaster API.
            </p>
            <div>
              <Portal style={{ maxWidth: "100%", height: "auto" }} />
            </div>
            <div className="mt-6 flex justify-center">
              <button
              type="button"
                onClick={login}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}