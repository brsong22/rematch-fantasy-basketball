import {
  useSession,
  signIn,
  signOut
} from "next-auth/react";

const LoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as <strong>{session.user.email}</strong> <br />
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
