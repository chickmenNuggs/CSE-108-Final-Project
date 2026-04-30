const playerList = document.getElementsByClassName( "player-list" )[ 0 ];

// 10 ticks per second
const TICK_RATE = 10;
const TICK_INTERVAL = 1000 / TICK_RATE;

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
      User: window.localUserName
   } );
}