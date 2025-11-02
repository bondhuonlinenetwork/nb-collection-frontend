import { useState } from 'react';
import { useEffect } from 'react';
import './table.css';
import { getRowActions, fetchedData, tableHeaders, inputFieldsConfig, enableRowSelection, formatDate } from './table-config';

const initialInputState = inputFieldsConfig.reduce((acc, field) => {
    acc[field.key] = field.initial;
    return acc;
}, {});

function Table({ ...rest }) {
    const rowActions = getRowActions(rest);
    const [inputs, setInputs] = useState(initialInputState);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("Table props:", rest.refresh);
    useEffect(() => {
        fetchedData()
            .then((res) => {
                console.log("Fetched users:", res.data);
                setData(res.data);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
            })
            .finally(() => setLoading(false)); // ✅ stop loading
    }, [rest.refresh]);
    const handleInputChange = (key, value) => {
        setInputs(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const inputFields = inputFieldsConfig.map(field => ({
        ...field,
        value: inputs[field.key],
        onChange: value => handleInputChange(field.key, value)
    }));

    const pageSize = inputs.pageSizeSelect;

    // Filtering logic driven by config
    const filteredData = data.filter(data =>
        inputFieldsConfig.every(field => {
            if (!field.filter) return true;
            const value = inputs[field.key];
            if (value === '' || value == null) return true;

            const { key: filterKey, op, type } = field.filter;

            if (op === 'search') {
                const search = value.trim().toLowerCase();
                return filterKey.some(k =>
                    (data[k] + '').toLowerCase().includes(search)
                );
            }

            let dataValue = data[filterKey];
            if (type === 'date') {
                dataValue = dataValue instanceof Date ? dataValue : new Date(dataValue);
                const filterDate = new Date(value);
                if (op === 'gte') return dataValue >= filterDate;
                if (op === 'lte') return dataValue <= filterDate;
            } else if (type === 'number') {
                dataValue = Number(dataValue);
                const filterNum = Number(value);
                if (op === 'gte') return dataValue >= filterNum;
                if (op === 'lte') return dataValue <= filterNum;
            }
            return true;
        })
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (typeof valA === 'string' && typeof valB === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const indexOfFirstItem = (currentPage - 1) * pageSize;
    const indexOfLastItem = Math.min(currentPage * pageSize, totalItems);
    const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getPageButtons = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 4) pages.push('prev-ellipsis');
            for (
                let i = Math.max(2, currentPage - 2);
                i <= Math.min(totalPages - 1, currentPage + 2);
                i++
            ) {
                pages.push(i);
            }
            if (currentPage < totalPages - 3) pages.push('next-ellipsis');
            pages.push(totalPages);
        }
        return pages;
    };
    // ✅ Toggle individual row selection
    const toggleRowSelection = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };
    useEffect(() => {
        console.log("Selected rows updated:", selectedRows);
    }, [selectedRows]);

    // ✅ Toggle all selection
    const toggleSelectAll = () => {
        if (selectedRows.length === currentData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(currentData.map(d => d.userId));
        }
    };
    const totalColumns =
        (enableRowSelection ? 1 : 0) + // selection checkbox
        tableHeaders.length +          // main headers
        (rowActions.length > 0 ? 1 : 0); // actions column
    const SkeletonRow = ({ columns }) => (
        <tr>
            {Array.from({ length: columns }).map((_, idx) => (
                <td key={idx}>
                    <div className="skeleton"></div>
                </td>
            ))}
        </tr>
    );
    return (
        <>
            <div className='table-container'>
                <div className='input-fields-container'>
                    {inputFields.map(field => (
                        <div className='input-field' key={field.key}>
                            {field.type === 'select' ? (
                                <>
                                    <select
                                        id={field.key}
                                        value={field.value}
                                        onChange={e => field.onChange(Number(e.target.value))}
                                    >
                                        {field.options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <label htmlFor={field.key}>{field.label}</label>
                                </>
                            ) : (
                                <>
                                    <input
                                        type={field.type}
                                        id={field.key}
                                        value={field.value}
                                        onChange={e => field.onChange(e.target.value)}
                                        spellCheck={field.type === 'text' ? 'false' : undefined}
                                    />
                                    <label htmlFor={field.key}>{field.label}</label>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className="table-wrapper">

                    <table>
                        <thead>
                            <tr>
                                {enableRowSelection && (
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.length === currentData.length && currentData.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                )}
                                {tableHeaders.map(header => (
                                    <th
                                        key={header.key}
                                        style={header.sortable ? { cursor: 'pointer' } : {}}
                                        onClick={header.sortable ? () => handleSort(header.key) : undefined}
                                    >
                                        {header.label}
                                        {header.sortable && sortConfig.key === header.key
                                            ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')
                                            : ''}
                                    </th>
                                ))}
                                {rowActions.length > 0 && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                // Show 5 skeleton rows while loading
                                [...Array(pageSize)].map((_, i) => (
                                    <SkeletonRow key={i} columns={totalColumns} />
                                ))
                            ) : (
                                currentData.map((data, idx) => (
                                    <tr key={data.userId || idx}>
                                        {enableRowSelection && (
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(data.userId)}
                                                    onChange={() => toggleRowSelection(data.userId)}
                                                />
                                            </td>
                                        )}
                                        {tableHeaders.map(header => (
                                            <td key={header.key}>
                                                {header.type === "date"
                                                    ? formatDate(data[header.key])
                                                    : data[header.key]?.toString() ?? "---"}
                                            </td>
                                        ))}
                                        {rowActions.length > 0 && (
                                            <td>
                                                {rowActions.map((action, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => action.onClick(data)}
                                                        className='action-button'
                                                        style={{
                                                            color: action.color || "inherit"
                                                        }}
                                                        title={action.label} // ✅ shows tooltip on hover
                                                    >
                                                        {action.icon} {/* ✅ show logo/icon instead of text */}
                                                    </button>
                                                ))}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Compact Pagination Controls */}
                <div className='pagination-wrapper'>
                    <div className='showing-info'>
                        Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalItems} items
                    </div>
                    <div className='selected-info'>
                        {selectedRows.length ? <span>{selectedRows.length} items selected</span> : ''}
                    </div>
                    <div className="page-buttons">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Prev
                        </button>
                        {getPageButtons().map((page, idx) =>
                            page === 'prev-ellipsis' || page === 'next-ellipsis' ? (
                                <span key={page + idx}>. . .</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        fontWeight: currentPage === page ? 'bold' : 'normal',
                                        textDecoration: currentPage === page ? 'underline' : 'none'
                                    }}
                                >
                                    {page}
                                </button>
                            )
                        )}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Table;