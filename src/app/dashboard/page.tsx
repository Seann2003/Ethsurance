'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Head from "next/head";
import Layout from "../../components/layout";
import Wallet from "../../components/wallet";
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { ethers, VoidSigner } from 'ethers';
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

  const checkForSevereEvent = async (userLocation) => {
    try {
      // Fetch data from EONET API
      const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?days=1&bbox=-129.020000,50.730000,-58.710000,12.890000");
      const data = await response.json();
  
      // Log the fetched data for debugging
      console.log("Fetched data:", data);
  
      // Get the current time
      const currentTime = new Date().toISOString();
      console.log("Current time:", currentTime);
  
      // Loop through events and check the conditions
      for (const event of data.events) {
        // Log event categories
        console.log("Event categories:", event.categories);
  
        // Check if the event's category is 'severeStorms'
        if (event.categories.some((cat: { id: string; }) => cat.id === "severeStorms")) {
          console.log("Found severe storm event:", event.title);
  
          // Loop through the geometry (coordinates) of the event
          for (const geometry of event.geometry) {
            const eventTime = new Date(geometry.date).toISOString();
            console.log("Event time:", eventTime);
  
            // Check if the event occurred recently (within the last 6 hours)
            const hoursDifference = Math.abs(new Date(currentTime).getTime() - new Date(eventTime).getTime()) / 36e5;
            console.log("Hours difference:", hoursDifference);
  
            // Define a threshold for recent events (e.g., 6 hours)
            if (hoursDifference <= 6) {
              // Check if the user's location is near the event's coordinates
              const distance = getDistance(userLocation, geometry.coordinates);
              console.log("Distance:", distance);
  
              // If the user is within a certain distance (e.g., 100km), return true
              if (distance <= 100) {
                console.log("Severe event detected within 100km!");
                return true;
              }
            }
          }
        }
      }
  
      // No severe events detected
      console.log("No severe events detected.");
      return false;
  
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };
  
  // Helper function to calculate distance between two coordinates (in kilometers)
  function getDistance(userLocation, eventCoordinates) {
    const [userLat, userLon] = userLocation;
    const [eventLat, eventLon] = eventCoordinates;
  
    const R = 6371; // Earth's radius in kilometers
    const latDiff = toRad(eventLat - userLat);
    const lonDiff = toRad(eventLon - userLon);
  
    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
              Math.cos(toRad(userLat)) * Math.cos(toRad(eventLat)) *
              Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in kilometers
  }
  
  // Helper function to convert degrees to radians
  function toRad(degrees: number) {
    return degrees * Math.PI / 180;
  }
  
  const handleSubmit = async () => {
    const userLocation = [currentLatitude, currentLongitude];
  
    const result = await checkForSevereEvent(userLocation);
    console.log(result ? "Severe disaster detected!" : "No severe disaster detected.");
  };
  
  const { ready: readyWallets, wallets } = useWallets();
  const [response, setResponse] = useState<string | undefined>(undefined);
  // Initialize PushAPI when wallets are ready
  useEffect(() => {
    const initializePushAPI = async () => {
      if (readyWallets && wallets.length > 0 && wallets[0].address) {
        const signer = ethers.Wallet.createRandom();
        try {
          const pushClient = await PushAPI.initialize(signer, {
            env: CONSTANTS.ENV.STAGING,
          });
          if (pushClient && wallets.length > 0) {
            try {
                const response = await pushClient.chat.send(wallets[0].address, {
                  content: "Your wallet has insufficient amount of balance to buy the insurance subscription. Please fund your wallet.",
                });
                console.log("Message sent:", response); 
                setResponse("Your wallet has insufficient amount of balance to buy the insurance subscription. Please fund your wallet.");
            } catch (error) {
              console.error("Failed to send message:", error);
            }
          } else {
            console.error("PushAPI userAlice not initialized or wallet not available");
          }
          console.log("PushAPI initialized:", user);
        } catch (error) {
          console.error("Failed to initialize PushAPI:", error);
        }
      }
    };
    
    initializePushAPI();
  }, [readyWallets, user, wallets]);

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
                            <Input className={"w-24 h-10"} value={currentLongitude} onChange={(e) => {
                                setCurrentLongitude(e.target.value);
                            }} />
                        </div>
                        <div className="flex gap-x-10 text-center items-center justify-center">
                            <Label className={"block"}>Longitude</Label>  
                            <Input className={"w-24 h-10"} value={currentLatitude} onChange={(e) => {
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
                {response && <p className="mt-4 text-green-500">{response}</p>}
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
