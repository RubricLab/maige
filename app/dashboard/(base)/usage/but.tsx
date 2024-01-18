"use client"

import React from 'react'
import { testRefetch } from './actions'
export default function ButTest() {
  return (
    <button onClick={testRefetch}>refetch</button>
  )
}