from flask_socketio import SocketIO, emit, join_room, rooms
from flask import Flask, redirect, url_for, request

import random
import string

socketio = SocketIO()
# stores name and player count
lobbies = {}
# maps socket IDs to lobby/user info for disconnect cleanup
connectedClients = {}


MAX_LOBBY_ID_LENGTH = 8
LOBBY_LIST = "LobbyList"
CREATE_LOBBY = "CreateLobby"
VIEW_LOBBIES = "ViewLobbies"
JOIN_LOBBY = "JoinLobby"
PLAYER_JOINED = "PlayerJoined"
UPDATE_GAME_STATE = "UpdateGameState"
CLIENT_DISCONNECTED = "ClientDisconnected"
GET_LOBBY_DATA = "GetLobbyData"


@socketio.on(CREATE_LOBBY)
def CreateLobby(data):
    
    name = data.get("name")
    host = data.get("host")

    lobbyId = str(len(lobbies) + 1)
    if not name:
        characters = string.ascii_letters + string.digits
        name = "".join(random.choice(characters) for _ in range(MAX_LOBBY_ID_LENGTH))

    lobbies[lobbyId] = {
        "Name": name,
        "PlayerCount": 1,  
        "Players": [host],
        "Host": host,
        "Canvas": {"Width": 0, "Height": 0, "Data": ""  }
    }

    join_room(lobbyId)
    emit("LobbyCreated", {"Id": lobbyId})


@socketio.on(LOBBY_LIST)
def ViewLobbies():
    lobby_data = {}
    for lobbyId, lobbyInfo in lobbies.items():
        lobby_data[lobbyId] = {
            "Name": lobbyInfo["Name"],
            "PlayerCount": lobbyInfo["PlayerCount"],
            "Players": lobbyInfo["Players"]
        }
    emit(LOBBY_LIST, lobby_data)


@socketio.on(JOIN_LOBBY)
def JoinLobby(data):

    lobbyId = data.get("Id")

    print("JOIN REQUEST:", data)

    if lobbyId not in lobbies:
        print("Invalid lobby:", lobbyId)
        emit("Error", {"message": "Lobby not found"})
        return

    print("Joining lobby");


@socketio.on(UPDATE_GAME_STATE)
def UpdateGameState(data):
    
    lobbyId = data.get("Id")

    lobby = lobbies.get(lobbyId)
    if not lobby:
        emit("Redirect", {"Url": "/lobby" })
        return

    clientData = data.get("ClientData")
    emit("SyncBoard", clientData, include_self=False, room = lobbyId)


@socketio.on("SyncBoardOnLateJoin")
def SyncBoardOnLateConnect(data):
    lobbyId = data.get("Id")

    if not lobbyId:
        EmitErrorMessage("No lobby Id.")
        return
    emit("SyncBoardOnLateJoin", lobbies[lobbyId]["Canvas"]["Data"])

@socketio.on("UpdateSeverCanvas")
def UpdateServerBackendCanvas(data):
    lobbyId = data.get("Id")

    if not lobbyId:
        EmitErrorMessage("No lobby Id.")
        return
    canvas = data.get("Canvas")

    if not canvas:
        EmitErrorMessage("No canvas given.")
        return
    
    lobbies[lobbyId]["Canvas"]["Data"] = canvas

@socketio.on("RemovePlayer")
def RemovePlayerFromLobby(data):
    connectedClients.pop(request.sid, None)

    if len(lobbies) <= 0:
        return
    
    lobbyId = data.get("Id")
    disconnectedUser = data.get("User")

    print(f"DELETING PLAYER: {disconnectedUser}")

    if not lobbyId:
        print("No lobbyId given when trying to remove a player")
        return
    
    if not disconnectedUser:
        print("No username was given to be deleted")
        return

    lobby = lobbies.get(lobbyId)
    if not lobby:
        print(f"Lobby {lobbyId} not found during disconnect cleanup")
        return

    players = lobby["Players"]
    if disconnectedUser not in players:
        print(f"Player {disconnectedUser} not found in lobby {lobbyId}")
        return

    players.remove(disconnectedUser)
    lobby["PlayerCount"] = len(players)

    if len(players) <= 0:
        print(f"Deleting lobby: `{lobbyId}` due to the lack of players.")
        lobbies.pop(lobbyId)
        return

    emit("LobbyData", {
        "Id": lobbyId,
        "Name": lobby["Name"],
        "PlayerCount": lobby["PlayerCount"],
        "Players": players
    }, room = lobbyId)


@socketio.on("ClearCanvas")
def OnClearCanvas(data):
    lobbyId = data.get("Id")

    if not lobbyId:
        EmitErrorMessage("No lobby Id")
        return

    emit("ClearCanvas", room=lobbyId, include_self=False)

# Called from master.js
@socketio.on("CreatedCanvas")
def OnCreateCanvas(data):
    lobbyId = data.get("Id")

    if not lobbyId:
      EmitErrorMessage("No lobby Id")
    lobby = lobbies[lobbyId]
    
    canvasWidth = data.get("Width")
    canvasHeight = data.get("Height")
    
    lobby["Canvas"]["Width"] = canvasWidth
    lobby["Canvas"]["Height"] = canvasHeight

    emit("SetClientCanvas", lobbies[lobbyId], include_self=False, room = lobbyId)


@socketio.on(GET_LOBBY_DATA)
def GetLobbyData(data):
    lobbyId = data.get("Id")
    if not lobbyId or lobbyId not in lobbies:
        emit("Error", {"message": "Lobby not found"})
        return
    
    lobby = lobbies[lobbyId]
    emit("LobbyData", {
        "Id": lobbyId,
        "Name": lobby["Name"],
        "PlayerCount": lobby["PlayerCount"],
        "Players": lobby["Players"],
    }, room = lobbyId)

@socketio.on("ClientConnected")
def OnClientConnected(data):
    lobbyId = data.get("Id")

    if not lobbyId:
        EmitErrorMessage("Client does not have a lobby Id.")
        return

    lobby = lobbies.get(lobbyId)

    if not lobby:
        emit("Redirect", {"Url": "/lobby"})

    user = data.get("User")

    if not user:
        EmitErrorMessage("Client does not have a username.")
        return
    
    join_room(lobbyId)
    connectedClients[request.sid] = {"Id": lobbyId, "User": user}

    lobby = lobbies[lobbyId]

    canvasWidth = lobby["Canvas"]["Width"]
    canvasHeight = lobby["Canvas"]["Height"]
    
    if(canvasWidth != 0 and canvasHeight != 0):
      emit("SetClientCanvas", lobby)

    if user in lobby["Players"]:
        EmitErrorMessage(f"User `{user}` is already a player.")
        return

    print(f"Adding player: `{user}` into the lobby.")
    lobby["Players"].append(user)
    lobby["PlayerCount"] += 1



@socketio.on('disconnect')
def OnDisconnect():
    clientInfo = connectedClients.pop(request.sid, None)
    if not clientInfo:
        print(f"Disconnect: no stored client info for sid {request.sid}")
        return

    print(f"Socket disconnected for user {clientInfo['User']} from lobby {clientInfo['Id']}")
    RemovePlayerFromLobby({"Id": clientInfo["Id"], "User": clientInfo["User"]})


def EmitErrorMessage(message):
    print(message)
    emit("Error", {"message": message})
