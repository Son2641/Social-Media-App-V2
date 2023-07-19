# Social Media App

## Prerequisites

Before running the Social Media App, make sure you have the following software installed:

- [NodeJS](https://nodejs.org/en) - Javascript Runtime Environment
- [MongoDB](https://www.mongodb.com/) - NoSQL Database System
- [MongoDB Compass](https://www.mongodb.com/products/compass) (Optional) - GUI for MongoDB

## Getting Started

### Frontend

1. Navigate to the `frontend` directory

```sh
cd frontend
```

2. Install dependencies

```sh
npm install
```

3. Run the App

```sh
npm run dev
```

### Backend

1. Navigate to the `backend` directory

```sh
cd backend
```

2. Install dependencies

```sh
npm install
```

3. Run the App

```sh
npm run dev
```

## Environment

For both the frontend and backend, you need to set up the environment variables by following these steps:

1. In each project directory (`frontend` and `backend`), copy the `.env.example` file and rename it to `.env`

```sh
cp .env.example .env
```

> 💡 Make sure to navigate to the project folder first.

### Frontend

| Environment        | Description     | Default Value           |
| :----------------- | :-------------- | :---------------------- |
| `VITE_BACKEND_URL` | The Backend URL | `http://localhost:6001` |

### Backend

| Environment | Description          | Default Value                |
| :---------- | :------------------- | :--------------------------- |
| `PORT`      | The Application Port | `6001`                       |
| `MONGO_URL` | The MongoDB URI      | `mongodb://127.0.0.1/social` |
