import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import { Pencil, Trash } from "lucide-react";
import Breadcrumb from "../components/brudcrump/Breadcrumb";
import SearchBox from "../components/ui/SearchBox";
import TableLoading from "../components/ui/table/TableLoading";
import Pagination from "../components/ui/pagination/Pagination";
import Switch from "../components/ui/switch/Switch";
import DeleteModal from "../components/ui/modals/common/DeleteModal";
import PageTableHeading from "../components/common/PageTableHeading";

import { useDeleteCategory, useGetCategories, useUpdateCategory } from "../hooks/useCategories";
import AddCategoryModal from "../components/modals/AddCategoryModal";

const columns = [
    { key: "Index", label: "INDEX" },
    { key: "Name", label: "NAME" },
    { key: "Slug", label: "SLUG" },
    { key: "Description", label: "DESCRIPTION" },

    { key: "createdAt", label: "CREATED AT" },
    { key: "isActive", label: "ACTIVE" },
    { key: "actions", label: "ACTIONS" },
];

export default function Users() {
    // Static UI state only
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategoryId, setSelectedCateogoryId] = useState("");
    const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [editCategoryData, setEditCategoryData] = useState<any>(null);

    const params: any = {
        status: statusFilter,
        sortKey,
        sortOrder,
        limit,
        page,
    };
    debouncedSearch ? (params.search = debouncedSearch) : "";
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const { isLoading, data } = useGetCategories(params);
    const { mutate: deleteCategory } = useDeleteCategory();
    const { mutate: updateCategory } = useUpdateCategory();

    useEffect(() => {
        if (data?.data?.totalPages) {
            setTotalPages(data.data.totalPages);
        }
    }, [data?.data?.totalPages]);

    return (
        <div className="space-y-4">
            <Breadcrumb
                elements={[
                    { page: "Home", path: "/" },
                    { page: "Users", path: "/users" },
                ]}
            />
            <PageTableHeading
                path=""
                title="Categories"
                buttonText="Add Category"
                onClick={() => {
                    setAddCategoryModalOpen(true);
                    setEditCategoryData(null);
                }}
            />
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <SearchBox
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onDebouncedChange={setDebouncedSearch}
                            placeholder="Search categories..."
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
                                value={sortKey}
                                onChange={(e) => setSortKey(e.target.value)}
                                className="border rounded px-2 py-2 bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                            >
                                <option value="name">Name</option>
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
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-white"
                                        >
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {data?.data?.categories?.map((data: any, index: number) => (
                                    <TableRow key={String(data?._id)}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-800 dark:text-white/90">{index + 1}</TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-800 dark:text-white/90">{data?.name}</TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90">{data?.slug}</TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90">{data?.description}</TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {new Date(data.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={data.isActive}
                                                    onChange={(e) => {
                                                        updateCategory({ data: { isActive: e }, id: data?._id });
                                                    }}
                                                    size="sm"
                                                    color="success"
                                                />
                                                <span>{data.isActive ? "Active" : "Inactive"}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditCategoryData(data);
                                                        setAddCategoryModalOpen(true);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedCateogoryId(data?._id);
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
                <Pagination currentPage={page} totalPages={Math.ceil(data?.data?.totalPages / limit)} onPageChange={setPage} />
            </div>
            {deleteModalOpen && (
                <DeleteModal
                    handleDelete={(arg: boolean) => {
                        if (arg) {
                            deleteCategory(selectedCategoryId);
                            setDeleteModalOpen(false);
                        } else {
                            setDeleteModalOpen(false);
                        }
                    }}
                    isOpen={deleteModalOpen}
                    type={"User"}
                />
            )}
            {addCategoryModalOpen && <AddCategoryModal editCategoryData={editCategoryData} setAddCategoryModalOpen={setAddCategoryModalOpen} />}
        </div>
    );
}
