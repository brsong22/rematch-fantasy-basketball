interface Stat {
    stat_id: string;
    value: string;
}

export interface Team {
    clinched_playoffs: boolean;
    draft_position: number;
    has_draft_grade: boolean;
    is_owned_by_current_login: boolean;
    league_scoring_type: string;
    managers: [
        {
            manager_id: number;
            nickname: string;
            guid: string;
            is_current_login: boolean;
            image_url: string;
            felo_score: string;
            felo_tier: string;
        }
    ];
    name: string;
    number_of_moves: number;
    number_of_trades: number;
    roster_adds: [
        {
            coverageType: string;
            coverageValue: number;
            value: string;
        }
    ];
    team_id: number;
    team_key: string;
    team_logos: [
        {
            team_logo: {
                size: string;
                url: string;
            }
        }
    ];
    team_points: [
        {
            coverage_type: string;
            season: number;
            total: string;
        }
    ];
    team_standings: [
        {
            games_back: number;
            outcome_totals: [
                {
                    losses: number;
                    percentage: number;
                    ties: number;
                    wins: number;
                }
            ];
            playoff_seed: number;
            rank: number;
        }
    ];
    team_stats: [
        {
            coverage_type: string;
            season: number;
            stats: Array<Stat>;
        }
    ];
    url: string;
    waiver_priority: number;
}