
import { baseUrl, erroHandler } from "../api/baseUrl";

export const getAllUsers = async () => {
    try {
        const response = await baseUrl.get("/v1/admin/users");
        return response;
    } catch (error) {
        return erroHandler(error);
    }
};