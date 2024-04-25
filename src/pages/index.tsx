import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import LoginButton from '../components/Utility/LoginButton';

export default function HomePage() {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session?.token?.accessToken) {
			router.push('/leagues');
		}
	}, [
		router,
		session
	]);

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
