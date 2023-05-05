import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useSession, SessionData } from 'next-auth/react'
import Link from 'next/link'

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

			const response = await fetch(gamesUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (response.ok) {
				const data = await response.json()
				const gamesData = data.fantasy_content.users[0]

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
	}, [session])

	const handleClickedLeague = (e: MouseEvent<HTMLAnchorElement>, league) => {
		e.preventDefault();

		const {
			end_date: endDate,
			end_week: endWeek,
			is_finished: isFinished,
			league_id: leagueId,
			league_key: leagueKey,
			name,
			num_teams: leagueSize,
			season,
			start_date: startDate,
			start_week: startWeek,
			url
		}: {
			endDate: string,
			endWeek: number,
			isFinished: boolean,
			leagueId: number,
			leagueKey: string,
			name: string,
			leagueSize: number,
			season: number,
			startDate: string,
			startWeek: number,
			url: string
		} = {
			...league,
			endWeek: parseInt(league.end_week),
			isFinished: Boolean(league.is_finished),
			leagueId: parseInt(league.league_id),
			leagueSize: parseInt(league.num_teams),
			season: parseInt(league.season),
			startWeek: parseInt(league.start_week)
		}
		if (leagueKey === selectedLeague) {
			return
		}
		setSelectedLeague(leagueKey)

		const fetchTeams = async () => {
			const standingsUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/standings?format=json`
			
			const response = await fetch(standingsUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})

			if (response.ok) {
				const data = await response.json()
				const teamsObjects = data.fantasy_content.league[1].standings[0]
				const teamsArray = Object.values(teamsObjects.teams)
					.slice(0, -1)
					.map((team) => (team.team))
					.map((team) => ({
						info: team[0].reduce((teamInfo, infoItem) => Object.assign(teamInfo, infoItem), {}),
						stats: team[1],
						standings: team[2].team_standings,
					})
				)
				setLeagueTeams(teamsArray)

				const foundTeam = teamsArray.find((team) => {
					const teamManagers = team.info.managers
					const manager = teamManagers.find((manager) => {
						return manager.manager.guid === userGuid
					})

					return manager
				})

				setUserTeam(foundTeam)
			}
		}
		fetchTeams()

		fetchLeagues()
	}

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
							<a href="" onClick={(e) => handleClickedLeague(e, league)}><strong>{league.season}:&nbsp;</strong>{league.name}</a>
						</li>
					))}
				</ul>
		 	</div>
		 	{userTeam
		 		&& <>
		 			<span>---</span>
		 			<br />
		 			{userTeam.info.name} <strong>placed {userTeam.standings.rank}/{leagueTeams.length}</strong>
		 			<br />
		 			<span>---</span>
		 			<br />
		 		</>
		 	}
		</>
	)
}

export default LeaguesList
