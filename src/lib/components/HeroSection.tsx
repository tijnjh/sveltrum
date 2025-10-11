import type { User } from '../schemas/user'
import { UserListing } from './listings/UserListing'
import { cn } from 'cnfn'

export interface HeroSectionProps {
	pictureSrc?: string | null
	title: string
	user?: User
	roundedPicture?: boolean
}

export function HeroSection({
	pictureSrc,
	title,
	user,
	roundedPicture = false,
}: HeroSectionProps) {
	return (
		<>
			{pictureSrc && (
				<img
					src={pictureSrc.replace('large', 't500x500')}
					className={cn(
						'mx-auto my-4 aspect-square w-full max-w-xs',
						roundedPicture ? 'rounded-full' : 'rounded-xl',
					)}
					alt={title}
				/>
			)}

			<h1 className='font-medium text-2xl'>{title}</h1>

			{user && <UserListing user={user} className='mt-4' />}
		</>
	)
}
