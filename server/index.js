const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express(); // Creates HTTP server
app.use(express.json()); // utility to process JSON in requests
app.use(cors()); // utility to allow clients to make requests from other hosts or ips

const httpServer = createServer(app); // Explicity creates an HTTP server from the Express app

const io = new Server(httpServer, {
  path: "/real-time",
  cors: {
    origin: "*", // Allow requests from any origin
  },
}); // Creates a WebSocket server, using the same HTTP server as the Express app and listening on the /real-time path

const db = {
  players: [],
  marcoIndex:[],
  specialPoloIndex:[],
};

function assignRoles() {
  const roles = players.map((player, index) => index);
  roles.sort(() => Math.random() - 0.5);

  marcoIndex = roles[0];
  specialPoloIndex = roles[1];
  players.forEach((player, index) => {
      if (index === db.marcoIndex) {
          player.role = 'Marco';
      } else if (index === db.specialPoloIndex) {
          player.role = 'Polo especial';
      } else {
          player.role = 'Polo';
      }
  });
}

io.on("connection", (socket) => {
  console.log('A player connected', socket.id);

io.on("connection", (socket) => {
  // "joinGame" listerner
  const existingPlayer = db.players.find(player => player.name === name);
    if (!existingPlayer) {
      db.players.push({ id: socket.id, name, role: null });
      socket.emit("registerSuccess", { id: socket.id });

      // Start the game if enough players have joined
      if (db.players.length >= 3) {
        assignRoles();
        io.emit("rolesAssigned", db.players.map(player => ({ id: player.id, role: player.role })));
      }
    } else {
      socket.emit("registerError", "Nombre de usuario ya está en uso");
    }
  });



  // implement "startGame" listener

  socket.on('startGame', () => {
    if (db.players.length >= 3) {
      assignRoles();
      io.emit('rolesAssigned', db.players.map(player => ({ id: player.id, role: player.role })));
    } else {
      socket.emit('error', 'No hay suficientes jugadores para iniciar el juego');
    }
  });
 

  // implement "notifyMarco" listener
  // implement "notifyPolo" listener
  // implement "onSelectPolo" listener

    socket.on('selectPolo', (poloId) => {
      const marcoPlayer = db.players.find(player => player.role === 'Marco');
      if (marcoPlayer && marcoPlayer.id === socket.id) {
        const poloPlayer = db.players.find(player => player.id === poloId);
        if (poloPlayer) {
          const oldMarcoIndex = db.marcoIndex;
          db.marcoIndex = db.players.indexOf(poloPlayer);
          const newMarco = db.players[db.marcoIndex];
  
          db.players[oldMarcoIndex].role = 'Polo';
          db.players[db.marcoIndex].role = 'Marco';
  
          if (db.marcoIndex === db.specialPoloIndex) {
            io.emit('gameOver', { winner: 'Marco' });
            db.players.forEach(player => player.role = 'Polo');
            db.players[db.marcoIndex].role = 'Marco';
          } else {
            io.emit('roleChange', { newMarco: newMarco.id, oldMarco: db.players[oldMarcoIndex].id });
          }
        }
      }
    });
  
    // Handle player disconnection
    socket.on('disconnect', () => {
      console.log('A player disconnected', socket.id);
      db.players = db.players.filter(player => player.id !== socket.id);
      io.emit('playerDisconnected', { id: socket.id });
    });
  });


httpServer.listen(5050, () => {
  // Starts the server on port 5050, same as before but now we are using the httpServer object
  console.log(`Server is running on http://localhost:${5050}`);
});
