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
