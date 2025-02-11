import { ImageResponse } from 'next/og'
import colors from 'tailwindcss/colors'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { height: 32, width: 32 }

const orange = colors.orange[100]
const sunset = '#FF3D00' // not imported from Tailwind config to reduce bundle size

export default async function Icon() {
	return new ImageResponse(
		<div
			style={{
				alignItems: 'center',
				color: 'black',
				display: 'flex',
				height: '100%',
				justifyContent: 'center',
				position: 'relative',
				width: '100%'
			}}
		>
			{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
			<svg
				viewBox="0 0 500 500"
				fill="none"
				style={{
					width: '100%',
					height: '100%'
				}}
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M100 400H200V500H100V400Z" fill={orange} />
				<path d="M300 400H400V500H300V400Z" fill={orange} />
				<path d="M200 200H300V300H200V200Z" fill={orange} />
				<path d="M100 200H200V300H100V200Z" fill={orange} />
				<path d="M400 0H500V100H400V0Z" fill={orange} />
				<path d="M0 0H100V100H0V0Z" fill={orange} />
				<path d="M200 0H300V100H200V0Z" fill={orange} />
				<path d="M300 100H400V200H300V100Z" fill={orange} />
				<path d="M0 100H100V200H0V100Z" fill={orange} />
				<path d="M400 300H500V400H400V300Z" fill={orange} />
				<path d="M400 400H500V500H400V400Z" fill={orange} />
				<path d="M0 400H100V500H0V400Z" fill={orange} />
				<path d="M200 400H300V500H200V400Z" fill={orange} />
				<path d="M200 300H300V400H200V300Z" fill={orange} />
				<path d="M200 100H300V200H200V100Z" fill={orange} />
			</svg>
			<div
				style={{
					width: '30%',
					height: '30%',
					top: 0,
					transform: 'translateX(-50%)',
					left: `${~~(new Date().getHours() / 2.4)}0%`, // 😎
					borderRadius: '100%',
					position: 'absolute',
					background: `linear-gradient(180deg, ${colors.orange[500]} 0%, ${sunset} 100%)`
				}}
			/>
		</div>,
		{
			...size
		}
	)
}
