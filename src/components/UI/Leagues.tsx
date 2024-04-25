import { useSession } from 'next-auth/react';
import React, {
	FunctionComponent,
	useEffect,
	useState
} from 'react';
import { xml2js } from 'xml-js';

import Standings from './Standings';
import { League } from '../Models/League';
import {
	DataTable,
	TableColumn
} from '../Utility/DataTable';

const Leagues: FunctionComponent = () => {
	const [ leagues, setLeagues ] = useState<League[]>([]);
	const [ selectedLeague, setSelectedLeague ] = useState<League | undefined>(undefined);
	const [ userGuid, setUserGuid ] = useState<string>('');

	const { data: session } = useSession();
	const accessToken = session?.token?.accessToken;

	// https://cors-anywhere.herokuapp.com/corsdemo to enable corsanywhere
	const corsAnywhere = process.env.NEXT_PUBLIC_LOCAL_DEV ? process.env.NEXT_PUBLIC_CORS_ANYWHERE : ``;

	useEffect(() => {
		const fetchLeagues = async () => {
			const gamesUrl = `${corsAnywhere}https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_codes=nba/leagues`;

			const gamesResponse = await fetch(gamesUrl, { headers: { Authorization: `Bearer ${accessToken}` } });

			if (gamesResponse.ok) {
				const gamesResponseString = await gamesResponse.text();
				const gamesData: any = xml2js(gamesResponseString, {
					alwaysArray: true,
					compact: true,
					ignoreAttributes: true,
					ignoreComment: true,
					ignoreDeclaration: true,
					ignoreInstruction: true,
					nativeType: true,
					textKey: 'value'
				});
				const userGuid = gamesData.fantasy_content[0].users[0].user[0].guid[0].value[0];
				setUserGuid(userGuid);

				const games: Array<any> = gamesData.fantasy_content[0].users[0].user[0].games[0].game;
				
				const leaguesArray: Array<League> = games
					.map(game => game.leagues[0].league)
					.flatMap((league) => {
						return league.map((league: any) => {
							return {
								current_week: league.current_week[0].value[0],
								draft_status: league.draft_status[0].value[0],
								edit_key: league.edit_key[0].value[0],
								end_date: league.end_date[0].value[0],
								end_week: league.end_week[0].value[0],
								game_code: league.game_code[0].value[0],
								is_finished: league?.is_finished ? league.is_finished[0].value[0] : 1,
								league_id: league.league_id[0].value[0],
								league_key: league.league_key[0].value[0],
								league_update_timestamp: league?.league_update_timestamp?.value ? league.league_update_timestamp[0].value[0] : '',
								name: league.name[0].value[0],
								num_teams: league.num_teams[0].value[0],
								scoring_type: league.scoring_type[0].value[0],
								season: league.season[0].value[0],
								start_date: league.start_date[0].value[0],
								start_week: league.start_week[0].value[0],
								url: league.url[0].value[0]
							};
						});
					});
				setLeagues(leaguesArray);
			}
		};

		fetchLeagues();
	}, [
		accessToken,
		corsAnywhere
	]);

	const handleClickedLeague = async (e: React.MouseEvent<HTMLAnchorElement>, league: League, rowIndex: number) => {
		e.preventDefault();

		if (league.league_key === selectedLeague?.league_key) {
			return;
		}

		setSelectedLeague(league);
	};

	const columns: TableColumn<League, keyof League>[] = [
		{
			displayData: (league: League) => (`${league.season}`),
			header: `Year`
		},
		{
			displayData: (league: League) => (`${league.name}`),
			header: `League Name`
		}
	];

	return (
		<>
			<br />
			<span>
				<strong>{`${session?.user?.name}'s Leagues: `}</strong>
			</span>
			<div>
				<DataTable columns={columns} data={leagues} name="leaguesTable" onRowClick={handleClickedLeague} />
			</div>
			{selectedLeague
				&& <Standings league={selectedLeague} userGuid={userGuid} />
			}
		</>
	);
};

export default Leagues;
