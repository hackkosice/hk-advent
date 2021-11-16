![Logo](https://hackkosice.com/images/logo.svg)


# HK Advent 2021 server

24 coding challenges during Advent time from Hack Kosice

## Authors

- [@dmatis2](https://www.github.com/dmatis2)


## Run Locally

Clone the project

```bash
  git clone https://github.com/hackkosice/hk-advent
```

Go to the project directory

```bash
  cd hk-advent/server
```

Install dependencies

```bash
  npm i
```

Specify server port and JWT secret in `.env`

```
PORT=
JWT_SECRET=
```

Start the server

```bash
  npm start
```


## Deployment

Deploy to our VPS and start using `pm2`

To deploy production version of this project manually, run

```bash
  ssh ...
  cd hk-advent/server
  pm2 start server.js
```

## Feedback

If you have any feedback, please reach out to me at dmatis@hackkosice.com