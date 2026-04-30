const playerList = document.getElementsByClassName( "player-list" )[ 0 ];

// 10 ticks per second
const TICK_RATE = 10;
const TICK_INTERVAL = 1000 / TICK_RATE;

let clientDataList = [];

// Request lobby data when the page loads
RequestLobbyData();

setInterval( () =>
{
   UpdateGameState();
}, TICK_INTERVAL );


window.socket.on( "LobbyData", ( data ) =>
{
   console.log( "Received lobby data:", data );
   // UpdatePlayerList( data.Players );
} );


window.socket.on( "Redirect", ( data ) =>
{
   window.location.href = data.Url;
} );


window.onbeforeunload = function ()
{
   console.log( window.localUserName );
   window.socket.emit( "RemovePlayerFromLobby", {
      Id: window.gameId,
      User: window.localUserName
   } )
}


function UpdatePlayerList ( players )
{
   playerList.innerHTML = "";

   players.forEach( player =>
   {
      console.log( player );
      const playerDiv = document.createElement( "div" );
      playerDiv.textContent = player;
      if ( player === window.localUserName )
      {
         playerDiv.textContent += " (You)";
      }
      playerList.appendChild( playerDiv );
   } );
}

function RequestLobbyData ()
{
   window.socket.emit( window.SOCKET_EVENTS.GET_LOBBY_DATA, {
      Id: window.gameId
   } );
}

function UpdateGameState ()
{
   window.socket.emit( window.SOCKET_EVENTS.UPDATE_GAME_STATE, {
      Id: window.gameId,
      User: window.localUserName,
      ClientData: clientDataList.map( client => ( {
         point: {
            x: client.point.x,
            y: client.point.y
         },
         brushSize: client.brushSize,
         brushColor: client.brushColor
      } ) )
   } );
}

const CLIENT_DATA_THRESHOLD = 50

function AddClientData ( x, y, brushSize, brushColor )
{
   if ( clientDataList.length >= CLIENT_DATA_THRESHOLD )
   {
      UpdateGameState();
      clientDataList = []
   }
   clientDataList.push( new ClientData( new Vector( x, y ), brushSize, brushColor ) )
}
class Vector
{
   constructor ( x, y )
   {
      this.x = x;
      this.y = y;
   }
}

class ClientData
{
   constructor ( vector, brushSize, brushColor )
   {
      this.point = vector;
      this.brushSize = brushSize;
      this.brushColor = brushColor;
   }
}