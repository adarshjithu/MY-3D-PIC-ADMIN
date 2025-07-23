import { useEffect, useState } from "react";
import { useCreateCategory, useUpdateCategory } from "../../hooks/useCategories";

export default function AddCategoryModal({ editCategoryData, setAddCategoryModalOpen }: { editCategoryData: any; setAddCategoryModalOpen: any }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { mutate: updateCategoryMutation } = useUpdateCategory();
    const { mutate: createCategoryMutation } = useCreateCategory();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (editCategoryData) {
            updateCategoryMutation({ data: { name: name, description: description }, id: editCategoryData?._id });
        } else {
            createCategoryMutation({ name, description: description });
        }
        setAddCategoryModalOpen(false);
        setName("");
        setDescription("");
    };

    useEffect(() => {
        if (editCategoryData) {
            setName(editCategoryData.name);

            setDescription(editCategoryData.description);
        }
    }, [editCategoryData]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Category</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter category name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter category description"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-8">
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Add Category
                        </button>
                    </div>
                </form>
                <button
                    onClick={() => setAddCategoryModalOpen(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}
