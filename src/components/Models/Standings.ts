import { Team } from './Team';

export interface Standings {
    teams: [{
        team: Array<Team>;
    }];
}