import { io } from 'socket.io-client';
const socket = io("https://canteen-queue-tracker-production.up.railway.app");
export default socket;