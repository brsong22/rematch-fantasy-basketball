import { FunctionComponent } from 'react';

export interface TableColumn<T> {
	displayData: (data: T) => string,
	header: string,
	style: (data: T) => string
}

export interface TableProps<T> {
	columns: TableColumn<T>[],
	data: T[],
	name: string
	onRowClick: (...args: any[]) => void | any,
}


export const DataTable = <T, K extends keyof T>({
	columns,
	data,
	name,
	onRowClick
}: TableProps<T>): JSX.Element => {

	return (
		<table className="table-auto">
			<colgroup>
				{columns.map((column, index) => {
					return <col key={`colgroup-${index}`} />;
				})}
			</colgroup>
			<thead>	
				<tr key={`${name}-tableHeaderRow`}>
						{columns.map((column, index) => (
							<th className={`bg-gray-200 border border-black px-2 text-left w-auto`} key={`${name}-headerRow-cell-${index}`}>{column.header}</th>
						))}
				</tr>
			</thead>
			<tbody>
				{data.length > 0 && data.map((currentValue, index) => (
					<tr className={ `group even:bg-gray-100 hover:!bg-gray-300 hover:cursor-pointer`} onClick={(e) => onRowClick(e, currentValue, index)} key={`${name}-${index}-row`}>
						{columns.map((column, i) => (
							<td className={`border border-black px-2 w-auto ${column.style(currentValue)}`} key={`${name}-${index}-cell-${i}`}>{`${column.displayData(currentValue)}`}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
