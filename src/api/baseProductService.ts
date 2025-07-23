import toast from "react-hot-toast";
import { baseUrl, erroHandler } from "./baseUrl";

export const getAllBaseProducts = async (params: any) => {
    try {
        const result = await baseUrl.get("/base", { params: params });
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
export const deleteBaseProduct = async (baseProductId: string) => {
    try {
        const result = await baseUrl.delete(`/base/${baseProductId}`);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
export const updateBaseProduct = async (formData: any, baseProductId: string) => {
    try {
        const result = await baseUrl.put(`/base/${baseProductId}`, formData);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
export const createBaseProduct = async (formData: any) => {
    try {
        const result = await baseUrl.post(`/base`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
