import React from 'react'

type Props = {}

export default async function TestTab({}: Props) {
const usage = await fetch('http://localhost:3000/api/metrics', {method: 'POST', body: JSON.stringify({q: "", p: 1 }), next: {tags: ['usage']}}).then(
		res => res.json()
	)
  console.log(usage)
  return (
    <div>TestTab</div>
  )
}