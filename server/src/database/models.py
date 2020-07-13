from .db import db

class Markers(db.Document):
    title = db.StringField(required=True, unique=False)
    description = db.StringField(required=True, unique=False)
    position = db.StringField(required=True, unique=True)
    openHours = db.StringField(required=True, unique=False)
