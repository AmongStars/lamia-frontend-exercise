# Custom map with Google API

The goal of the Front-end exercise for Lamia is to create a custom map based on Google maps. A user is able to place markers on map as well as mark places as favourites. A user can edit a marker information, add to and remove it from favourites.

## Getting Started
---
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install Flask.

```bash
python3.7 -m pip install Flask
```

Install flaskr as a Package.
```bash
export FLASK_APP=flaskr
```

To switch Flask to the development environment and enable debug mode.
```bash
export FLASK_ENV=development
```

Install Sass using npm.
```bash
npm install -g sass
```

Install mongo shell with brew for connecting to remote MongoDB instances.
```bash
brew install mongodb/brew/mongodb-community-shell
```

Install Flask-MongoEngine.
```bash
python -m pip install flask-mongoengine
```

Import a filename of a Python module that contains a Flask application.
```bash
export FLASK_APP=src/app.py
```

Install Flask-CORS using pip.
```bash
python -m pip install -U flask-cors
```

## Deployment
---

### Client repository

Create file composer.json and add:
```
{}
```

Create file index.php and add:
```php
<?php include_once("index.html"); ?>
```

Deploy to Heroku with Git:
```bash
git init
heroku git:remote -a lamia-exercise-nb
git add .
git commit -m "Initial commit"
git push heroku master
```

### Server repository

Create Procfile and add:
```
web: gunicorn wsgi:app
```

Create a virtual environment for a project and activate it:
```bash
python -m venv .
source bin/activate
```

Install packages:
```bash
pip3.7 install flask
pip3.7 install flask-cors
pip3.7 install gunicorn
pip3.7 install flask-mongoengine
pip3.7 install dnspython
```

Start with Gunicor:
```bash
gunicorn wsgi:app
```

Freeze the current state of the environment packages:
```bash
pip freeze > requirements.txt¨
```

Deploy to Heroku with Git:
```bash
git init
heroku git:remote -a lamia-exercise-nb-server
git add .
git commit -m "Initial commit"
git push heroku master
```

Deactivate virtual environment:
```bash
deactivate
```

## Built With
---

- JavaScript
- HTML
- Sass
- Python

## Contributing
---

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Versioning
---

Version 0.1.0

## Authors
---

- Nina Barnabishvili - *Initial work*

## License
---

[MIT](https://choosealicense.com/licenses/mit/)
