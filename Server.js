import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { 
    origin: [
      'https://vocal-concha-17445e.netlify.app/',   // client URL
      'https://cheerful-croissant-72904b.netlify.app/' // kitchen URL
    ],
    methods: ['GET', 'POST']
  },
});

const clientNS = io.of('/client');
const kitchenNS = io.of('/kitchen');

clientNS.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  socket.on('order', (data) => {
    console.log('📦 Order from client:', data);
    kitchenNS.emit('new-order', data);
  });
});

kitchenNS.on('connection', (socket) => {
  console.log('🔧 Kitchen connected:', socket.id);
});

const PORT = process.env.PORT || 5174;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
