window.socket.on( window.SOCKET_EVENTS.LOBBY_LIST, ( lobbies ) =>
{
   if ( !lobbies )
   {
      console.warn( "Lobby list is empty" );
      return;
   }

   const lobbyList = document.getElementsByClassName( "join-lobby" )[ 0 ];

   lobbyList.innerHTML = "Lobby List";

   Object.entries( lobbies ).forEach( ( [ id, lobby ] ) =>
   {

      const li = document.createElement( "li" );
      const button = document.createElement( "button" );

      button.textContent = `${ lobby.Name } (${ lobby.PlayerCount })`;

      button.onclick = () =>
      {

         console.log( `Player ${ window.localUserName } joining lobby ${ id }` );

         window.socket.emit( window.SOCKET_EVENTS.JOIN_LOBBY, {
            Id: id,
            User: window.localUserName
         } );
         window.location.href = `/canvas/${ id }`;
      };

      li.appendChild( button );
      lobbyList.appendChild( li );
   } );
} );

window.socket.on( "LobbyCreated", ( data ) =>
{
   if ( !data )
   {
      console.error( "Invalid LobbyCreated response:", data );
      return;
   }

   console.log( "Lobby created with ID: " + data.Id );
   window.location.href = `/canvas/${ data.Id }`;
} );


document.getElementById( window.SOCKET_EVENTS.CREATE_LOBBY ).onclick = function ()
{
   const lobbyName = document.getElementById( "LobbyName" ).value;

   window.socket.emit( window.SOCKET_EVENTS.CREATE_LOBBY, {
      name: lobbyName,
      host: window.localUserName
   } );
};

const button = document.getElementById( "join-lobby" );
button.addEventListener( "click", () =>
{
   window.socket.emit( window.SOCKET_EVENTS.LOBBY_LIST );
} );