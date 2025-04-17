import {Server} from 'socket.io';

let resolve: (value: Server) => void;

const promise: Promise<Server> = new Promise<Server>((_resolve: (value: (PromiseLike<Server> | Server)) => void) => {
  resolve = _resolve;
});

export const getServerInstance: () => Promise<Server> = (): Promise<Server> => promise;
export const setServerInstance: (io: Server) => void = (server: Server): void => { resolve(server); };
