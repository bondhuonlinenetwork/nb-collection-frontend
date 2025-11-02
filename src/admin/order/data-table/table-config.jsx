import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
const api = axios.create({
    baseURL: "http://localhost:8080/", // change to your backend URL
    headers: {
        "Content-Type": "application/json"
    }
});
export const fetchedData = () => api.get("/orders");

export const tableHeaders = [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'date', label: 'Order Date', sortable: true, type: 'date' },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    // { key: 'address', label: 'Address', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'postalCode', label: 'Postal Code', sortable: true },
    { key: 'paymentType', label: 'Payment Type', sortable: true },
    { key: 'paymentMethod', label: 'Payment Method', sortable: true },
    { key: 'transactionId', label: 'Transaction Id', sortable: true },
    { key: 'subtotalAmount', label: 'Sub Total', sortable: true },
    { key: 'shippingAmount', label: 'Shipping', sortable: true },
    { key: 'totalAmount', label: 'Total Amount', sortable: true },
    { key: 'orderState', label: 'Order Status', sortable: true },
];
export const enableRowSelection = false;
export const defaultSort = { key: 'date', direction: 'desc' };

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500, 1000];

export const inputFieldsConfig = [
    //  { key: 'birthdateStart', type: 'date', label: 'birthdate start:', initial: '', filter: { key: 'birthdate', op: 'gte', type: 'date' } },
    // { key: 'birthdateEnd', type: 'date', label: 'birthdate end:', initial: '', filter: { key: 'birthdate', op: 'lte', type: 'date' } },
    // { key: 'registeredAtStart', type: 'date', label: 'registeredAt Start:', initial: '', filter: { key: 'registeredAt', op: 'gte', type: 'date' } },
    // { key: 'registeredAtEnd', type: 'date', label: 'registeredAt end:', initial: '', filter: { key: 'registeredAt', op: 'lte', type: 'date' } },
    // { key: 'salaryStart', type: 'number', label: 'Salary start:', initial: '', filter: { key: 'salary', op: 'gte', type: 'number' } },
    // { key: 'salaryEnd', type: 'number', label: 'Salary end:', initial: '', filter: { key: 'salary', op: 'lte', type: 'number' } },
    { key: 'searchInput', type: 'text', label: 'Search:', initial: '', filter: { key: ['id', 'phone', 'name'], op: 'search', type: 'string' } },
    { key: 'pageSizeSelect', type: 'select', label: 'Rows per page:', initial: PAGE_SIZE_OPTIONS[1], options: PAGE_SIZE_OPTIONS },
];
export const getRowActions = (rest) => [
    {
        label: "Edit",
        icon: <FaEdit />,
        color: "blue",
        onClick: (row) => {
            rest.setUpdateOrder?.(true);
            rest.setUpdateOrderData?.(row);
            rest.setUpdateOrderId?.(row.id);
        },
    },
    // {
    //     label: "Delete",
    //     icon: <FaTrash />,
    //     color: "red",
    //     onClick: (row) => {
    //         rest.setDeleteCategory?.(true);
    //         rest.setDeleteCategoryId?.(row.id);
    //     },
    // },
];
export const formatDate = (value) => {
    if (!value) return "---";
    const date = new Date(value);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }); // ✅ short month name
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Convert to 12-hour format with AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;

    return `${day}-${month}-${year} ${formattedHour}:${minutes} ${ampm}`;

    // return `${day}-${month}-${year}`; // e.g. 27-Sep-2025
};
