import { FunctionComponent } from 'react';

export interface TableColumn<T, K extends keyof T> {
	displayData: (data: T) => string,
	header: string,
	// key: K
	// style: string,
	// width?: string
}

export interface TableProps<T, K extends keyof T> {
	columns: TableColumn<T, K>[],
	data: T[],
	name: string
	onRowClick: (...args: any[]) => void | any,
}


export const DataTable = <T, K extends keyof T>({
	columns,
	data,
	name,
	onRowClick
}: TableProps<T, K>): JSX.Element => {

	return (
		<table>
			<colgroup>
				{columns.map((column, index) => {
					return <col key={`colgroup-${index}`} />;
				})}
			</colgroup>
			<thead>	
				<tr key={`${name}-tableHeaderRow`}>
						{columns.map((column, index) => (
							<th className={``} key={`${name}-headerRow-cell-${index}`}>{column.header}</th>
						))}
				</tr>
			</thead>
			<tbody>
				{data.length > 0 && data.map((currentValue, index) => (
					<tr onClick={(e) => onRowClick(e, currentValue, index)} key={`${name}-${index}-row`}>
						{columns.map((column, i) => (
							<td className={``/*column.styleElement(currentValue)*/} key={`${name}-${index}-cell-${i}`}>{`${column.displayData(currentValue)}`}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
