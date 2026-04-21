from flask import Flask, render_template, url_for


app = Flask(__name__);
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"

@app.route("/")
def login():
    return render_template("login.html");

@app.route("/home/")
def home():
    return render_template("home.html");

@app.route("/canvas/")
def canvas():
    return render_template("canvas.html")

@app.route("/lobby/")
def lobby():
    return render_template("lobby.html")

@app.route("/profile/")
def profile():
    return render_template('profile.html')
@app.route("/saved/")
def saved():
    return render_template("saved.html");



if __name__ == "__main__":
    print("[}----------- [Running app.py] ---------------{]")
    app.run(debug=True);