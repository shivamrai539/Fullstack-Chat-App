// Zustand is a small state management library for React.
// A global storage box that any component can access.
// No prop drilling.

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set , get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdateingProfile: false,

    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get('/auth/check')

            set({authUser: res.data});
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth :" , error)
            set({authUser: null});
        } finally{
            set({ isCheckingAuth: false});
        }
    },

    signUp: async(data) => {
        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser : res.data});
            toast.success("Account created successfully");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp: false});
        }
    },

    login: async(data) => {
        set({isLoggingIn : true});

        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser : res.data});
            toast.success("Logged In");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isLoggingIn : false});
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser : null});
            toast.success("Logged out successfully");
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async(data) => {
        set({ isUpdateingProfile : true});

        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser : res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally{
            set({isUpdateingProfile : false});
        }
    }, 

    connectSocket: () => {
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return;        // if use is authenticated then connect socket


        const socket = io(BASE_URL , {
            query:{
                userId: authUser._id,
            },
        });
        socket.connect();

        set({socket: socket});

        socket.on("getOnlineUsers" , (userIds) => {
            set({onlineUsers: userIds});
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    },

}));


/*
Q) Why do we need Zustand?

Because some data is needed everywhere, like:

Logged-in user

Theme (dark/light)

Cart items

Authentication state

If you manage this with only useState, things become messy fast.
*/