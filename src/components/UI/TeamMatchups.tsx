import { useSession } from 'next-auth/react';
import React, {
	FunctionComponent,
	useEffect,
	useMemo,
	useState
} from 'react';

import DataTable from '../Utility/DataTable';

const TeamMatchups: FunctionComponent = ({
	league,
	userGuid
}) => {
	const { data: session } = useSession<SessionData | null>();
	const accessToken = session.token.accessToken;

	const [teamStandingsInfo, setTeamStandingsInfo] = useState(null);
	const [teamInfo, setTeamInfo] = useState(null);
	const [teamMatchups, setTeamMatchups] = useState([]);

	// https://cors-anywhere.herokuapp.com/corsdemo to enable corsanywhere
	const corsAnywhere = process.env.NEXT_PUBLIC_LOCAL_DEV ? process.env.NEXT_PUBLIC_CORS_ANYWHERE : ``;

	useEffect(() => {
		const fetchTeams = async () => {
			const standingsUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/league/${league.league_key}/standings?format=json`;

			const standingsResponse = await fetch(standingsUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (standingsResponse.ok) {
				const standings = await standingsResponse.json();
				const teamsObjects = standings.fantasy_content.league[1].standings[0];
				const teamsArray = Object.values(teamsObjects.teams)
					.slice(0, -1)
					.map((team) => (team.team))
					.map((team) => ({
						info: team[0].reduce((teamInfo, infoItem) => Object.assign(teamInfo, infoItem), {}),
						stats: team[1],
						standings: team[2].team_standings,
					})
					);

				const currentTeam = teamsArray.find((team) => {
					const teamManagers = team.info.managers;
					return teamManagers.find((manager) => {
						return manager.manager.guid === userGuid;
					});
				});


				setTeamStandingsInfo(currentTeam);

				const weeksString = Array.from({ length: league.end_week }, (_, i) => i + 1).join(',');
				const matchupsUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/team/${currentTeam.info.team_key}/matchups;weeks=${weeksString}?format=json`;

				const matchupsResponse = await fetch(matchupsUrl, {	headers: { Authorization: `Bearer ${accessToken}` } });

				if (matchupsResponse.ok) {
					const matchupsResponseData = await matchupsResponse.json();
					const teamInfo = Object.assign({}, ...Object.values(matchupsResponseData.fantasy_content.team[0]));
					const teamMatchups = Object.assign({}, ...Object.values(matchupsResponseData.fantasy_content.team[1]));
					setTeamMatchups(Object.values(teamMatchups).slice(0, -1));
					setTeamInfo(teamInfo);
				}
			}
		};
		fetchTeams();
	}, [ league ]);

	const matchupsTableConfig = useMemo(() => ({
		columns: [
			{
				bodyElement: (matchup) => {
					const playoffsWeekDenotion = matchup.matchup.is_playoffs == 1 ? `*` : ``;
					return `${matchup.matchup.week}${playoffsWeekDenotion}`;
				},
				headElement: `Week`,
				styleElement: (matchup) => (matchup.matchup.is_playoffs == 1 ? `playoffsMatchup` : ``)
			},
			{
				bodyElement: (matchup) => {
					const matchupStatResults = matchup.matchup.stat_winners;
					const team1Info = matchup.matchup[0].teams[0].team[0];
					const team1 = Object.assign({}, ...team1Info);

					const team2Info = matchup.matchup[0].teams[1].team[0];
					const team2 = Object.assign({}, ...team2Info);

					const { team1Wins, team2Wins } = matchupStatResults.reduce(({ team1Wins, team2Wins }, matchup) => ({
						team1Wins: team1Wins + (matchup.stat_winner?.winner_team_key === team1.team_key ? 1 : 0),
						team2Wins: team2Wins + (matchup.stat_winner?.winner_team_key === team2.team_key ? 1 : 0)
					}), { team1Wins: 0, team2Wins: 0 });

					return `${team1.name} ${team1Wins} | ${team2Wins} ${team2.name}`;
				},
				headElement: `Matchup Result`,
				styleElement: (matchup) => (matchup.matchup.is_playoffs == 1 ? `playoffsMatchup` : ``)
			}
		],
		data: teamMatchups,
		onRowClick: () => { }
	}), [teamMatchups]);

	return (
		<>
			<span>---</span>
			<br />
			<strong>{teamInfo?.name}</strong> placed <strong>{teamStandingsInfo?.standings.rank}/{league?.num_teams}</strong>
			<br />
			<span>---</span>
			<br />
			<DataTable tableProps={matchupsTableConfig} name="matchupsTable" />
		</>
	);
};

export default TeamMatchups;
