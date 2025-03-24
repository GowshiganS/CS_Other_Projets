// src/pages/api/socket.ts
import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';
import { verify } from 'jsonwebtoken';
import { GameRoomManager } from '@/lib/gameRoom';
import { PlayerAction } from '@/lib/poker';

const JWT_SECRET = process.env.JWT_SECRET || 'poker-app-secret-key';

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error: Token missing'));
        }

        // Vérifier le token JWT
        const decoded = verify(token, JWT_SECRET);
        socket.data.user = decoded;
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      const userId = socket.handshake.query.userId;
      
      if (!userId) {
        socket.disconnect();
        return;
      }

      // Rejoindre une table
      socket.on('join_table', ({ tableId }) => {
        socket.join(`table:${tableId}`);
        console.log(`User ${userId} joined table ${tableId}`);
        
        // Envoyer l'état actuel de la salle
        const roomManager = GameRoomManager.getInstance();
        const roomState = roomManager.getRoomState(tableId);
        
        if (roomState) {
          socket.emit('game_event', {
            gameId: roomState.activeGame?.id || '',
            tableId,
            event: 'room_state',
            data: roomState
          });
        }
      });

      // Quitter une table
      socket.on('leave_table', ({ tableId }) => {
        socket.leave(`table:${tableId}`);
        console.log(`User ${userId} left table ${tableId}`);
        
        // Supprimer le joueur de la salle
        const roomManager = GameRoomManager.getInstance();
        roomManager.removePlayerFromRoom(tableId, Number(userId));
        
        // Informer les autres joueurs
        io.to(`table:${tableId}`).emit('game_event', {
          gameId: '',
          tableId,
          event: 'player_left',
          data: { userId }
        });
      });

      // Action du joueur
      socket.on('player_action', ({ gameId, playerId, action, amount }) => {
        console.log(`Player ${playerId} performed action ${action} in game ${gameId}`);
        
        // Récupérer la salle à partir du gameId
        const roomManager = GameRoomManager.getInstance();
        const rooms = roomManager.getAllRooms();
        const room = rooms.find(r => r.activeGame?.id === gameId);
        
        if (!room) return;
        
        // Effectuer l'action
        const updatedGame = roomManager.performAction(
          room.id, 
          playerId, 
          action as PlayerAction, 
          amount
        );
        
        if (updatedGame) {
          // Informer tous les joueurs de la table
          io.to(`table:${room.id}`).emit('game_event', {
            gameId,
            tableId: room.id,
            event: 'game_updated',
            data: updatedGame
          });
        }
      });

      // Message de chat
      socket.on('chat_message', ({ gameId, message }) => {
        const user = socket.data.user;
        if (!user) return;
        
        // Récupérer la salle à partir du gameId
        const roomManager = GameRoomManager.getInstance();
        const rooms = roomManager.getAllRooms();
        const room = rooms.find(r => r.activeGame?.id === gameId);
        
        if (!room) return;
        
        // Envoyer le message à tous les joueurs de la table
        io.to(`table:${room.id}`).emit('chat_message', {
          gameId,
          userId: user.id,
          username: user.username,
          message,
          timestamp: Date.now()
        });
      });

      // Déconnexion
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Quitter toutes les salles
        const rooms = Array.from(socket.rooms);
        for (const room of rooms) {
          if (room.startsWith('table:')) {
            const tableId = parseInt(room.split(':')[1]);
            const roomManager = GameRoomManager.getInstance();
            roomManager.removePlayerFromRoom(tableId, Number(userId));
            
            // Informer les autres joueurs
            io.to(room).emit('game_event', {
              gameId: '',
              tableId,
              event: 'player_left',
              data: { userId }
            });
          }
        }
      });
    });
  }

  res.end();
}
