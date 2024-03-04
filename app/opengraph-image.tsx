/* eslint-disable @next/next/no-img-element */
import {ImageResponse} from 'next/og'
import tailwindConfig from 'tailwind.config'
import colors from 'tailwindcss/colors'
import {Maige} from '~/components/logos'

export const runtime = 'edge'
export const alt = 'Maige: AI-powered codebase copilot'
export const contentType = 'image/png'
export const size = {
	height: 2160,
	width: 3840
}

const joshuaTreeNight =
	'https://maige.app/_next/static/media/joshua-tree-night.72aac569.png'
const labelFlow = 'https://maige.app/_next/static/media/full-flow.ee033c0b.png'

const orange = colors.orange[100]

export default async function Preview() {
	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					background: 'black',
					flexDirection: 'column',
					justifyContent: 'center',
					width: '100%',
					height: '100%',
					overflowY: 'hidden',
					position: 'relative'
				}}>
				<img
					alt='Joshua tree at night'
					src={joshuaTreeNight}
					style={{
						width: '100%',
						height: '100%',
						position: 'absolute',
						opacity: 0.5,
						objectFit: 'cover'
					}}
				/>
				<div
					style={{
						position: 'absolute',
						right: '60px',
						top: '60px',
						height: '100%',
						width: '90px',
						backgroundColor: tailwindConfig.theme.extend.colors.sunset
					}}
				/>
				<img
					alt='Labelling flow of Maige'
					src={labelFlow}
					style={{
						height: '80%',
						bottom: '-10px',
						right: '-20px',
						opacity: 0.9,
						borderRadius: '2px',
						position: 'absolute'
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: '84px',
						top: '12px',
						display: 'flex',
						flexDirection: 'column'
					}}>
					<div
						style={{
							color: orange,
							lineHeight: '100%',
							display: 'flex',
							flexDirection: 'column',
							fontSize: 72 * 3
						}}>
						<div>natural-language</div>
						<div>codebase</div>
						<div>actions</div>
					</div>
				</div>
				<div
					style={{
						position: 'absolute',
						display: 'flex',
						alignItems: 'flex-end',
						bottom: '84px',
						left: '84px'
					}}>
					<Maige
						style={{
							height: 76 * 3,
							width: 76 * 3,
							color: orange
						}}
					/>
					<div
						style={{
							display: 'flex',
							color: orange,
							flexDirection: 'column',
							marginLeft: '90px'
						}}>
						<div
							style={{
								fontSize: 72 * 3,
								letterSpacing: '-4px',
								lineHeight: '100%'
							}}>
							maige
						</div>
						<div
							style={{
								fontSize: 24 * 3
							}}>
							by Rubric Labs
						</div>
					</div>
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{
					data: await (
						await fetch(new URL('../lib/assets/fonts/Monocraft.otf', import.meta.url))
					).arrayBuffer(),
					name: 'monocraft'
				}
			]
		}
	)
}
