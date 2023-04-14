// CSC4402/server.js
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

app.use(express.json());

const con = mysql.createConnection({
  host: "fordsdb.duckdns.org",
  user: "root",
  password: "CSC4402",
  database: "db1"
});

app.get('/users', function(req, res) {
  con.query('SELECT * FROM users', function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});
// User registration
app.post('/users/register', (req, res) => {
  const { username, password } = req.body;
  const sql = "INSERT INTO users (username, password) VALUES (?)";
  con.query(sql, [[username, password]], (err, result) => {
    if (err) throw err;
    res.send({ message: 'User registered' });
  });
});

// User login
app.post('/users/login', (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  con.query(sql, [username, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const cashBalance = result[0].cash_balance;
      res.status(200).json({ message: 'Login successful', userId: result[0].id, cashBalance });
    } else {
      res.status(401).send({ message: 'Invalid username or password' });
    }
    
  });
});

// Updates user cash balance
app.post('/users/update-cash-balance', (req, res) => {
  const { username, cashBalance } = req.body;

  const sql = "UPDATE users SET cash_balance = ? WHERE username = ?";
  con.query(sql, [cashBalance, username], (err, result) => {
    if (err) {
      console.error('Error updating cash balance:', err);
      res.status(500).json({ message: 'Error updating cash balance' });
    } else {
      res.status(200).json({ message: 'Cash balance updated' });
    }
  });
});

// Fetch user cash balance
app.get('/users/:userId/cash-balance', (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT cash_balance FROM users WHERE id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});


// Fetch user data
app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM users WHERE id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

// // Fetch stock data
// app.get('/stocks', (req, res) => {
//   const sql = "SELECT * FROM stocks";
//   con.query(sql, (err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// });

// // Buy stock
// app.post('/user_stocks/buy', (req, res) => {
//   const { userId, stockId, shares, buyPrice } = req.body;
//   const sql = "INSERT INTO user_stocks (user_id, stock_id, shares, buy_price) VALUES (?)";
//   con.query(sql, [[userId, stockId, shares, buyPrice]], (err, result) => {
//     if (err) throw err;
//     res.send({ message: 'Stock purchased' });
//   });
// });

// // Sell stock
// app.post('/user_stocks/sell', (req, res) => {
//   const { userId, stockId, shares } = req.body;
//   const sql = "UPDATE user_stocks SET shares = shares - ? WHERE user_id = ? AND stock_id = ?";
//   con.query(sql, [shares, userId, stockId], (err, result) => {
//     if (err) throw err;
//     res.send({ message: 'Stock sold' });
//   });
// });

// // Set stop-loss order
// app.put('/user_stocks/stop_loss/:userStockId', (req, res) => {
//   const userStockId = req.params.userStockId;
//   const { stopLossPrice } = req.body;
//   const sql = "UPDATE user_stocks SET stop_loss_price = ? WHERE id = ?";
//   con.query(sql, [stopLossPrice, userStockId], (err, result) => {
//     if (err) throw err;
//     res.send({ message: 'Stop-loss order set' });
//   });
// });

// // Fetch user stocks
// app.get('/user_stocks/:userId', (req, res) => {
//   const userId = req.params.userId;
//   const sql = `SELECT user_stocks.id, user_stocks.stock_id, stocks.ticker, user_stocks.shares, user_stocks.buy_price, user_stocks.stop_loss_price
//                FROM user_stocks
//                JOIN stocks ON user_stocks.stock_id = stocks.id
//                WHERE user_stocks.user_id = ?`;
//   con.query(sql, [userId], (err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// });

// //Remove stop-loss order
// app.put('/user_stocks/remove_stop_loss/:userStockId', (req, res) => {
//   const userStockId = req.params.userStockId;
//   const sql = "UPDATE user_stocks SET stop_loss_price = NULL WHERE id = ?";
//   con.query(sql, [userStockId], (err, result) => {
//     if (err) throw err;
//     res.send({ message: 'Stop-loss order removed' });
//   });
// });


app.listen(port, function() {
  console.log('Server listening on port ' + port);
});
