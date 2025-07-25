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
import { useDeleteBaseProduct, useGetBaseProducts, useUpdateBaseProduct } from "../hooks/useBaseProducts";
import AddProductModal from "../components/modals/AddProductModal";
import SizeSelectionModal from "../components/product/SizeSelectionModal";


const columns = [
    { key: "Index", label: "INDEX" },
    { key: "Name", label: "NAME" },
    { key: "Thumbnail", label: "THUMBNAIL" },
    { key: "Images", label: "IMAGES" },
    { key: "Baseprice", label: "PRICE" },
    { key: "Inventory", label: "INVENTORY" },
    { key: "Size", label: "SIZE" },

    { key: "createdAt", label: "CREATED AT" },
    { key: "isActive", label: "ACTIVE" },
    { key: "actions", label: "ACTIONS" },
];

export default function Base() {
    // Static UI state only
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBaseProductId, setSelectedBaseProductId] = useState("");
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editProductData, setEditProductData] = useState<any>(null);
    const [isEditModalOpen,setIsEditModalOpen] = useState(false);
    

    const params: any = {
        status: statusFilter,
        sortKey,
        sortOrder,
        limit,
        page,
    };
    debouncedSearch ? (params.search = debouncedSearch) : "";
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
        
        const { isLoading, data } = useGetBaseProducts(params);
        const {mutate:deleteBaseProduct} = useDeleteBaseProduct();
        const {mutate:updateBaseProduct} = useUpdateBaseProduct();

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
                    { page: "Products", path: "/products" },
                ]}
            />
            <PageTableHeading
                title="Products"
                buttonText="Add Product"
                path=""
                onClick={() => {
                    setIsProductModalOpen(true);
                    setEditProductData(null);
                }}
            />
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <SearchBox
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onDebouncedChange={setDebouncedSearch}
                            placeholder="Search products..."
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
                                {[].map((data: any, index: number) => (
                                    <TableRow key={String(data?._id)}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-800 dark:text-white/90">{index + 1 }</TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-800 dark:text-white/90">{data?.name}</TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-800 dark:text-white/90"><img className="w-10 h-10 object-cover rounded-full" src={data?.thumbnail} alt="" /></TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-800 dark:text-white/90">
                                      { data?.images?.length > 0 ? <div className="flex flex-wrap gap-2">
                                            {data?.images?.map((img:any,index:number)=>(
                                                <img key={index} className="w-10 h-10 object-cover rounded-full" src={img} alt="" />
                                            ))}
                                        </div>:"------"}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90">
                                             {data?.price?.basePrice}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90">
                                            {data?.inventory?.quantity}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90">
                                        <div className="flex flex-col">
                                            <span>W : {data?.size?.width}</span>
                                            <span>L : {data?.size?.length}</span>
                                            <span>H : {data?.size?.height}</span>
                                        </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {new Date(data.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={data.isActive}
                                                    onChange={(e) => {
                                                        ({ data: { isActive: e }, id: data?._id });
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
                                                        setEditProductData(data);
                                                        setIsProductModalOpen(true);
                                                    }}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                                setSelectedBaseProductId(data?._id);
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
                            deleteBaseProduct(selectedBaseProductId);                            
                            setDeleteModalOpen(false);
                        } else {
                            setDeleteModalOpen(false);
                        }
                    }}
                    isOpen={deleteModalOpen}
                    type={"User"}
                />
            )}
            {isProductModalOpen && <AddProductModal  setIsOpen={setIsProductModalOpen} editProductData={editProductData} />}
        </div>
    );
}
