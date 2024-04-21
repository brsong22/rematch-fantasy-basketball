import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

import LeaguesList from '../components/UI/LeaguesList';
import LoginButton from '../components/Utility/LoginButton';

export default function HomePage() {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session?.token?.accessToken) {
			router.push('/leagues');
		}
	}, [session]);

	return (
		<div>
			Welcome to REMATCH: Fantasy Basketball!
			{
				!session?.token?.accessToken
				&& (
					<>
						<br />
						<LoginButton />
					</>
				)
			}
		</div>
	);
}
