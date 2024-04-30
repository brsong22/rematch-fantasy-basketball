import { useSession } from 'next-auth/react';
import React, {
	FunctionComponent,
	useEffect,
	useMemo,
	useState
} from 'react';
import { xml2js } from 'xml-js';

import Matchups from './Matchups';
import { League } from '../Models/League';
import { Matchup } from '../Models/Matchup';
import { Standings as StandingsModel } from '../Models/Standings';
import { Team } from '../Models/Team';
import {
	DataTable,
	TableColumn,
	TableProps
} from '../Utility/DataTable';

type StandingsProps = {
	league: League;
	userGuid: string | null;
}

const Standings: FunctionComponent<StandingsProps> = ({
	league,
	userGuid
}) => {
	const { data: session } = useSession();
	const accessToken = session?.token?.accessToken;

	const [ currentTeam, setCurrentTeam ] = useState<Team | undefined>(undefined);
	const [ leagueTeamStandings, setLeagueTeamStandings ] = useState<StandingsModel | undefined>(undefined);
	const [ selectedTeam, setSelectedTeam ] = useState<Team | undefined>(undefined);
    const [ prevLeague, setPrevLeague ] = useState<League>(league);

	// https://cors-anywhere.herokuapp.com/corsdemo to enable corsanywhere
	const corsAnywhere = process.env.NEXT_PUBLIC_LOCAL_DEV ? process.env.NEXT_PUBLIC_CORS_ANYWHERE : ``;

	useEffect(() => {
        if (league !== prevLeague) {
			setPrevLeague(prevLeague);
			setSelectedTeam(undefined);
        }
    }, [
        league,
        prevLeague
	]);
	
	useEffect(() => {
		const fetchTeams = async () => {
			const standingsUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/league/${league.league_key}/standings`;

			const standingsResponse = await fetch(standingsUrl, { headers: { Authorization: `Bearer ${accessToken}` } });

			if (standingsResponse.ok) {
				const leagueStandingsResponseString = await standingsResponse.text();
				const leagueData: any = xml2js(leagueStandingsResponseString, {
					alwaysArray: true,
					compact: true,
					ignoreAttributes: true,
					ignoreComment: true,
					ignoreDeclaration: true,
					ignoreInstruction: true,
					nativeType: true,
					textKey: 'value'
				});
				const leagueStandings: any = leagueData.fantasy_content[0].league[0].standings[0];
				const leagueTeams: Array<Team> = leagueStandings.teams[0].team
					.map((team: any) => {
						const teamData = {
							clinched_playoffs: team?.clinched_playoffs ? team.clinched_playoffs[0].value[0] : 0,
							draft_position: team?.draft_position ? team.draft_position[0].value[0] : 0,
							has_draft_grade: team.has_draft_grade[0].value[0],
							is_owned_by_current_login: team?.is_owned_by_current_login ? team.is_owned_by_current_login[0].value[0] : 0,
							league_scoring_type: team.league_scoring_type[0].value[0],
							managers: team.managers[0].manager.map((manager: any) => {
								return {
									email: manager?.email ? manager.email[0].value[0] : '',
									felo_score: manager.felo_score[0].value[0],
									felo_tier: manager.felo_tier[0].value[0],
									guid: manager.guid[0].value[0],
									image_url: manager?.image_url ? manager.image_url[0].value[0] : ``,
									is_current_login: manager?.is_current_login ? manager.is_current_login[0].value[0] : 0,
									manager_id: manager.manager_id[0].value[0],
									nickname: manager.nickname[0].value[0]
								};
							}),
							name: team.name[0].value[0],
							number_of_moves: team.number_of_moves[0].value[0],
							number_of_trades: team.number_of_trades[0].value[0],
							roster_adds: team.roster_adds.map((adds: any) => {
								return {
									coverage_type: adds.coverage_type[0].value[0],
									coverage_value: adds.coverage_value[0].value[0],
									value: adds.value[0].value[0]
								};
							}),
							team_id: team.team_id[0].value[0],
							team_key: team.team_key[0].value[0],
							team_logos: team.team_logos[0].team_logo.map((logo: any) => {
								return {
									size: logo.size[0].value[0],
									url: logo.url[0].value[0]
								};
							}),
							team_points: team.team_points.map((teamPoints: any) => {
								return {
									coverage_type: teamPoints.coverage_type[0].value[0],
									season: teamPoints.season[0].value[0],
									total: teamPoints.total[0]?.value ? teamPoints.total[0].value[0] : ''
								};
							}),
							team_standings: team.team_standings.map((standings: any) => {
								return {
									games_back: standings?.games_back ? standings.games_back[0].value[0] : 0,
									outcome_totals: standings.outcome_totals.map((totals: any) => {
										return {
											losses: totals.losses[0].value[0],
											percentage: totals?.percentage[0]?.value ? totals.percentage[0].value[0] : 0,
											ties: totals.ties[0].value[0],
											wins: totals.wins[0].value[0]
										};
									}),
									playoff_seed: standings?.playoff_seed ? standings.playoff_seed[0].value[0] : 0,
									rank: standings?.rank[0]?.value ? standings.rank[0].value[0] : 0
								};
							}),
							team_stats: team.team_stats.map((stats: any) => {
								return {
									coverage_type: stats.coverage_type[0].value[0],
									season: stats.season[0].value[0],
									stats: stats.stats[0].stat.map((stat: any) => {
										return {
											stat_id: stat.stat_id[0].value[0],
											value: stat.value[0]?.value ? stat.value[0]?.value[0] : 0
										};
									})
								};
							}),
							url: team.url[0].value[0],
							waiver_priority: team.waiver_priority[0]?.value ? team.waiver_priority[0].value[0] : 0
						};

						if (teamData.is_owned_by_current_login) {
							setCurrentTeam(teamData);
						}

						return teamData;
					});
				
				leagueStandings.teams = leagueTeams;
				setLeagueTeamStandings(leagueStandings);
			}
		};
		fetchTeams();
	}, [
		accessToken,
		corsAnywhere,
		league
	]);
	
	const handleClickedTeam = async (e: React.MouseEvent<HTMLAnchorElement>, team: Team, rowIndex: number) => {
		e.preventDefault();

		if (team === selectedTeam) {
			return;
		}

		setSelectedTeam(team);
	};
	const columns:TableColumn<Team>[] = [
		{
			displayData: (team: Team) => {
				const teamRank = team.team_standings[0].rank;
				const rankAward = teamRank === 1
					? `\u{1F3C6}`
					: teamRank === 2
						? `\u{1F948}`
						: teamRank === 3
							? `\u{1F949}`
							: ``;
				return `${teamRank} ${rankAward}`;
			},
			header: `Placed`,
			style: (team: Team) => {
				const selectedTeamCellStyle = team === selectedTeam ? `bg-blue-100 border-2` : ``;
				return `text-center ${selectedTeamCellStyle}`;
			}
		},
		{
			displayData: (team: Team) => {
				const finalPlacing = team.team_standings[0].playoff_seed > 0 ? team.team_standings[0].playoff_seed : `-`;
				return `${finalPlacing}`;
			},
			header: `Seed`,
			style: (team: Team) => {
				const selectedTeamCellStyle = team === selectedTeam ? `bg-blue-100 border-2` : ``;
				return `text-center ${selectedTeamCellStyle}`;
			}
		},
		{
			displayData: (team: Team) => `${team.name}`,
			header: `Team Name`,
			style: (team: Team) => {
				const selectedTeamCellStyle = team === selectedTeam ? `bg-blue-100 border-2` : ``;
				return `text-center ${selectedTeamCellStyle}`;
			}
		}
	];

	return (
		<>
			{currentTeam
				&& leagueTeamStandings
				&& <>
					<span>---</span>
					<br />
					<strong>Standings:</strong>
					<br />
					<DataTable columns={columns} data={leagueTeamStandings.teams} name="standingsTable" onRowClick={handleClickedTeam} />
				</>
			}
			{selectedTeam
				&& <Matchups league={league} team={selectedTeam} />
			}
		</>
	);
};

export default Standings;
