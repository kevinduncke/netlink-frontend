import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | { id: string, username: string, email: string },
        token: null as string | null,
    }),
    actions: {
        setAuth(user: any, token: string){
            this.user = user;
            this.token = token;
        },
        clearAuth(){
            this.user = null;
            this.token = null;
        },
    },
});