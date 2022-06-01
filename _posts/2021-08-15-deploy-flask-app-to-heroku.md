---
title: "How to deploy a Python Flask app on Heroku?"
excerpt: "So your application can live happily ever after online."
categories:
tags: Python Flask Heroku
---

This tutorial demonstrates how to deploy a simple hello-world Flask app on a cloud application platform called [Heroku](https://www.heroku.com/about).

There are three main steps we have to take.

### Sign up Heroku

The first step is to register an account on [Heroku](https://signup.heroku.com/) such that later Heroku CLI knows where to push our code to.

### Create a hello-world app

The second step starts with opening a terminal to create a project directory named `my-app` and change directory into it.

```
$ mkdir my-app
$ cd my-app/
```

We then set up a virtual environment and install the necessary Python packages.

```
$ python3 -m venv venv
$ . venv/bin/activate
$ pip3 install Flask flask-cors
```

Here we create our `app.py`.

<div class="codeblock-label">app.py</div>

```
from flask import Flask
from flask_cors import CORS
from os import environ

def factory():
    app = Flask(__name__)
    CORS(app)

    @app.route('/')
    def welcome():
        return f'Welcome!'

    @app.route('/echo/<message>')
    def echo(message=None):
        return f'{message}'

    return app

if __name__ == '__main__':
    app = factory()
    app.run(host='0.0.0.0', port=environ.get('PORT', 5000))
```

Then we create a `Procfile` to let Heroku know how to run our app.

<div class="codeblock-label">Procfile</div>

```
web: python3 app.py
```

Next we store our Python package requirement into `requirements.txt`.

```
$ pip3 freeze > requirements.txt
```

We also create a `runtime.txt` to inform Heroku which Python version we are using.

<div class="codeblock-label">runtime.txt</div>

```
python-3.8.10
```

### Push the project to Heroku

Now we have all the files ready. Let's log in to Heroku and then turn our project directory into a git repository to push our project to the cloud.

```
$ heroku login

$ git init
$ git add app.py Procfile requirements.txt runtime.txt
$ git commit -m "initial commit"

# the below <unique-app-name> has to be unique across Heroku
# not just your own github, or your can just run `heroku create`
# to let Heroku give it a name instead

$ heroku create <unique-app-name>
$ git push heroku master

$ heroku ps:scale web=1
$ heroku open
```

A browser should have been opened to demonstrate our app hosted on Heroku!

### Next step: move from development to production

Currently we are using Flask's built-in web server to test out things. This default web server configures a lot of things for us so we can focus on the app backend development and don't need to worry about other stuff. This is good for fast prototyping.

But once we finish development and move towards production the default server's insufficiency appears as a problem. For example, this default web server can only handle one client at a time and serve static files (HTML, CSS) relatively slow.

We have to replace it with something more production-ready.

Usually a production stack consists of three components: a web server that can handle multiple requests simultaneously and serve static files from disk quickly, and an application server that converts non-static-file requests into Python objects and passes on these requests, and finally the backend Flask or Django app.

Heroku implicitly provides us a web server therefore we only need to integrate an application server into our stack. In this tutorial we use [**Gunicorn**](https://gunicorn.org/) as our application server.

To use Gunicorn, we install the package and update the `requirements.txt`.

```
$ pip3 install gunicorn
$ pip3 freeze > requirements.txt
```

Next we modify the `Procfile`.

<div class="codeblock-label">Procfile</div>

```
web: gunicorn 'app:factory()'
```

Gunicorn expects to get a Flask instance in the format of `<module name>:<Flask instance>`. Here, `app` is our module name and function `factory()` returns a Flask instance.

If we declare the flask instance as a global variable `myapp` within `app.py`, our command in `Procfile` will become `web: gunicorn app:myapp`. Note the parentheses are omitted in this case.

Now, we just need to push our updates onto Heroku and we are all set.

```
$ git add Procfile requirements.txt
$ git commit -m "integrate gunicorn into the stack"
$ git push heroku master
$ heroku open
```

Congratulations! Our app on Heroku has moved one more step towards production.

### References

- [Getting Started on Heroku with Python](https://devcenter.heroku.com/articles/getting-started-with-python)
- [Why use Nginx? Flask, Django, ROR, NodeJS are not Production Server.](https://medium.com/analytics-vidhya/why-use-nginx-for-flask-django-ror-d31a00de2141)
- [Running Gunicorn](https://docs.gunicorn.org/en/stable/run.html)
