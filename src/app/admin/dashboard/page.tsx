import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
import GraphData from "@/components/graphData";

const query = gql`{
  policyCreateds(orderBy: id) {
    id
    latitude
    longitude
    newContract
    payoutValue
    policyHolder
    premium
    timestamp
  }
}`
const url = 'https://api.studio.thegraph.com/query/90479/base-net/version/latest'

export default async function AdminDashboard() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['data'],
    async queryFn() {
      return await request(url, query)
    }
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-gray-800 text-white">
        <header className="bg-gray-900 py-4 px-6 shadow-md">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">Statistics</h2>
              <p className="mt-2">Overview of platform stats</p>
            </div>
          </div>
          <GraphData />
        </main>
      </div>
    </HydrationBoundary>
  );
};
