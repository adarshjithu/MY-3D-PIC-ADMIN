import * as yup from "yup";

export const baseProductValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    basePrice: yup.string().required("Base price is required"),
    actualPrice: yup.string().required("Actual price is required"),
    quantity: yup.string().required("Quantity is required"),

});     