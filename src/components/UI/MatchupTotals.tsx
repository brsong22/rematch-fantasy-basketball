import { useSession } from 'next-auth/react';
import React, {
	FunctionComponent,
	useEffect,
	useState
} from 'react';
import { xml2js } from 'xml-js';

import LeagueStandings from './Standings';
import { League } from '../Models/League';
import { Matchup } from '../Models/Matchup';
import { Stat } from '../Models/Stat';
import { Team } from '../Models/Team';
import {
	DataTable,
	TableColumn
} from '../Utility/DataTable';

type MatchupTotalsPropTypes = {
    league: League;
    matchup: Matchup;
}

type MatchupStatTotal = {
    displayName: string;
    name: string;
    team1Total: string | number;
    team2Total: string | number;
    winningTeam: number;
}

const MatchupTotals: FunctionComponent<MatchupTotalsPropTypes> = ({
    league,
    matchup
}) => {
    const { data: session } = useSession();
    const accessToken = session?.token?.accessToken;

    const [ matchupStatTotals, setMatchupStatTotals ] = useState<Array<MatchupStatTotal> | undefined>(undefined);

    const corsAnywhere = process.env.NEXT_PUBLIC_LOCAL_DEV ? process.env.NEXT_PUBLIC_CORS_ANYWHERE : ``;

    useEffect(() => {
        const fetchWeeklyStatTotals = async () => {
            const team1WeeklyStatsUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/team/${matchup.teams[0].team_key}/stats;type=week;week=${matchup.week}`;
            const team2WeeklyStatsUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/team/${matchup.teams[1].team_key}/stats;type=week;week=${matchup.week}`;
            
            const teamWeeklyStatsPromises = [ team1WeeklyStatsUrl, team2WeeklyStatsUrl ].map((url) => fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } }));
            Promise.all(teamWeeklyStatsPromises)
                .then(responses => Promise.all(responses.map(response => response.text())))
                .then((data) => {
                    const team1WeekMatchupData: any = xml2js(data[0], {
                        alwaysArray: true,
                        compact: true,
                        ignoreAttributes: true,
                        ignoreComment: true,
                        ignoreDeclaration: true,
                        ignoreInstruction: true,
                        nativeType: true,
                        textKey: 'value'
                    });
                    const team1WeekStatTotals = team1WeekMatchupData.fantasy_content[0].team[0].team_stats[0].stats[0].stat;
                    const team2WeekMatchupData: any = xml2js(data[1], {
                        alwaysArray: true,
                        compact: true,
                        ignoreAttributes: true,
                        ignoreComment: true,
                        ignoreDeclaration: true,
                        ignoreInstruction: true,
                        nativeType: true,
                        textKey: 'value'
                    });
                    const team2WeekStatTotals = team2WeekMatchupData.fantasy_content[0].team[0].team_stats[0].stats[0].stat;
                    const teamsWeeklyMatchupStatTotals = league.stat_categories.map((category: Stat, index: number) => {
                        const categoryMatchup = matchup.stat_winners.find((stat) => stat.stat_id === category.stat_id);
                        const categoryWinner = categoryMatchup?.winner_team_key;
                        const winningTeam = categoryWinner
                            ? (categoryWinner === matchup.teams[0].team_key)
                                ? 1
                                : 2
                            : 0;
                        return {
                            displayName: category.display_name,
                            name: category.name,
                            team1Total: team1WeekStatTotals[index].value[0].value[0],
                            team2Total: team2WeekStatTotals[index].value[0].value[0],
                            winningTeam: winningTeam
                        };
                    });
                    setMatchupStatTotals(teamsWeeklyMatchupStatTotals);
                });
        };
        fetchWeeklyStatTotals();
    }, [
        accessToken,
        corsAnywhere,
        league.stat_categories,
        matchup.stat_winners,
        matchup.teams,
        matchup.week,
        matchup.winner_team_key
    ]);

    const handleClickedTeam = async (e: React.MouseEvent<HTMLAnchorElement>, matchup: Matchup, rowIndex: number) => {
        e.preventDefault();
		
        return;
    };
    
    const columns:TableColumn<MatchupStatTotal>[] = [
        {
            displayData: (category: MatchupStatTotal) => {
                return `${category.displayName}`;
            },
            header: `Category`,
            style: (category: MatchupStatTotal) => `font-bold`
        },
        {
            displayData: (category: MatchupStatTotal) => `${category.team1Total}`,
            header: `${matchup.teams[0].name}`,
            style: (category: MatchupStatTotal) => {
                const cellStyle = (category.winningTeam === 1)
                    ? `bg-green-100`
                    : ``;

                return `${cellStyle}`;
            }
        },
        {
            displayData: (category: MatchupStatTotal) => `${category.team2Total}`,
            header: `${matchup.teams[1].name}`,
            style: (category: MatchupStatTotal) => {
                const cellStyle = (category.winningTeam === 2)
                    ? `bg-green-100`
                    : ``;

                return `${cellStyle}`;
            }
        }
    ];

    return (
		<>
            {matchupStatTotals
                && <>
			        <span>---</span>
                    <br />
                    <strong>Totals:</strong>
			        <br />
                    <DataTable columns={columns} data={matchupStatTotals} name="matchupsTable" onRowClick={handleClickedTeam} />
                    <br />
                </>
            }
		</>
	);
};

export default MatchupTotals;
