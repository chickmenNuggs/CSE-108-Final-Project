const playerList = document.getElementsByClassName( "player-list" )[ 0 ];

// 10 ticks per second
const TICK_RATE = 10;
const TICK_INTERVAL = 1000 / TICK_RATE;

setInterval( () =>
{
   console.log( window.localUserName )
   window.socket.emit( window.SOCKET_EVENTS.UPDATE_GAME_STATE, {
      Id: window.gameId,
      User: window.localUserName
   } );
}, TICK_INTERVAL );


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
