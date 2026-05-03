const playerList = document.getElementsByClassName( "player-list" )[ 0 ];

let clientDataList = [];

const SINGLE_PLAYER = 0

if ( !IsSinglePlayerSession() )
{
   // Must be called first over request lobby.
   SendLobbyData();

   // Request lobby data when the page loads
   RequestLobbyData();
}


function SendLobbyData ()
{
   LogCurrentWebsocketEvent( "Client connected", "Client has connected" );
   window.socket.emit( "ClientConnected", { "Id": window.gameId, "User": window.localUserName } )
}


window.socket.on( "LobbyData", ( data ) =>
{
   LogCurrentWebsocketEvent( "Get Lobby Data", `Recieved lobby data for lobby: ${ data.Id }` )
   UpdatePlayerList( data.Players );

   console.log( data.Players );
   console.log( IsHost( data.Players[ 0 ] ) );

   if ( IsHost( data.Players[ 0 ] ) )
   {
      window.socket.emit( "SyncBoardOnLateJoin", { "Canvas": canvas.toDataURL(), "Id": window.gameId } );
   }
} );

window.socket.on( "SyncBoardOnLateJoin", ( canvas ) =>
{
   LogCurrentWebsocketEvent( "SyncBoardOnLateJoin", "Sending canvas data over" );
   const img = new Image();
   img.src = canvas;
   img.onload = () =>
   {
      ctx.drawImage( img, 0, 0 );
   };
} );

window.socket.on( "SetClientCanvas", ( data ) =>
{
   // first index is always the host.
   if ( IsHost( data.Players[ 0 ] ) ) return;

   let width = data.Canvas.Width;
   let height = data.Canvas.Height;
   LogCurrentWebsocketEvent( "SetClientCanvas", `Client "${ window.localUserName }" is creating canvas with width "${ width }" and height "${ height }" from host.` );
   SetClientCanvas( width, height );

} );



window.socket.on( "Redirect", ( data ) =>
{
   window.location.href = data.Url;
} );


window.socket.on( "SyncBoard", ( data ) =>
{
   LogCurrentWebsocketEvent( "Sync Board", `Syncing current board state to every client.` )
   for ( const board of data )
   {
      drawPencil( board.point.x, board.point.y, board.brushSize, board.brushColor )
   }
} );

window.onbeforeunload = function ()
{
   console.log( window.localUserName );
   window.socket.emit( "ClientDisconnected", {
      Id: window.gameId,
      User: window.localUserName
   } )

   RequestLobbyData();
}

function IsHost ( host )
{
   return window.localUserName === host;
}

function UpdatePlayerList ( players )
{
   playerList.innerHTML = "";
   players.forEach( player =>
   {
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
   LogCurrentWebsocketEvent( "Request Lobby Data", `Requesting lobby data for lobby: ${ window.gameId }` );
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

   LogCurrentWebsocketEvent( "Update Game State", `Sending client "${ window.localUserName }" current board state to everyone in the lobby.` )
}

const CLIENT_DATA_THRESHOLD = 10

function AddClientData ( x, y, brushSize, brushColor )
{
   if ( clientDataList.length >= CLIENT_DATA_THRESHOLD )
   {
      UpdateGameState();
      clientDataList = []
   }
   clientDataList.push( new ClientData( new Vector( x, y ), brushSize, brushColor ) )
}

function ForceSyncBoard ()
{
   UpdateGameState();

   clientDataList = [];
}

function LogCurrentWebsocketEvent ( event, message )
{
   console.log( `${ event }: ${ message }` )
}

function IsSinglePlayerSession () 
{
   return window.gameId == SINGLE_PLAYER
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