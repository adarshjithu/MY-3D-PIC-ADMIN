import { useState, useEffect } from "react";

import { Pencil, Trash } from "lucide-react";
import { useGetUsers, userUserDelete, useToggleBlockStatus, useToggleStatus } from "../hooks/useUsers";
import Breadcrumb from "../components/brudcrump/Breadcrumb";
import SearchBox from "../components/ui/SearchBox";
import TableLoading from "../components/ui/table/TableLoading";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import Switch from "../components/ui/switch/Switch";
import Pagination from "../components/ui/pagination/Pagination";
import DeleteModal from "../components/ui/modals/common/DeleteModal";


const columns = [
    { key: "image", label: "Image" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    { key: "country", label: "Country" },
    { key: "role", label: "Role" },
    { key: "createdAt", label: "Created At" },
    { key: "isActive", label: "Active" },
    { key: "isBlocked", label: "Blocked" },
    { key: "actions", label: "Actions" },
];

export default function Users() {
    // Static UI state only
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [blockedFilter, setBlockedFilter] = useState("");
    const [sortKey, setSortKey] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUserId, setSelectedUserId] = useState('');

    const params = {
        search:debouncedSearch,
        status: statusFilter,
        blocked: blockedFilter,
        sortKey,
        sortOrder,
        limit,
        page,
    };

    const { isLoading, data } = useGetUsers(params);
    const toggleMutation = useToggleStatus();
    const toggleBlockMutation = useToggleBlockStatus();
    const deleteUserData =  userUserDelete()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (data?.data?.totalPages) {
            setTotalPages(data.data.totalPages);
        }
    }, [data?.data?.totalPages]);

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-4">
                    <Breadcrumb
                        elements={[
                            { page: "Home", path: "/" },
                            { page: "Users", path: "/users" },
                        ]}
                    />
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <SearchBox
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onDebouncedChange={setDebouncedSearch}
                            placeholder="Search users..."
                        />
                        <div className="flex gap-2 items-center">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border rounded px-2 py-2 bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                            >
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select
                                value={blockedFilter}
                                onChange={(e) => setBlockedFilter(e.target.value)}
                                className="border rounded px-2 py-2 bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                            >
                                <option value="">All Users</option>
                                <option value="blocked">Blocked</option>
                                <option value="unblocked">Unblocked</option>
                            </select>
                            <select
                                value={sortKey}
                                onChange={(e) => setSortKey(e.target.value)}
                                className="border rounded px-2 py-2 bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                            >
                                <option value="firstName">Name</option>
                                <option value="createdAt">Date</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                                className="border rounded px-2 py-2 flex items-center bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                                title={sortOrder === "asc" ? "Ascending" : "Descending"}
                            >
                                {sortOrder === "asc" ? "▲" : "▼"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-full overflow-x-auto">
                    {isLoading ? (
                        <TableLoading />
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={String(col.key)}
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none"
                                        >
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {data?.data?.users?.map((data: any) => (
                                    <TableRow key={String(data?._id)}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <img src={String(data.image)} alt="user" className="w-10 h-10 rounded-full object-cover" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                            {String(data.firstName)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                            {String(data.lastName)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {String(data.email)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {String(data.phoneNumber)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {String(data.country)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {String(data.role)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {new Date(data.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    
                                                    checked={data.isActive}
                                                    onChange={(checked) => {toggleMutation.mutate(data?._id)}}
                                                    size="sm"
                                                    color="success"
                                                />
                                                <span>{data.isActive ? "Active" : "Inactive"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={!data.isBlocked}
                                                    onChange={(checked) => toggleBlockMutation.mutate(data?._id)}
                                                    size="sm"
                                                    color="error"
                                                />
                                                <span>{data.isBlocked ? "Blocked" : "Unblocked"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-3">
                                                <button className="text-blue-500 hover:text-blue-700">
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUserId(data?._id);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
            {deleteModalOpen && (
                <DeleteModal
                    handleDelete={(arg: boolean) => {
                        if (arg) {
                          deleteUserData.mutate(selectedUserId);
                          setDeleteModalOpen(false)
                        } else {
                            setDeleteModalOpen(false);
                        }
                    }}
                    isOpen={deleteModalOpen}
                    type={"User"}
                />
            )}
        </div>
    );
}
