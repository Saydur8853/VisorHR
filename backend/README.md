# VisorHR backend (Django)

1. Create and activate a virtualenv (example: `python -m venv .venv && .venv\Scripts\activate`).
2. Install dependencies: `pip install -r backend/requirements.txt`.
3. Copy `backend/.env.example` to `backend/.env` and set secrets plus MySQL connection values.
4. Ensure the MySQL database/user exist (see `database/README.md`).
5. Apply migrations: `python manage.py migrate`.
6. Run the dev server: `python manage.py runserver 0.0.0.0:8000`.

Static files will collect into `backend/staticfiles` when you run `collectstatic`.

## Auth endpoints (session-based JSON)

- `POST /api/auth/register/` body `{ "username": "", "password": "", "email": "" }`
- `POST /api/auth/login/` body `{ "username": "", "password": "" }`
- `POST /api/auth/logout/`

Note: the first registered user is automatically promoted to superuser/staff for bootstrapping.
