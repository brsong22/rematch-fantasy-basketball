import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import LeaguesComponent from '../components/UI/Leagues';
import LoginButton from '../components/Utility/LoginButton';

export default function LeaguesPage() {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!session?.token?.accessToken) {
			router.push('/');
		}
	}, [
		router,
		session
	]);

	return (
		<div>
			Welcome to REMATCH: Fantasy Basketball!
			<br />
			{
				session?.token?.accessToken
				&& (
					<>
						<LoginButton />
						<LeaguesComponent />
					</>
				)
			}
		</div>
	);
}
