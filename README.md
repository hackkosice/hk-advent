# HK Advent

Created using React & Firebase

## Prerequisities

* create `src/config.js` with Firebase config object
* `node` and `npm` installed (or `yarn`)
* run `npm install` (or `yarn`)
* `firebase` installed locally (used to deploy via Firebase CLI)

## Development

* `npm start` (or `yarn start`) - development server starts on port 3000

## Deployment

* Login to Firebase using `firebase login` (on first run)
* Initialize project directory using `firebase init` (on first run)
* Build React app using `npm build` (or `yarn build`)
* Deploy `build/` to Firebase Hosting using `firebase deploy`