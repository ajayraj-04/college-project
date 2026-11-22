# QuickSell - Online Waste Product Selling Platform

A simple website where sellers list unused and waste products, and other people browse, search and contact the seller. (No online buying or payment.)

## Technology

- Frontend: HTML, CSS, JavaScript, Bootstrap 5 (with EJS pages)
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Extra packages: multer (image upload), bcryptjs (password hash), express-session (login)

## How to run

1. Install Node.js and MongoDB. Start MongoDB (it runs as a Windows service after install).
2. Open this folder in VS Code. Open the terminal and run:

```
npm install
npm run seed
npm start
```

3. Open http://localhost:3000 in Chrome.

`npm run seed` adds 6 sample products and a demo seller. Login: **demo@quicksell.com / 123456**. Run it only if you want sample data.

## Folder structure

```
server.js            starts the website, connects to MongoDB
seed.js              adds sample data
models/              User.js, Product.js  (database shape)
routes/              auth.js (register/login/logout), products.js (everything about products)
views/               EJS pages. partials/ has navbar, footer, card, form
public/              css, js, images, uploads (seller photos)
```

## Pages

| Page | Address | Who can open |
| --- | --- | --- |
| Home | / | Everyone |
| Browse + search | /browse | Everyone |
| Product details | /products/:id | Everyone |
| Register, Login | /register, /login | Everyone |
| Add product | /products/add | Logged-in seller |
| My products (edit, delete, mark as sold) | /my-products | Logged-in seller |
