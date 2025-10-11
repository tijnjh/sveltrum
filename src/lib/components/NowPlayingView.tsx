import { isPausedAtom, nowPlayingAtom, showNowPlayingViewAtom } from '../atoms'
import type { Track } from '../schemas/track'
import { getRelatedTracks } from '../server-functions/discovery'
import { getTrackSource } from '../server-functions/hls'
import { Spinner } from './Spinner'
import { TrackListing } from './listings/TrackListing'
import { UserListing } from './listings/UserListing'
import { isServer } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { cn } from 'cnfn'
import Hls from 'hls.js'
import { useAtom, useAtomValue } from 'jotai'
import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

function applySource({
	track,
	element,
}: {
	track: Track
	element: HTMLAudioElement
}) {
	getTrackSource({ data: { id: track.id } }).then((url) => {
		if (!Hls.isSupported()) {
			throw new Error('hls is not supported')
		}

		const hls = new Hls()
		hls.loadSource(url)
		hls.attachMedia(element)
	})
}

export function NowPlayingView() {
	const nowPlaying = useAtomValue(nowPlayingAtom)
	const [isPaused, setIsPaused] = useAtom(isPausedAtom)
	const [showNowPlayingView, setShowNowPlayingView] = useAtom(
		showNowPlayingViewAtom,
	)

	useEffect(() => {
		if (nowPlaying) {
			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: nowPlaying.title,
					artist: nowPlaying.user.username,
					album: 'Sveltrum',
					artwork: [
						{
							src: nowPlaying.artwork_url?.replace('large', 't500x500') ?? '',
							sizes: '500x500',
							type: 'image/jpeg',
						},
					],
				})
			}
		}
	})

	if (!isServer) {
		window.onkeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault()
				setShowNowPlayingView(false)
			}
		}
	}

	const audioRef = useRef<HTMLAudioElement>(null)

	useEffect(() => {
		if (!nowPlaying) return
		if (!audioRef.current) return

		// we dont want to reapply the source if it already has one
		if (audioRef.current.src) return

		setIsPaused(true)

		applySource({ track: nowPlaying, element: audioRef.current })
	}, [nowPlaying, setIsPaused])

	useEffect(() => {
		if (!audioRef.current) return

		if (isPaused) {
			audioRef.current.pause()
		} else {
			audioRef.current.play().catch(() => {
				setIsPaused(true)
			})
		}
	}, [isPaused, setIsPaused])

	if (!nowPlaying) return

	const track = nowPlaying

	return (
		<div
			className={cn(
				'fixed inset-x-0 z-50 grid h-full grid-cols-1 place-items-center gap-x-8 overflow-y-scroll bg-zinc-700/75 p-4 backdrop-blur-lg transition-[top] duration-300 md:grid-cols-2',
				showNowPlayingView ? 'top-0' : 'top-[100%]',
			)}
		>
			<button
				type='button'
				onClick={() => setShowNowPlayingView(false)}
				className='absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-zinc-100/10 transition-transform active:scale-90 active:opacity-50'
			>
				<ChevronDownIcon size={16} strokeWidth={3} />
			</button>

			<div className='flex w-full flex-col gap-4 max-md:mt-16 md:max-w-sm'>
				{track.artwork_url ? (
					<img
						src={track.artwork_url.replace('large', 't500x500')}
						className='mt-12 aspect-square w-full rounded-xl'
						alt=''
					/>
				) : (
					<div className='mt-12 aspect-square w-full rounded-xl bg-zinc-700 md:max-w-md' />
				)}

				<hgroup>
					<h1 className='font-medium text-2xl'>{track.title}</h1>
					<button type='button' onClick={() => setShowNowPlayingView(false)}>
						<UserListing user={track.user} className='mt-4' />
					</button>
				</hgroup>

				{/** biome-ignore lint/a11y/useMediaCaption: dont care lmao */}
				<audio
					key={nowPlaying.id}
					className='h-10'
					controls
					onPause={() => setIsPaused(true)}
					onPlay={() => setIsPaused(false)}
					ref={audioRef}
				/>
			</div>

			<div className='mb-16 flex w-full flex-col gap-4 md:max-w-sm'>
				<h2 className='mt-8 font-medium text-2xl'>Related tracks</h2>

				<RelatedTracks trackId={track.id} />
			</div>
		</div>
	)
}

function RelatedTracks({ trackId }: { trackId: number }) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['related-tracks', trackId],
		queryFn: () => getRelatedTracks({ data: trackId }),
	})

	if (isLoading) return <Spinner />

	if (isError || !data) {
		return (
			<span className='font-medium text-xl text-zinc-100/25'>
				Failed to load related tracks
			</span>
		)
	}

	if (!data.collection.length) {
		return (
			<span className='font-medium text-xl text-zinc-100/25'>
				Nothing here...
			</span>
		)
	}

	return data.collection.map((track) => (
		<TrackListing key={track.id} track={track} />
	))
}
