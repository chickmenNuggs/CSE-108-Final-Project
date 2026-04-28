const socket = io();

const LOBBY_LIST = "LobbyList"
const CREATE_LOBBY = "CreateLobby"
const VIEW_LOBBIES = "ViewLobbies"
const JOIN_LOBBY = "JoinLobby"


document.getElementById( "CreateLobby" ).onclick = function ()
{
   const lobbyName = document.getElementById( "LobbyName" ).value;
   CreateLobby( lobbyName );
   toggleHiddenLobby( "join-lobby", "create-lobby", "info" );
   ViewAvailableLobbies();
};


const button = document.getElementById( "join-lobby" );

button.addEventListener( "click", () =>
{
   ViewAvailableLobbies();
} );

function ViewAvailableLobbies ()
{
   socket.emit( LOBBY_LIST );
   socket.on( LOBBY_LIST, ( lobbies ) =>
   {
      const list = document.getElementsByClassName( "join-lobby" )[ 0 ];
      list.innerHTML = "Lobby List"
      Object.entries( lobbies ).forEach( ( [ id, lobby ] ) =>
      {
         const li = document.createElement( "li" );
         li.innerHTML = `<button>${ lobby.name } (${ lobby.players })</button>`;
         list.appendChild( li );
      } );
   } );
}

function CreateLobby ( name )
{
   console.log( "Creating lobby: " + name );
   socket.emit( CREATE_LOBBY, name );
}


// I can't export this function from another .js file and it won't let me no matter what so I am just copy and pasting it.

function toggleHiddenLobby ( page1, page2, page3 )
{

   b1 = document.getElementById( page1 );
   b2 = document.getElementById( page2 );
   b3 = document.getElementById( page3 );
   p1 = document.getElementsByClassName( page1 )[ 0 ];
   p2 = document.getElementsByClassName( page2 )[ 0 ];
   p3 = document.getElementsByClassName( page3 )[ 0 ];

   b1.classList.add( 'nav-active' );
   b2.classList.remove( 'nav-active' );
   b3.classList.remove( 'nav-active' );

   p1.classList.remove( 'hidden' );
   p2.classList.add( 'hidden' );
   p3.classList.add( 'hidden' );
}