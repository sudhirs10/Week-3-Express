# Week 3 Express Assignments

This repository contains my Week 3 Express.js assignments.

## Completed Tasks

### Assignment 1

- Created an Express server.
- Added Nodemon.
- Served static files from the `public` folder.

### Assignment 2

- Created models, controllers, and routes for cats and users.
- Added GET, POST, PUT, and DELETE routes.
- Tested the routes using REST Client.

### Assignment 3

- Installed Multer.
- Added cat image uploading.
- Tested the upload using Postman.

### Assignment 4

- Installed Sharp.
- Created middleware for thumbnails.
- Resized uploaded images to `160 x 160`.
- Saved thumbnails inside the `uploads` folder.

### Assignment 5

- Connected the Express API to a MySQL database.
- Used environment variables for database information.
- Changed cat and user models to use SQL queries.
- Added the owner’s name to cat responses.
- Added a route to get cats by user ID.
- Used a transaction when deleting a user and their cats.

### Assignment 6

- Hashed new passwords using bcrypt.
- Added login using username and password.
- Created JWT tokens after successful login.
- Added authentication middleware.
- Added a protected route for getting the logged-in user.
- Added ownership and role-based authorization.

## Authentication Rules

- Anyone can register as a regular user.
- Anyone can view cats and users, but passwords are not returned.
- A token is required to add, update, or delete a cat.
- A regular user can update and delete only their own cats.
- A regular user can update and delete only their own account.
- A regular user cannot change their role to admin.
- An admin can update or delete any cat or user.

## Install and Run

Install the packages:

```bash
npm install
```

Start the server:

```bash
npm run dev
```

Server address:

```text
http://127.0.0.1:3000
```

## Cat Routes

```text
GET     /api/v1/cats
GET     /api/v1/cats/:id
POST    /api/v1/cats
PUT     /api/v1/cats/:id
DELETE  /api/v1/cats/:id
```

## User Routes

```text
GET     /api/v1/users
GET     /api/v1/users/:id
POST    /api/v1/users
PUT     /api/v1/users/:id
DELETE  /api/v1/users/:id
```

For uploading a cat image in Postman, I used `form-data`. The file field name is `cat`.

The data are stored in arrays, so changes reset when the server restarts.

## Repository

https://github.com/sudhirs10/Week-3-Express
