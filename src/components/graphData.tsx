'use client'
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
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
export default function GraphData() {
    // the data is already pre-fetched on the server and immediately available here,
    // without an additional network call
    const { data } = useQuery({
        queryKey: ['data'],
        async queryFn() {
            return await request(url, query)
        }
    })
    return <div>{JSON.stringify(data ?? {})}</div>
}