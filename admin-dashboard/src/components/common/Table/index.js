import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ columns, data, isLoading, className }) => {
    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-10 bg-gray-200 mb-4"></div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 mb-2"></div>
                ))}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={row._id || rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={`${rowIndex}-${colIndex}`}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {column.cell ? column.cell(row) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
            cell: PropTypes.func,
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
};

Table.defaultProps = {
    isLoading: false,
    className: '',
};

export default Table; 