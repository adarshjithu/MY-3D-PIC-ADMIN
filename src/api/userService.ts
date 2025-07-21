import toast from "react-hot-toast";
import { baseUrl, erroHandler } from "./baseUrl";

export const getAllUser = async (params: any) => {
    try {
        const result = await baseUrl.get("/customer", {params:params});
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
    }
};
export const toggleUserStatus = async (customerId: string) => {
    try {
        
        const result = await baseUrl.patch(`/customer/status/${customerId}`);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(message);
        throw error
    }
};
export const blockuser = async (customerId: string) => {
    try {
        
        const result = await baseUrl.patch(`/customer/block/${customerId}`);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(`${message} ❌`);
        throw error
    }
};
export const deleteUser = async (customerId: string) => {
    try {
        
        const result = await baseUrl.delete(`/customer/${customerId}`);
        return result?.data;
    } catch (error) {
        const message = erroHandler(error);
        toast.error(`${message} ❌`);
        throw error
    }
};
