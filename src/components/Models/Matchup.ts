import { Team } from './Team';

export interface Matchup {
    teams: {
        0: Team,
        1: Team
    };
    week: number;
    week_start: string;
    week_end: string;
    status: string;
    is_playoffs: string;
    is_consolation: boolean;
    is_tied: boolean;
    winner_team_key: string;
    stat_winners: [{
        stat_winner: {
            stat_id: string;
            winner_team_key: string;
        }
    }];
}