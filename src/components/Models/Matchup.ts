import { Team } from './Team';

export interface Matchup {
    is_consolation: boolean;
    is_playoffs: boolean;
    is_tied: boolean;
    stat_winners: [
        {
            stat_id: number;
            winner_team_key: string;
        }
    ];
    status: string;
    teams: Array<Team>;
    week: number;
    week_end: string;
    week_start: string;
    winner_team_key: string;
}