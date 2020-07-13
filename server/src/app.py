from flask import Flask, request, Response

import os

from database.db import initialize_db
from database.models import Markers


app = Flask(__name__)

app.config['MONGODB_SETTINGS'] = {
    'host': 'mongodb+srv://' + os.environ['USERNAME'] + ':' + os.environ['PASSWORD'] + '@cluster0.y4gg7.mongodb.net/MapMarkers?retryWrites=true&w=majority'
}

initialize_db(app)


@app.route('/markers')
def get_markers():
    markers = Markers.objects().to_json()
    return Response(markers, mimetype="application/json", status=200)


app.run()
