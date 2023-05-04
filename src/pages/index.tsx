import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import LeaguesList from '../components/LeaguesList'

export default function HomePage() {
 	const { data: session } = useSession()
 	const router = useRouter()

 	useEffect(() => {
 		if (session?.token?.accessToken) {
 			router.push('/leagues')
 		}
 	}, [session])
 
	return (
		<div>
			Welcome to REMATCH: Fantasy Basketball!
			{
				!session?.token?.accessToken
				&& (
					<>
						<br />
						<span>You are not signed in</span>
						<br />
						<button onClick={() => signIn('yahoo', {callbackUrl: `https://localhost:3001/leagues`})}>Sign in</button>
					</>
				)
			}
		</div>
	)
}
