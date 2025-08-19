import { io } from 'socket.io-client';
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const socket = io(`{API_URL}`,{
  transports: ['websocket'],  // helps avoid polling errors sometimes
  reconnection: true,
});
export default socket;