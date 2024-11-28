import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
});

// Event listeners to handle connection
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Export the socket to use in other components
export default socket;
