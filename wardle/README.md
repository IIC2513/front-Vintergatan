# React + Vite


## Correr el programa

cd wardle 
yarn
yarn dev 

## Rutas Principales de la Aplicación

/ - Página de inicio de la aplicación.

/rules - Página de reglas del juego.

/room - Sala de juego, donde los usuarios pueden crear o unirse a partidas.

/room/board - Tablero de juego para realizar intentos y ver resultados.

/register - Registro de nuevos usuarios.

/about - Información sobre el equipo y la aplicación.

/login - Inicio de sesión para usuarios registrados.

/sala/:salaId/:playerId/adivinar-palabra - Ruta para que un jugador envíe su intento de palabra en una partida específica. Reemplaza :salaId y :playerId con los IDs de la sala y del jugador.


- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
