import {
  useSession,
  signIn,
  signOut
} from "next-auth/react";
import { FunctionComponent, useMemo } from 'react';

const LoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn('yahoo', { callbackUrl: `https://localhost:3001/leagues` })}>Sign in</button>
    </>
  );
};

export default LoginButton;
