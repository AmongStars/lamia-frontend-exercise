from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('create_place')
def create_place():
	return ''

@app.route('get_place')
def get_place():
	return ''

@app.route('update_place')
def update_place():
	return ''

@app.route('delete_place')
def delete_place():
	return ''