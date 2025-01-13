#!/usr/bin/env bash

set -o errexit

py - m pip install -r requirements.txt -or python -m pip install -r requirements.txt

py manage.py collectstatic --noinput -or python manage.py collectstatic
py manage.py migrate -or python manage.py migrate