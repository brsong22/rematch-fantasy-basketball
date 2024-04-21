import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

import LeaguesList from '../components/UI/LeaguesList';
import LoginButton from '../components/Utility/LoginButton';

export default function Leagues() {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!session?.token?.accessToken) {
			router.push('/');
		}
	}, [ session ]);

	return (
		<div>
			Welcome to REMATCH: Fantasy Basketball!
			{
				session?.token?.accessToken
				&& (
					<>
						<LeaguesList />
						<LoginButton />
					</>
				)
			}
		</div>
	);
}
