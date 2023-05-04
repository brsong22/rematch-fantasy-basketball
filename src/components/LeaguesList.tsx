import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const LeaguesList: FunctionComponent = () => {
	const [leagues, setLeagues] = useState([])
	const { data: session } = useSession()

	useEffect(() => {
		const fetchLeagues = async () => {
			const accessToken = session.token.accessToken
			if (!accessToken) {
				return
			}

			// https://cors-anywhere.herokuapp.com/corsdemo to enable corsanywhere
			const corsAnywhere = process.env.NEXT_PUBLIC_LOCAL_DEV ? process.env.NEXT_PUBLIC_CORS_ANYWHERE : ``
			const userFantasyNbaGames = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_codes=nba/leagues?format=json`

			const response = await fetch(userFantasyNbaGames, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (response.ok) {
				const data = await response.json()
				const games = Object.values(data.fantasy_content.users[0].user[1].games).slice(0, -1)
				const leagues = games.map((game) => {
					return Object.values(game.game[1].leagues).slice(0, -1).map((league) => ({
						key: league.league[0].league_key,
						name: league.league[0].name,
						season: league.league[0].season,
					}))
				})

				setLeagues(leagues.flat())
			}
		}

		fetchLeagues()
	}, [session])

	return (
		<>
			<br />
			<span>
				<strong>{`${session.user.name}'s Leagues: `}</strong>
			</span>
			<div>
				<ul>
					{leagues.map((league, index) => (
						<li key={index}>
							<strong>{league.season}:</strong>
							<strong>{league.season}:&nbsp;</strong>
								{league.name}
						</li>
					))}
				</ul>
		 	</div>
		</>
	)
}

export default LeaguesList
