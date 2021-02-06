import React from 'react';
import { useTable, usePagination, useSortBy } from 'react-table'

const Table = ({ data, fetchData, loading, pageCount: controlledPageCount }) => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Company Info',
                columns: [
                    {
                        Header: 'Company Name',
                        accessor: 'company',
                    },
                    {
                        Header: 'Billing Plan',
                        accessor: 'plan',
                    },
                    {
                        Header: 'Billing Status',
                        accessor: 'status',
                    },
                    {
                        Header: 'Active Until',
                        accessor: 'activeUntil',
                        Cell: (props) => {
                            const custom_date = formatData(props.value)
                            return <span>{custom_date}</span>
                        }
                    },
                    {
                        Header: 'Configurations',
                        accessor: 'configurations',
                    },
                    {
                        Header: 'Total Projects',
                        accessor: 'projects',
                    },
                    {
                        Header: 'Total Notes',
                        accessor: 'notes',
                    },
                    {
                        Header: 'Total Users',
                        accessor: 'userCount',
                    },
                    {
                        Header: 'Last Project Created On',
                        accessor: 'lastProject',
                    },
                ],
            },
        ],
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // Get the state from the instance
        state: { pageIndex, pageSize },
    } = useTable({
        initialState: { pageIndex: 0 }, // Pass our hoisted table state
        manualPagination: true, // Tell the usePagination
        // hook that we'll handle our own data fetching
        // This means we'll also have to provide our own
        // pageCount.
        pageCount: controlledPageCount,
        columns,
        data
    },
        useSortBy,
        usePagination,
    );

    React.useEffect(() => {
        fetchData({ pageIndex, pageSize })
    }, [fetchData, pageIndex, pageSize])

    const formatData = (date) => {
        date = date.split('T');
        return (new Date(Date.parse(date)).toString()).replace(/ \w+-\d+ \(.*\)$/, "")
    }
    // Render the UI for your table
    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' ▼'
                                                : ' ▲'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>

        </>
    );
}



export default Table;
