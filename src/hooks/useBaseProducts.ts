import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBaseProduct, deleteBaseProduct, getAllBaseProducts, updateBaseProduct } from "../api/baseProductService";

// Hook to get all categories
export const useGetBaseProducts = (params: any) => {
    return useQuery({
        queryKey: ["baseProducts", params],
        queryFn: () => getAllBaseProducts(params),
    });
};

// Hook to create a new category
export const useCreateBaseProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: any) => createBaseProduct(formData),
        onSuccess: (data: any) => {
            queryClient.setQueriesData(["baseProducts"] as any, (old: any) => {
                const baseProducts = old?.data?.baseProducts;
                if (!baseProducts) return old;

                return {
                    ...old,
                    data: {
                        ...old?.data,
                        baseProducts: [...baseProducts, data?.data],
                    },
                };
            });

            toast.success("Shape created successfully");
        },
    });
};

// Hook to update a shape
export const useUpdateBaseProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, id }: { data: any; id: any }) => updateBaseProduct(data, id),
        onSuccess: (data: any) => {
            const id = data?.data?._id;

            queryClient.setQueriesData(["baseProducts"] as any, (old: any) => {
                const updatedBaseProducts = old?.data?.baseProducts.map((baseProduct: any) => (baseProduct?._id === id ? data?.data : baseProduct));

                if (!updatedBaseProducts) return old;

                return {
                    ...old,
                    data: {
                        ...old?.data,
                        baseProducts: updatedBaseProducts,
                    },
                };
            });

            toast.success(data?.message);
        },
    });
};


// Hook to update a category
export const useDeleteBaseProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: any) => deleteBaseProduct(id),
        onSuccess: (data: any) => {
            const id = data?.data?._id;

            queryClient.setQueriesData(["baseProducts"] as any, (old: any) => {
                const updatedBaseProducts = old?.data?.baseProducts.filter((baseProduct: any) => baseProduct?._id !== id);

                if (!updatedBaseProducts) return old;

                return {
                    ...old,
                    data: {
                        ...old?.data,
                            baseProducts: updatedBaseProducts,
                    },
                };
            });

            toast.success(data?.message);
        },
    });
};
