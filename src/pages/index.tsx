import { signIn, signOut, useSession } from 'next-auth/react'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div>
      Welcome to Next.js!
      {!session && (
        <>
          <span>You are not signed in</span>
          <form method="post" action={`/api/auth/signin`} onSubmit={(e) => {
            e.preventDefault()
            signIn('yahoo')
          }}>
            <button type="submit">Sign in with Yahoo!</button>
          </form>
        </>
      )}
      {session?.user && (
        <>
          <span>
            <small>Signed in as</small>
            <br />
            <strong>{session.user.email ?? session.user.name}</strong>
          </span>
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
