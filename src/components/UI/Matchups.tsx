import { useSession } from 'next-auth/react';
import React, {
	FunctionComponent,
	useEffect,
	useState
} from 'react';
import { xml2js } from 'xml-js';

import MatchupTotals from './MatchupTotals';
import { League } from '../Models/League';
import { Matchup } from '../Models/Matchup';
import { Team } from '../Models/Team';
import {
	DataTable,
	TableColumn
} from '../Utility/DataTable';

type MatchupsPropTypes = {
    league: League;
    team: Team;
}

const Matchups: FunctionComponent<MatchupsPropTypes> = ({
    team,
    league
}) => {
    const { data: session } = useSession();
    const accessToken = session?.token?.accessToken;
    
    const [ matchups, setMatchups ] = useState<Array<Matchup> | undefined>(undefined);
    const [ selectedMatchup, setSelectedMatchup ] = useState<Matchup | undefined>(undefined);

    const weeks = Array.from({ length: parseInt(league.end_week, 10) }, (_, i) => i + 1).join(',');

    const corsAnywhere = process.env.NEXT_PUBLIC_LOCAL_DEV ? process.env.NEXT_PUBLIC_CORS_ANYWHERE : ``;
    
    useEffect(() => {
        const fetchMatchups = async () => {
            /**
             * TODO
             * show all matchups for a given week
             * implement a week selector and update the scoreboard to show that week's matchups
             * this will allow additional views if user is more interested in seeing all matchups for a given week rather than all of a specific team's matchups
             */
            // const weeklyMatchupUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/league/${league.league_key}/scoreboard;week=${selectedWeek}`
            const matchupsUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/team/${team.team_key}/matchups;weeks=${weeks}`;

            const matchupsResponse = await fetch(matchupsUrl, { headers: { Authorization: `Bearer ${accessToken}` } });

            if (matchupsResponse.ok) {
                const teamMatchupsResponseString = await matchupsResponse.text();
                const teamMatchupsData: any = xml2js(teamMatchupsResponseString, {
                    alwaysArray: true,
                    compact: true,
                    ignoreAttributes: true,
                    ignoreComment: true,
                    ignoreDeclaration: true,
                    ignoreInstruction: true,
                    nativeType: true,
                    textKey: 'value'
                });
                
                const matchupsData: Array<Matchup> = teamMatchupsData.fantasy_content[0].team[0].matchups[0].matchup.map((match: any) => {
                    return {
                        is_consolation: match.is_consolation[0].value[0],
                        is_playoffs: match.is_playoffs[0].value[0],
                        is_tied: match?.is_tied ? match.is_tied[0].value[0] : 0,
                        stat_winners: match.stat_winners[0].stat_winner.map((stat: any) => {
                            const tiedStat = stat?.is_tied ? 1 : 0;
                            return {
                                is_tied: tiedStat,
                                stat_id: stat.stat_id[0].value[0],
                                winner_team_key: tiedStat ? `` : stat.winner_team_key[0].value[0]
                            };
                        }),
                        status: match.status[0].value[0],
                        teams: match.teams[0].team.map((team: any) => {
                            return {
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
                                url: team.url[0].value[0],
                                waiver_priority: team.waiver_priority[0]?.value ? team.waiver_priority[0].value[0] : 0
                            };
                        }),
                        week: match.week[0].value[0],
                        week_end: match.week_end[0].value[0],
                        week_start: match.week_start[0].value[0],
                        winner_team_key: match?.is_tied
                            ? match.is_tied[0].value[0] ? `` : match.winner_team_key[0].value[0]
                            : ``
                    };
                });

                setMatchups(matchupsData);
            }
        };
        fetchMatchups();
    }, [
        accessToken,
        corsAnywhere,
        team,
        weeks
    ]);

    const handleClickedMatchup = async (e: React.MouseEvent<HTMLAnchorElement>, matchup: Matchup, rowIndex: number) => {
        e.preventDefault();

        if (matchup === selectedMatchup) {
			return;
        }

		setSelectedMatchup(matchup);
    };
    
    const columns:TableColumn<Matchup>[] = [
        {
            displayData: (matchup: Matchup) => {
                const isPlayoffWeek = matchup.is_playoffs ? `*` : ``;
                return `${matchup.week}${isPlayoffWeek}`;
            },
            header: `Week`,
            style: (matchup: Matchup) => {
                const cellStyle = (team.team_key === matchup.winner_team_key)
                    ? `bg-green-50`
                    : matchup.is_tied
                        ? `bg-yellow-50 text-gray-400`
                        : `bg-gray-50 text-gray-400`;
                const playoffsCellStyle = matchup.is_playoffs ? `border-purple-600 border-b-2 border-l-2 border-t-2` : ``;
                const selectedMatchupCellStyle = matchup === selectedMatchup ? `bg-green-200 border-2` : ``;

                return `${cellStyle} ${playoffsCellStyle} ${selectedMatchupCellStyle}`;
            }
        },
        {
            displayData: (matchup: Matchup) => {
                const team1 = matchup.teams.find((t: Team) => t.team_key === team.team_key);
                const team2 = matchup.teams.find((t: Team) => t.team_key !== team.team_key);

                const {
                    team1Wins,
                    team2Wins
                } = matchup.stat_winners.reduce(({
                    team1Wins,
                    team2Wins
                }, stat) => ({
                    team1Wins: team1Wins + (stat.winner_team_key === team1?.team_key ? 1 : 0),
                    team2Wins: team2Wins + (stat.winner_team_key === team2?.team_key ? 1 : 0)
                }), {
                    team1Wins: 0,
                    team2Wins: 0
                });
                
                return `${team1?.name} ${team1Wins} | ${team2Wins} ${team2?.name}`;
            },
            header: `Result`,
            style: (matchup: Matchup) => {
                const cellStyle = (team.team_key === matchup.winner_team_key)
                    ? `bg-green-50`
                    : matchup.is_tied
                        ? `bg-yellow-50 text-gray-400`
                        : `bg-gray-50 text-gray-400`;
                const playoffsCellStyle = matchup.is_playoffs ? `border-purple-600 border-b-2 border-r-2 border-t-2` : ``;
                const selectedMatchupCellStyle = matchup === selectedMatchup ? `bg-green-200 border-2` : ``;

                return `${cellStyle} ${playoffsCellStyle} ${selectedMatchupCellStyle}`;
            }
        }
    ];

    return (
		<>
            {team
                && matchups
                && <>
			        <span>---</span>
                    <br />
                    <strong>Matchups:</strong>
			        <br />
                    <DataTable columns={columns} data={matchups} name="matchupsTable" onRowClick={handleClickedMatchup} />
                    <br />
                </>
            }
            {selectedMatchup
                && <MatchupTotals league={league} matchup={selectedMatchup} />
			}
		</>
	);
};

export default Matchups;
