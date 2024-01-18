import React from 'react'
import Link from 'next/link'

type Props = {}

export default async function Usage() {
  return (
    <div><Link href={`/dashboard/usage/hello`}>Go to hello page</Link></div>
  )
  }