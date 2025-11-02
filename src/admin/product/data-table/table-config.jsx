import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
const api = axios.create({
    baseURL: "http://localhost:8080/", // change to your backend URL
    headers: {
        "Content-Type": "application/json"
    }
});
export const fetchedData = () => api.get("/products");

export const tableHeaders = [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'creation_date', label: 'Creation Date', sortable: true, type: 'date' },
    { key: 'name', label: 'name', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
];
export const enableRowSelection = false;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500, 1000];

export const inputFieldsConfig = [
    { key: 'pageSizeSelect', type: 'select', label: 'Rows per page:', initial: PAGE_SIZE_OPTIONS[1], options: PAGE_SIZE_OPTIONS },
];
export const getRowActions = (rest) => [
    {
        label: "Edit",
        icon: <FaEdit />,
        color: "blue",
        onClick: (row) => {
            rest.setUpdateProduct?.(true);
            rest.setUpdateProductData?.(row);
        },
    },
    {
        label: "Delete",
        icon: <FaTrash />,
        color: "red",
        onClick: (row) => {
            rest.setDeleteProduct?.(true);
            rest.setDeleteProductData?.(row);
        },
    },
];
export const formatDate = (value) => {
    if (!value) return "---";
    const date = new Date(value);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }); // ✅ short month name
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // e.g. 27-Sep-2025
};
