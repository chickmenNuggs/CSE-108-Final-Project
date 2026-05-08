from database import db

class Saved(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(150), nullable=False)

    drawing_name = db.Column(db.String(200), nullable=False)

    image_data = db.Column(db.Text, nullable=False)