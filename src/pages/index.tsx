import { signIn, signOut, useSession } from 'next-auth/react'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div>
      Welcome to REMATCH: Fantasy Basketball!
      {!session && (
        <>
          <br />
          <span>You are not signed in</span>
          <br />
          <button onClick={() => signIn('yahoo')}>Sign in</button>
        </>
      )}
      {session?.user && (
        <>
          <br />
          <span>
            <small>Signed in as:</small>&nbsp;<strong>{session.user.email ?? session.user.name}</strong>
          </span>
          <br />
          <a
            href={`/api/auth/signout`}
            onClick={(e) => {
              e.preventDefault()
              signOut()
            }}
          >
            Sign out
          </a>
        </>
      )}
    </div>
  )
}
