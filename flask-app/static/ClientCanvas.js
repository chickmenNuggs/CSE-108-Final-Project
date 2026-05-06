const container = document.getElementById( 'ploingus' );

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
   if ( IsSinglePlayerSession() ) return;

   LogCurrentWebsocketEvent( "Client connected", "Client has connected" );
   window.socket.emit( "ClientConnected", { "Id": window.gameId, "User": window.localUserName } )
}


window.socket.on( "LobbyData", ( data ) =>
{
   console.log( data );
   if ( IsSinglePlayerSession() ) return;

   LogCurrentWebsocketEvent( "Get Lobby Data", `Recieved lobby data for lobby: ${ data.Id }` );
   UpdatePlayerList( data.Players );
} );


window.socket.on( "Error", ( data ) => 
{
   LogCurrentWebsocketEvent( "Error", data.message );
} );

window.socket.on( "SyncBoardOnLateJoin", async ( buffer ) =>
{
   if ( IsSinglePlayerSession() ) return;

   LogCurrentWebsocketEvent( "SyncBoardOnLateJoin", "Receiving canvas buffer" );

   const blob = new Blob( [ buffer ], { type: "image/webp" } );
   const bitmap = await createImageBitmap( blob );

   ctx.clearRect( 0, 0, canvas.width, canvas.height );
   ctx.drawImage( bitmap, 0, 0 );

   bitmap.close();
} );


window.socket.on( "SetClientCanvas", async ( data ) =>
{
   if ( IsSinglePlayerSession() ) return;
   // first index is always the host.
   let width = data.Canvas.Width;
   let height = data.Canvas.Height;

   LogCurrentWebsocketEvent( "SetClientCanvas", `Client "${ window.localUserName }" is creating canvas with width "${ width }" and height "${ height }" from host.` );
   SetClientCanvas( width, height );

   if ( data.Canvas && data.Canvas.Data )
   {
      await LoadBoardFromBuffer( data.Canvas.Data );
   }
} );

async function LoadBoardFromBuffer ( buffer )
{
   LogCurrentWebsocketEvent( "LoadBoardFromBuffer", "Drawing canvas buffer for late join." );
   const blob = new Blob( [ buffer ], { type: "image/webp" } );
   const bitmap = await createImageBitmap( blob );

   ctx.clearRect( 0, 0, canvas.width, canvas.height );
   ctx.drawImage( bitmap, 0, 0 );

   bitmap.close();
}



window.socket.on( "Redirect", ( data ) =>
{
   if ( IsSinglePlayerSession() ) return;

   LogCurrentWebsocketEvent( "Redirect", "redirecting user back to lobby." );
   window.location.href = data.Url;
} );


window.socket.on( "SyncBoard", ( data ) =>
{
   if ( IsSinglePlayerSession() ) return;

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
   container.innerHTML = "";
   players.forEach( player =>
   {
      fillRoster( player );
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
   if ( IsSinglePlayerSession() ) return;

   if ( clientDataList.length >= CLIENT_DATA_THRESHOLD )
   {
      UpdateGameState();
      clientDataList = []
   }
   clientDataList.push( new ClientData( new Vector( x, y ), brushSize, brushColor ) )
}

let syncTimer = null;

function ForceSyncBoard ()
{
   if ( IsSinglePlayerSession() ) return;

   UpdateGameState();

   // Basically if we let go of the mouse it will start a one second timer and if we draw again it will reset
   // the timer and when we stop drawing for one second it will call finally update our snapshot.
   clearTimeout( syncTimer );
   syncTimer = setTimeout( () =>
   {
      canvas.toBlob( ( blob ) =>
      {
         blob.arrayBuffer().then( ( buffer ) =>
         {
            window.socket.emit( "UpdateSeverCanvas", { Id: window.gameId, Canvas: buffer } );
         } );
      }, "image/webp", 0.8 );

      console.log( "After one second we are saving snapshot" );
   }, 1000 );


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