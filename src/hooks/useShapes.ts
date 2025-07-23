import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createShape, deleteShape, getAllShapes, updateShape } from "../api/shapeService";
import toast from "react-hot-toast";

// Hook to get all shapes
export const useGetShapes = (params: any) => {
    return useQuery({
        queryKey: ["shapes", params],
        queryFn: () => getAllShapes(params),
    });
};

// Hook to create a new shape
export const useCreateShape = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: any) => createShape(formData),
        onSuccess: (data: any) => {
            queryClient.setQueriesData(["shapes"] as any, (old: any) => {
                const shapes = old?.data?.shapes;
                if (!shapes) return old;

                return {
                    ...old,
                    data: {
                        ...old?.data,
                        shapes: [...shapes, data?.data],
                    },
                };
            });

            toast.success("Shape created successfully");
        },
    });
};

// Hook to update a shape
export const useUpdateShape = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, id }: { data: any; id: any }) => updateShape(data, id),
        onSuccess: (data: any) => {
            const id = data?.data?._id;

            queryClient.setQueriesData(["shapes"] as any, (old: any) => {
                const updatedShapes = old?.data?.shapes.map((shape: any) =>
                    shape?._id === id ? data?.data : shape
                );

                if (!updatedShapes) return old;

                return {
                    ...old,
                    data: {
                        ...old?.data,
                        shapes: updatedShapes,
                    },
                };
            });

            toast.success(data?.message);
        },
    });
};
// Hook to update a shape
export const useDeleteShape = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id:any) => deleteShape(id),
        onSuccess: (data: any) => {
            const id = data?.data?._id;

            queryClient.setQueriesData(["shapes"] as any, (old: any) => {
                const updatedShapes = old?.data?.shapes.filter((shape: any) =>
                    shape?._id !== id
                );

                if (!updatedShapes) return old;

                return {
                    ...old,
                    data: {
                        ...old?.data,
                        shapes: updatedShapes,
                    },
                };
            });

            toast.success(data?.message);
        },
    });
};
