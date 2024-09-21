# Tip Manager

The "Tip Manager" app allows users to calculate tips and store the calculations in a database. Users can sign up, log in, calculate tips, and retrieve tip.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Application](#running-the-application)
  
## Features

- User authentication (signup, login)
- Tip calculation and history
- File uploads (profile pictures)
- Date range filtering for tip history
- Responsive design

## Technologies Used

- FastAPI for the backend
- React.js for the frontend
- PostgreSQL
- Docker for containerization
- SQLAlchemy for database interactions
- Passlib for password hashing
- JWT for authentication

## Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-name.git
   cd project-name

## Running the Application

## Docker Commands

### Build Docker Images

To build the Docker images for your application, run:
```bash
docker-compose build
```

### Build Docker Images

To start all the services defined in your docker-compose.yml file, use:

```bash
docker-compose up
```

### Stop the Application
To stop the running containers, press CTRL+C or run:

```bash
docker-compose down
```

