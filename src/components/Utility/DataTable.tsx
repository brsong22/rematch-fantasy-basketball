import { FunctionComponent, useMemo } from 'react';

interface TableProps {
	columns: Column[],
	data: any[],
	onRowClick?: (row: any) => void,
}

interface Column {
	bodyElement: (data) => JSX.Element,
	headElement: JSX.Element,
	styleElement: (data) => JSX.Element,
	width?: string
}

const DataTable: FunctionComponent<TableProps> = ({ tableProps, name }) => {
	const {
		columns,
		data,
		onRowClick
	} = tableProps

	return (
		<table>
			<colgroup>
				{columns.map((column, index) => {
					return column.width ? <col key={`colgroup-${index}`} width={column.width} /> : <col key={`colgroup-${index}`} />
				})}
			</colgroup>
			<thead>	
				<tr key={`${name}-tableHeaderRow`}>
						{columns.map((column, index) => (
							<th className={column.style} key={`${name}-headerRow-cell-${index}`}>{column.headElement}</th>
						))}
				</tr>
			</thead>
			<tbody>
				{data.length > 0 && data.map((currentValue, index) => (
					<tr onClick={(e) => onRowClick(e, currentValue, index)} key={`${name}-${index}-row`}>
						{columns.map((column, i) => (
							<td className={column.styleElement(currentValue)} key={`${name}-${index}-cell-${i}`}>{column.bodyElement(currentValue)}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default DataTable
