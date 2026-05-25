import { useMutation } from "@tanstack/react-query";
import login from "../api/login";

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ username, password }: { username: string, password: string }) => login(username, password),
    })
}