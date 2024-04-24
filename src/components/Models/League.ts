import { Standings } from './Standings';

export interface League {
    current_week: number;
    draft_status: string;
    edit_key: string;
    end_date: string;
    end_week: string;
    game_code: string;
    is_finished: boolean;
    league_id: string;
    league_key: string;
    league_update_timestamp: string;
    name: string;
    num_teams: number;
    scoring_type: string;
    season: string;
    start_date: string;
    start_week: string;
    url: string;
    standings: Standings;
};