"use client"
import { useEffect, useState } from 'react';
import Layout from "../../components/layout";
import Wallet from "../../components/wallet";
import Popconfirm from '../../components/popconfirm';
import { useRouter } from 'next/navigation';
import { PushAPI, CONSTANTS, user } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { usePrivy, User, useWallets, WalletWithMetadata } from '@privy-io/react-auth';
import { Terminal } from "lucide-react"
import schedule from 'node-schedule';
import InsuranceContractABI from '../../abis/InsuranceProviderFactoryABI.json';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { get } from 'http';

const ActiveSubscriptionPage: React.FC = () => {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const [isSevereEvent, setIsSevereEvent] = useState<boolean>(false);
  const [disasterType, setDisasterType] = useState<string>('');
  const [userLocation, setUserLocation] = useState<string[]>([]);
  const [response, setResponse] = useState<string>('');

  if (!user && !authenticated) {
    router.push("/");
  }

  const provider = new ethers.providers.JsonRpcProvider("https://sepolia-rpc.scroll.io");
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY ? process.env.NEXT_PUBLIC_PRIVATE_KEY : "";
  const signer = new ethers.Wallet(privateKey, provider);
  // const signer = new ethers.Wallet("0xFf861c124a1Eb751D85d9cd524973F4D55d21c38", provider);
  const insuranceContract = new ethers.Contract(
    "0x8f986dBE23523cDEC3d4d69124b5ff250EdE9C36",
    InsuranceContractABI,
    signer
  );
  console.log(insuranceContract);
  schedule.scheduleJob('* */6 * * *', async () => {
    const checkForSevereEvent = async (userLocation: string[]) => {
      try {
        // Fetch data from EONET API
        const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?days=1&bbox=-129.020000,50.730000,-58.710000,12.890000");
        const data = await response.json();

        const currentTime = new Date().toISOString();

        // Loop through events and check the conditions
        for (const event of data.events) {

          // Loop through the geometry (coordinates) of the event
          for (const geometry of event.geometry) {
            const eventTime = new Date(geometry.date).toISOString();
            // Check if the event occurred recently (within the last 6 hours)
            const hoursDifference = Math.abs(new Date(currentTime).getTime() - new Date(eventTime).getTime()) / 36e5;

            // Define a threshold for recent events, 6 hours for this use case
            if (hoursDifference <= 6) {
              // Check if the user's location is near the event's coordinates using bounding box
              const distance = getDistance(userLocation, geometry.coordinates);

              if (distance <= 100) {
                return true;
              }
            }
          }
        }
        // No severe events detected
        return false;

      } catch (error) {
        console.error("Error fetching data:", error);
        return false;
      }
    };

    // Helper function to calculate distance between two coordinates (in kilometers)
    const getDistance = (userLocation: string[] | [any, any], eventCoordinates: [any, any]) => {
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
    const toRad = (degrees: number) => {
      return degrees * Math.PI / 180;
    }

    useEffect(() => {
      const fetchEvent = async () => {
        const result = await checkForSevereEvent(userLocation);
        setIsSevereEvent(result);
      };
      fetchEvent();
    }, [userLocation]);
  })
  const handleCancel = async () => {
    try {
      const tx = await insuranceContract.cancelPolicy();

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
    } catch (err) {
      console.error("There was an error cancelling the policy", err);
    }
    router.push("/dashboard");
  }

  const { ready: readyWallets, wallets } = useWallets();
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
            console.error("PushAPI pushClient not initialized or wallet not available");
          }
        } catch (error) {
          console.error("Failed to initialize PushAPI:", error);
        }
      }
    };

    initializePushAPI();
  }, [readyWallets, wallets]);

  return (
    <Layout>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          {response}
        </AlertDescription>
      </Alert>
      <div className='flex flex-col items-center justify-center h-[60vh]'>
        <Wallet />
        <h1 className='text-4xl font-bold'>Active Subscription</h1>
        <p className='text-xl mt-4'>
          User Location: {userLocation}
        </p>
        {isSevereEvent ? (
          <p className='text-xl mt-4 text-red-500'>Severe event detected near your location: {disasterType}</p>
        ) : (
          <p className='text-xl mt-4 text-green-500'>No severe events detected near your location.</p>
        )}
        <Popconfirm
          title='Cancelling Subscription'
          content='Are you sure to cancel this subscription?'
          okText='Yes'
          cancelText='No'
          onOk={handleCancel}
        >
          <button type='button' className='bg-red-600 hover:bg-red-700 font-semibold py-2 px-4 rounded-lg mt-5'>
            Cancel Subscription
          </button>
        </Popconfirm>
      </div>
    </Layout>
  );
};

export default ActiveSubscriptionPage;