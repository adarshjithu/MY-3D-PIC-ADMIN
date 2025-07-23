import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../api/categories";

// Hook to get all categories
export const useGetCategories = (params: any) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => getAllCategories(params),
    });
};

// Hook to create a new category
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: any) => createCategory(formData),
        onSuccess: (data: any) => {
            queryClient.setQueriesData(["categories"] as any, (old: any) => {
                const categories = old?.data?.categories;
                if (!categories) return old;

                return {
                    ...old,
                    data: {
                        ...old?.data,
                        categories: [...categories, data?.data],
                    },
                };
            });

            toast.success("Shape created successfully");
        },
    });
};

// Hook to update a shape
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, id }: { data: any; id: any }) => updateCategory(data, id),
        onSuccess: (data: any) => {
            const id = data?.data?._id;

            queryClient.setQueriesData(["categories"] as any, (old: any) => {
                const updatedCategories = old?.data?.categories.map((category: any) => (category?._id === id ? data?.data : category));

                if (!updatedCategories) return old;

                return {
                    ...old,
                    data: {
                        ...old?.data,
                        categories: updatedCategories,
                    },
                };
            });

            toast.success(data?.message);
        },
    });
};
// Hook to update a category
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: any) => deleteCategory(id),
        onSuccess: (data: any) => {
            const id = data?.data?._id;

            queryClient.setQueriesData(["categories"] as any, (old: any) => {
                const updatedCategories = old?.data?.categories.filter((category: any) => category?._id !== id);

                if (!updatedCategories) return old;

                return {
                    ...old,
                    data: {
                        ...old?.data,
                        categories: updatedCategories,
                    },
                };
            });

            toast.success(data?.message);
        },
    });
};
