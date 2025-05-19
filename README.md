# Notes
A fullstack notes saving app.

## Demo

## How to run?

## Backend Server

- Create a `config.json` in 'notes\backend\config' folder.

### `config.json`

```json
{
    "gmail_info":{
        "email": "EMAIL-ID-HERE",
        "password": "APP-PASSWORD-HERE"
    },
    "otp_secret": "OTP-SECRET",
    "otp_validation_time": 900,
    "login_secret": "LOGIN-SECRET"
}
```

```bash
cd backend
npm install
npm start # make run mongodb server is up and running
```

## FrontEnd Development Server

- Change backend api url in `config.json` at `src/config.json`.

```bash
cd notes
npm install
npm run dev
```
