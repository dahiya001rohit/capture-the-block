import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001';
const ID_KEY = 'ctb:id';

// auth as a function so reconnects always send the latest stored id
export const socket: Socket = io(URL, {
  autoConnect: false,
  auth: (cb) => cb({ id: localStorage.getItem(ID_KEY) }),
});

export function persistId(id: string): void {
  localStorage.setItem(ID_KEY, id);
}

export function claim(idx: number): void {
  socket.emit('claim', { idx });
}

export function rename(name: string): void {
  socket.emit('name:update', { name });
}
