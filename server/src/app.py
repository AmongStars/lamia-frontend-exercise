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


@app.route('/marker', methods=['POST'])
def create_marker():
    body = request.get_json()
    marker = Markers(**body).save()
    id = marker.id
    return {'id': str(id)}, 200


@app.route('/marker/<id>', methods=['PUT'])
def update_marker(id):
    body = request.get_json()
    Markers.objects.get(id=id).update(**body)
    return '', 200


@app.route('/marker/<id>', methods=['DELETE'])
def delete_marker(id):
    Markers.objects.get(id=id).delete()
    return '', 200


app.run()
