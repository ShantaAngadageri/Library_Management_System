# 📚 Library Management App

A basic CRUD (Create, Read, Delete) application built using **Node.js**, **Express**, **MongoDB**, and **EJS** templating.

## 🚀 Features

- 📖 Add new books
- 📋 View all books
- ❌ Delete a book

## 🛠️ Tech Stack

- Node.js
- Express
- MongoDB (via Mongoose)
- EJS (Templating Engine)

## 📂 Folder Structure

```
library-app/
│
├── models/
│   └── Book.js
│
├── views/
│   ├── index.ejs
│   └── add.ejs
│
├── public/
│   └── style.css (optional)
│
├── app.js
├── package.json
└── README.md
```

## ⚙️ Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-username/library-app.git
cd library-app
```

2. Install dependencies:
```bash
npm install
```

3. Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017`.

4. Run the app:
```bash
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

## 📄 License

MIT License
