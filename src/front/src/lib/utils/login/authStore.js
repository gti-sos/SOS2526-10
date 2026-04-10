import { writable } from 'svelte/store';

const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
const storedUser = typeof window !== 'undefined' ? localStorage.getItem("username") : null;

export const isAuthenticated = writable(!!token);
export const username = writable(storedUser);

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    
    isAuthenticated.set(false);
    username.set(null);
};