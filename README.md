![Logo](https://hackkosice.com/images/logo.svg)


# HK Advent 2021

24 coding challenges during Advent time from Hack Kosice

![Code size](https://img.shields.io/github/languages/code-size/hackkosice/hk-advent)
![Version](https://img.shields.io/github/package-json/v/hackkosice/hk-advent)
![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A%2F%2Fxmas.hackkosice.com)
![Last commit](https://img.shields.io/github/last-commit/hackkosice/hk-advent)

## Authors

- [@dmatis2](https://www.github.com/dmatis2)


## Tech Stack

**Client:** Svelte, Firebase Hosting, Bcrypt

**Server:** Node.js, Express, JWT, SQLite3


## Run Locally

Clone the project

```bash
  git clone https://github.com/hackkosice/hk-advent
```

Go to the project directory

```bash
  cd hk-advent
```

Install dependencies

```bash
  npm i
```

Start the server

```bash
  npm run dev
```


## Deployment

GitHub Actions are set up to deploy after merge to `main` and push to `develop`

To deploy production version of this project manually, run

```bash
  firebase login
  npm run build
  firebase deploy
```

To deploy develop version of this project manually, run

```bash
  firebase login
  npm run build
  firebase hosting:channel:deploy dev
```

## FAQ

#### Can I contribute?

Sure, submit your task in Notion


## Feedback

If you have any feedback, please reach out to me at dmatis@hackkosice.com


