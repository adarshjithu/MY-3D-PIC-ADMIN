import toast from "react-hot-toast";
import { baseUrl, erroHandler } from "./baseUrl";

export const getAllShapes = async (params: any) => {
    try {
        
        const result = await baseUrl.get("/shape", { params: params });
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
export const deleteShape = async (shapeId: any) => {
    try {
        const result = await baseUrl.delete(`/shape/${shapeId}`);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error;
    }
};
export const updateShape = async (formData: any, shapeId: string) => {
    
    try {
        const result = await baseUrl.put(`/shape/${shapeId}`, formData, {
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
export const createShape = async (formData: any) => {
    try {
        console.log(formData);
        const result = await baseUrl.post(`/shape`, formData, {
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
