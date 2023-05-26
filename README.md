# rematch-fantasy-basketball
## Objective
allow users to adjust and analyze past fantasy basketball matchups to see how different decisions may have changed results
- this is not intended to overwrite any existing data and is simply a "sandbox" for users to play around and explore any regrets or settle any debates that may have occured from potentially missed opportunities during any previous fantasy league matchups.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## Current roadmap
- Create a Proof-of-concept that we are able to retrieve the necessary information, display the information, and build an MVP for allowing users to alter rosters and update matchup results.
- [x] Implement custom Yahoo! Auth provider in Next.js to leverage Yahoo!'s OAuth workflow
- [x] Fetch and display list of logged in user's past leagues
- [x] Fetch and display a selected league's matchup weeks for the given user when clicking on a league in the leagues list
- [ ] Show matchup category breakdown when selecting a specific matchup week from the matchups list
- [ ] Show the team rosters for the given matchup
- [ ] Allow user to alter rosters and show updated outcomes based on altered rosters' stats
- [ ] Get Proof-of-Concept working and plan refactor work for optimizations, testing, coding practicies, linting, etc.
#### Considerations
- **Caching**: Since we are dealing with past data and this data realistically is static and should not change we could take advantage of caching
- **Cron job**: Expanding on caching, we could also realistically have a cron job that we could implement in the Backend to prefetch necessary data rather than directly making requests from the Frontend to Yahoo! each time the user performs an action.
- **"ETL"/Database**: Furthermore, because Yahoo!'s data by default comes back as XML data and requesting it in JSON with `?format=json` really just gives us a messy "JSON" response that is a literal transformation of XML into JSON syntax, we can do some preprocessing of the data and storing into some kind of database for better performance and data fetching. This would also allow us to "decouple" the FE from Yahoo! and allow us to build more customized requests tailored for our use cases.
#### Local Setup
- This project will require you to create a [Yahoo! Developer account](https://developer.yahoo.com/) in order to create a Yahoo! app to access Yahoo! fantasy sports data.
- Here is an example configuration for an application to allow OAuth and access to user and fantasy data:
![image](https://github.com/brsong22/rematch-fantasy-basketball/assets/3451710/09cc7d7c-c01b-426e-b83c-1f3330d301a0)
- this project also currently utilizes [cors anywhere](https://cors-anywhere.herokuapp.com/corsdemo) to handle CORS when developing from localhost and making requests to Yahoo!
- Run the development server (see [package.json](package.json))
```bash
# this script handles running the app dev server as well as configure the "Dev mode" Next.js environment variable
npm run localdev
```
- Run a request proxy (see [package.json](package.json))
```bash
# we need to run a proxy for our server to handle incoming https
npm run localhost
```

Open [https://localhost:3001](https://localhost:3001) with your browser to see the login page (if you have already logged in and a session exists you will be redirected to https://localhost:3001/leagues.


