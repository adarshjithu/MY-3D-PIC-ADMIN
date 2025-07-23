import toast from "react-hot-toast";
import { baseUrl, erroHandler } from "./baseUrl";

export const getAllCategories = async (params: any) => {
    try {
        const result = await baseUrl.get("/category", { params: params });
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
export const deleteCategory = async (categoryId: string) => {
    try {
        const result = await baseUrl.delete(`/category/${categoryId}`);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
export const updateCategory = async (formData: any, categoryId: string) => {
    try {
        const result = await baseUrl.put(`/category/${categoryId}`, formData);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
export const createCategory = async (formData: any) => {
    try {
       
        const result = await baseUrl.post(`/category`, formData);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
