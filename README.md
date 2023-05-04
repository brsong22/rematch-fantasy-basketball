# rematch-fantasy-basketball
allow users to adjust and analyze past fantasy basketball matchups to see how different decisions may have changed results

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
# to run it locally
#we need to set an env flag to proxy our outgoing requests
npm run localdev
# and separately we need to run a proxy for our server to handle incoming https
npm run localhost
```

Open [https://localhost:3001](https://localhost:3001) with your browser to see the login page (if you have already logged in and a session exists you will be redirected to https://localhost:3001/leagues.
