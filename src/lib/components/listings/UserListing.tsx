import type { User } from '../../schemas/user'
import { ListingThumbnail } from '../ListingThumbnail'
import { Link } from '@tanstack/react-router'
import { type ClassValue, cn } from 'cnfn'

export interface UserListingProps {
	user: User
	className?: ClassValue
}

export function UserListing({ user, className }: UserListingProps) {
	return (
		<Link
			to='/user/$id'
			params={{ id: String(user.id) }}
			className={cn(
				'grid grid-cols-[auto_1fr] items-center gap-4 text-left transition-transform active:scale-95 active:opacity-50',
				className,
			)}
		>
			<ListingThumbnail
				src={user.avatar_url}
				alt={`Profile picture of ${user.username}`}
				className='rounded-full'
			/>
			<div className='flex w-full min-w-0 flex-col'>
				<h3 className='truncate'>{user.username}</h3>
				{user.full_name !== user.username && (
					<p className='truncate opacity-50'>{user.full_name}</p>
				)}
			</div>
		</Link>
	)
}
