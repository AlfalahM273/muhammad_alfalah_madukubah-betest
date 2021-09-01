# BE-Test

## Starting
1. Run `npm install`
2. Copy `.env.example` to `.env` and fill it accordingly
3. If you need to create `SECRET_KEY`, you can run `require('crypto').randombytes(64).tostring('hex')` on Node CLI
4. Run `npm run dev`
    > If you face issue with nodemon, please install it first `npm install --global nodemon`
