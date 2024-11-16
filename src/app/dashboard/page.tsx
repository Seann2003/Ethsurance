'use client';

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import Layout from "../../components/layout";
import Wallet from "../../components/wallet";
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

const userAlice = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
});

// connect the stream
export default function DashboardPage() {

  const router = useRouter();
  const {
    ready,
    authenticated,
    user,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    // linkGoogle,
    // unlinkGoogle,
    // linkTwitter,
    // unlinkTwitter,
    // linkDiscord,
    // unlinkDiscord,
  } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const insufficientFunds = async ()=>{
    if (wallet) {
    const aliceMessagesBob = await userAlice.chat.send(wallet?.address, {
        content: "Your subscription h",
        });
    }

  }

  // const googleSubject = user?.google?.subject || null;
  // const twitterSubject = user?.twitter?.subject || null;
  // const discordSubject = user?.discord?.subject || null;

  return (
    <React.Fragment>
      <Head>
        <title>Privy Auth Demo</title>
      </Head>

      {ready && authenticated && user ? (
        <React.Fragment>
          <Layout>
            <div className="flex items-center justify-between">
              {/* {googleSubject ? (
                <button
                  onClick={() => {
                    unlinkGoogle(googleSubject);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink Google
                </button>
              ) : (
                <button
                  onClick={() => {
                    linkGoogle();
                  }}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                >
                  Link Google
                </button>
              )} */}
              <div className="flex flex-wrap gap-4">
                {email ? (
                  <button
                    onClick={() => {
                      unlinkEmail(email.address);
                    }}
                    type="button"
                    className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                    disabled={!canRemoveAccount}
                  >
                    Unlink email
                  </button>
                ) : (
                  <button
                    onClick={linkEmail}
                    type="button"
                    className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                  >
                    Connect email
                  </button>
                )}
                {wallet ? (
                  <button
                    type="button"
                    onClick={() => {
                      unlinkWallet(wallet.address);
                    }}
                    className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                    disabled={!canRemoveAccount}
                  >
                    Unlink wallet
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={linkWallet}
                    className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
                  >
                    Connect wallet
                  </button>
                )}
                {phone ? (
                  <button
                  type="button"
                    onClick={() => {
                      unlinkPhone(phone.number);
                    }}
                    className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                    disabled={!canRemoveAccount}
                  >
                    Unlink phone
                  </button>
                ) : (
                  <button
                  type="button"
                    onClick={linkPhone}
                    className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white border-none"
                  >
                    Connect phone
                  </button>
                )}
              </div>
              <Wallet />
            </div>

            <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <textarea
              value={JSON.stringify(user, null, 2)}
              className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2"
              rows={20}
              disabled
            />
          </Layout>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
}
