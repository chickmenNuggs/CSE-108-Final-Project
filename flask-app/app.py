from flask import Flask, jsonify, redirect, render_template, request, url_for, session
from flask_login import LoginManager, login_required, current_user
from User import GetUserFromName
from server import socketio

# Custom user python file
from User import GetUser, TryToRegister, LoggedInSucessfully

from saved import Saved

from database import db

app = Flask(__name__);
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SECRET_KEY"] = "your_secret_key"

db.init_app(app)
socketio.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

MAX_LOBBY_ID_LENGTH = 8
LOBBY_LIST = "LobbyList"
CREATE_LOBBY = "CreateLobby"
VIEW_LOBBIES = "ViewLobbies"
JOIN_LOBBY = "JoinLobby"
PLAYER_JOINED = "PlayerJoined"
UPDATE_GAME_STATE = "UpdateGameState"
GET_LOBBY_DATA = "GetLobbyData"


@login_manager.user_loader
def load_user(id):
    return GetUser(id)

@app.route("/")
def login():
    return render_template("login.html")

@app.route("/signup/")
def signup():
    return render_template("signup.html")

@app.route("/login/", methods=["POST"])
def login_post():
    username = request.form.get("username")
    password = request.form.get("password")

    if LoggedInSucessfully(username, password):
        session["user"] = username
        print("SESSION USER:", session.get("user"))
        return redirect(url_for("home"))

    return "Invalid login"

@app.route("/register/", methods=["POST"])
def register():
    username = request.form.get("username")
    password = request.form.get("password")

    userExists, existingUserErrorMessage = TryToRegister(username, password)

    if userExists:
        return existingUserErrorMessage

    return redirect(url_for("login"))

@app.route("/home/")
@login_required
def home():
    return render_template("home.html",)

@app.route("/canvas/<gameId>")
@login_required
def canvas(gameId):
    return render_template("canvas.html", gameId = gameId, LOBBY_LIST=LOBBY_LIST,CREATE_LOBBY=CREATE_LOBBY, VIEW_LOBBIES=VIEW_LOBBIES, 
                           JOIN_LOBBY=JOIN_LOBBY, UPDATE_GAME_STATE = UPDATE_GAME_STATE, GET_LOBBY_DATA=GET_LOBBY_DATA, localUserName=session["user"])

@app.route("/lobby/")
@login_required
def lobby():
    return render_template("lobby.html", LOBBY_LIST=LOBBY_LIST,CREATE_LOBBY=CREATE_LOBBY, VIEW_LOBBIES=VIEW_LOBBIES, JOIN_LOBBY=JOIN_LOBBY, localUserName=session["user"])

@app.route("/profile/", methods=["GET", "POST"])
@login_required
def profile():
    from flask_login import current_user
    message = request.args.get('message', '')
    error = request.args.get('error', '')
    return render_template('profile.html', message=message or error, error=bool(error))

@app.route("/change-username/", methods=["POST"])
@login_required
def change_username():
    
    newUsername = request.form.get("NewUsername", "").strip()
    
    if not newUsername:
        return redirect(url_for("profile", error="Username cannot be empty"))
    
    if len(newUsername) < 3:
        return redirect(url_for("profile", error="Username must be at least 3 characters"))
    
    if GetUserFromName(newUsername):
        return redirect(url_for("profile", error="Username already exists"))
    
    current_user.username = newUsername
    db.session.commit()
    session["user"] = newUsername
    
    return redirect(url_for("profile", message="Username changed successfully"))

@app.route("/change-password/", methods=["POST"])
@login_required
def change_password():
    from flask_login import current_user
    from werkzeug.security import check_password_hash, generate_password_hash
    
    currentPassword = request.form.get("CurrentPassword", "")
    newPassword = request.form.get("NewPassword", "")
    confirmPassword = request.form.get("ConfirmPassword", "")
    
    if not check_password_hash(current_user.password, currentPassword):
        return redirect(url_for("profile", error="Current password is incorrect"))
    
    if not newPassword:
        return redirect(url_for("profile", error="New password cannot be empty"))
    
    if len(newPassword) < 6:
        return redirect(url_for("profile", error="Password must be at least 6 characters"))
    
    if newPassword != confirmPassword:
        return redirect(url_for("profile", error="Passwords do not match"))
    
    if newPassword == currentPassword:
        return redirect(url_for("profile", error="New password must be different from current password"))
    
    current_user.password = generate_password_hash(newPassword)
    db.session.commit()
    
    return redirect(url_for("profile", message="Password changed successfully"))

@app.route("/saved/")
@login_required
def saved():

    drawings = Saved.query.filter_by(
        username=current_user.username
    ).all()

    return render_template(
        "saved.html",
        drawings=drawings
    )

@app.route('/settings/')
@login_required
def settings():
    return render_template('settings.html')

@app.route("/save-drawing/", methods=["POST"])
@login_required
def save_drawing():

    data = request.get_json()

    drawingName = data.get("name")
    imageData = data.get("image")

    if not drawingName or not imageData:
        return jsonify({"success": False})

    drawing = Saved(
        username=current_user.username,
        drawing_name=drawingName,
        image_data=imageData
    )

    db.session.add(drawing)
    db.session.commit()

    return jsonify({"success": True})

@app.route("/logout/")
@login_required
def logout():
    from flask_login import logout_user
    logout_user()
    session.clear()
    return redirect(url_for("login"))

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    print("[}----------- [Running app.py] ---------------{]")
    socketio.run(app, debug=True)