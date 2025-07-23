import React, { use, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useCreateShape, useUpdateShape } from "../../hooks/useShapes";
import ButtonLoading from "../Loading/ButtonLoading";

export default function AddShapeModal({ setAddShapeModalOpen, editShapeData }: { setAddShapeModalOpen: any; editShapeData: any }) {
    const [image, setImage] = useState<File | null>(null);
    const [name, setName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: createShape, isPending } = useCreateShape();
    const { mutate: updateShape } = useUpdateShape();
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editShapeData && (!name || !image)) {
            toast.error("Please fill all the fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        image?formData.append("image", image || ""):""

        editShapeData ? updateShape({ data: formData, id: editShapeData?._id }) : createShape(formData);
        setAddShapeModalOpen(false);
        setImage(null);
        setName("");
    };

    useEffect(() => {
        if (editShapeData) {
            setName(editShapeData?.name);
            setImage(null);
        }
    }, [editShapeData]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Shape</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shape Name</label>
                        <input
                            type="text"
                            value={name || editShapeData?.name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter shape name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shape Image</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {image && (
                                <img
                                    src={URL.createObjectURL(image) || editShapeData?.image}
                                    alt="Preview"
                                    className="w-16 h-16 rounded object-cover border border-gray-200 dark:border-gray-700"
                                />
                            )}
                            {editShapeData && !image && (
                                <img
                                    src={editShapeData?.image}
                                    alt="Preview"
                                    className="w-16 h-16 rounded object-cover border border-gray-200 dark:border-gray-700"
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-8">
                        <button
                            onClick={() => setAddShapeModalOpen(false)}
                            type="button"
                            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
                            {isPending ? <ButtonLoading /> : "Add Shape"}
                        </button>
                    </div>
                </form>
                <button
                    onClick={() => setAddShapeModalOpen(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}
