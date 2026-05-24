import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../api/getCustomers";

export const useCustomers = () => {
    return useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    });
};