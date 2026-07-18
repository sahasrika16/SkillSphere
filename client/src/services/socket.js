import { io } from "socket.io-client";

export const socket = io("https://skillsphere-backend-72pj.onrender.com", {
  autoConnect: false,
  withCredentials: true
});