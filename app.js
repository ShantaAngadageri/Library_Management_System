const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const Book = require('./models/Book');
const User = require('./models/User');

const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/libraryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


app.use(session({
  secret: 'librarySecretKey',
  resave: false,
  saveUninitialized: false
}));


function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.get('/', async (req, res) => {
  const books = await Book.find();
  res.render('home', { books });
});

app.get('/dashboard', requireLogin, async (req, res) => {
  const books = await Book.find();
  res.render('index', { books });
});

app.get('/add', requireLogin, (req, res) => {
  res.render('add');
});

app.post('/add', requireLogin, upload.single('bookFile'), async (req, res) => {
  const { title, author } = req.body;
  let filePath = '';
  if (req.file) {
    filePath = '/uploads/' + req.file.filename;
  }
  await Book.create({ title, author, filePath });
  res.redirect('/dashboard');
});

app.post('/delete/:id', requireLogin, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
});

app.get('/view/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book && book.filePath) {
    res.redirect(book.filePath);
  } else {
    res.status(404).send('File not found');
  }
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    return res.render('login', { error: 'Invalid username or password' });
  }

  req.session.userId = user._id;
  res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

app.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render('signup', { error: 'Username already taken' });
  }

  const user = new User({ username, password });
  await user.save();
  req.session.userId = user._id;
  res.redirect('/');
});

app.get('/forgot', (req, res) => {
  res.render('forgot');
});

app.post('/forgot', (req, res) => {
  res.send('Password recovery instructions sent (placeholder)');
});

app.get('/register', async (req, res) => {
  const exists = await User.findOne({ username: 'admin' });
  if (!exists) {
    const user = new User({ username: 'admin', password: 'admin123' });
    await user.save();
    res.send('Admin user created: admin / admin123');
  } else {
    res.send('Admin already exists.');
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
