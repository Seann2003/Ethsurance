'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Head from "next/head";
import Layout from "../../components/layout";
import Wallet from "../../components/wallet";
import { Field, Fieldset, Input, Label, Legend} from '@headlessui/react'


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
  const [currentLongitude, setCurrentLongitude] = useState<string>("");
  const [currentLatitude, setCurrentLatitude] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLatitude(latitude.toFixed(6));
        setCurrentLongitude(longitude.toFixed(6));
        setError(null);
      },
      (err) => {
        setError(err.message);
      }
    );
  };


  const handleSubmit = async () => {
    router.push("/activeSubscription");
  };


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
            <Fieldset className="space-y-8">
                <Legend className="text-lg font-bold mt-5">Buy your insurance subscription now!</Legend>
                <Field>
                    <Label className="block mb-5">Current location</Label>
                    <div className="mb-5 flex justify-between w-[450px]">
                        <div className="flex gap-x-10 text-center items-center justify-center">
                            <Label className={"block"}>Latitude</Label>  
                            <Input readOnly className={"w-24 h-10"} value={currentLongitude} onChange={(e) => {
                                setCurrentLongitude(e.target.value);
                            }} />
                        </div>
                        <div className="flex gap-x-10 text-center items-center justify-center">
                            <Label className={"block"}>Longitude</Label>  
                            <Input readOnly className={"w-24 h-10"} value={currentLatitude} onChange={(e) => {
                                setCurrentLatitude(e.target.value);
                            }} />
                        </div>
                    </div>
                    <button
                    type="button"
                    onClick={fetchLocation}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    Get Location
                </button>
                </Field>
                {error && <p className="mt-4 text-red-500">{error}</p>}
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg" onClick={handleSubmit}>Buy it now!</button>
            </Fieldset>
            {/* <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <textarea
              value={JSON.stringify(user, null, 2)}
              className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2"
              rows={20}
              disabled
            /> */}
          </Layout>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
}
