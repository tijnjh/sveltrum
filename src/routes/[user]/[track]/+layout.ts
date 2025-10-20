import { resolveTrack } from '$lib/api/track.remote'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ params }) => resolveTrack(params)
