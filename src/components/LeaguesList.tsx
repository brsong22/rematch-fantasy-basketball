import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useSession, SessionData } from 'next-auth/react'
import Link from 'next/link'
import DataTable from './Utility/DataTable'
import TeamMatchups from './TeamMatchups'

const LeaguesList: FunctionComponent = () => {
	const [leagues, setLeagues] = useState<array>([])
	const [selectedLeague, setSelectedLeague] = useState<string | null>(null)
	const [userGuid, setUserGuid] = useState<string | null>(null)
	const [userTeam, setUserTeam] = useState(null)
	const [leagueTeams, setLeagueTeams] = useState([])

	const { data: session } = useSession<SessionData | null>()
	const accessToken = session.token.accessToken

	// https://cors-anywhere.herokuapp.com/corsdemo to enable corsanywhere
	const corsAnywhere = process.env.NEXT_PUBLIC_LOCAL_DEV ? process.env.NEXT_PUBLIC_CORS_ANYWHERE : ``

	useEffect(() => {
		const fetchLeagues = async () => {
			const gamesUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_codes=nba/leagues?format=json`

			const gamesResponse = await fetch(gamesUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (gamesResponse.ok) {
				const gamesResponseData = await gamesResponse.json()
				const gamesData = gamesResponseData.fantasy_content.users[0]

				const userGuid = gamesData.user[0].guid
				setUserGuid(userGuid)

				const games = Object.values(gamesData.user[1].games).slice(0, -1)
				const leaguesArray = games
					.map((gameNum) => (Object.values(gameNum).flat()[1].leagues))
					.flatMap((objectOfLeagues) => (Object.keys(objectOfLeagues).slice(0, -1).map((objectKey) => (objectOfLeagues[objectKey]))))
					.map((league) => league.league[0])
				setLeagues(leaguesArray)
			}
		}

		fetchLeagues()
	}, [])

	const handleClickedLeague = async (e: MouseEvent<HTMLAnchorElement>, league, rowIndex) => {
		e.preventDefault();

		if (league.league_key === selectedLeague?.league_key) {
			return
		}

		setSelectedLeague(league)
	}

	const leaguesTableConfig = {
		columns: [
			{
				bodyElement: (league) => (`${league.season}`),
				headElement: `Year`,
				styleElement: (league) => (``)
			},
			{
				bodyElement: (league) => (`${league.name}`),
				headElement: `League Name`,
				styleElement: (league) => (``)
			}
		],
		data: leagues,
		onRowClick: handleClickedLeague,
	}

	return (
		<>
			<br />
			<span>
				<strong>{`${session.user.name}'s Leagues: `}</strong>
			</span>
			<div>
				<DataTable tableProps={leaguesTableConfig} name="leaguesTable" />
		 	</div>
		 	{selectedLeague
		 		&& <TeamMatchups league={selectedLeague} userGuid={userGuid} />
		 	}
		</>
	)
}

export default LeaguesList
