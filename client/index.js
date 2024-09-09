let socket = io("http://localhost:5050", { path: "/real-time" });

document.getElementById("join-button").addEventListener("click", fetchData);

async function fetchData() {
  const nickname = document.getElementById("nickname").value;
  if (nickname) {
      socket.emit("joinGame", { nickname }); // Enviar el nombre de usuario al servidor
  } else {
      alert("Por favor, introduce un nombre de usuario.");
  }
}

  // Manejar el evento cuando un usuario se une al juego
  socket.on("userJoined", (data) => {
    console.log('Usuario se unió:', data);
    document.getElementById("registerMessage").innerText = "Te has unido al juego!";
});


// Manejar el evento para actualizar los roles cuando se asignan
socket.on("rolesAssigned", (roles) => {
  console.log('Roles asignados:', roles);
  const rolesDiv = document.getElementById("roles");
  rolesDiv.innerHTML = "";
  roles.forEach(player => {
      const playerDiv = document.createElement("div");
      playerDiv.innerText = `Jugador ID: ${player.id}, Rol: ${player.role}`;
      rolesDiv.appendChild(playerDiv);
  });
  document.getElementById("registration").style.display = 'none';
  document.getElementById("game").style.display = 'block';
});

// Manejar el evento de cambio de rol
socket.on("roleChange", (data) => {
  console.log('Cambio de rol:', data);
  alert(`El nuevo Marco es el jugador con ID: ${data.newMarco}`);
});

// Manejar el evento de fin de juego
socket.on("gameOver", (data) => {
  alert(`Juego terminado! Ganador: ${data.winner}`);
  document.getElementById("game").style.display = 'none';
  document.getElementById("registration").style.display = 'block';
});

// Manejar el clic en el botón de iniciar juego
document.getElementById('startGame').addEventListener('click', () => {
  socket.emit('startGame');
});

// Manejar el clic en el botón de seleccionar Polo
document.getElementById('selectPolo').addEventListener('click', () => {
  const poloId = prompt('Introduce el ID del Polo a seleccionar');
  if (poloId) {
      socket.emit('selectPolo', poloId);
  }
});
