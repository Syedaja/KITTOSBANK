const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your Angular app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // You may need this if you're dealing with cookies or sessions
};

// Enable CORS using the configured options
app.use(cors(corsOptions));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Syedraja@PASSWORD',
  database: 'bank',
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('Syedraja@PASSWORD'),
  },
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});
// Deposit route
app.post('/deposit', (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const depositQuery = 'UPDATE account SET balance = balance + ? WHERE ACCOUNTNUMBER= ?';
  const insertTransactionQuery = 'INSERT INTO transaction_history2 (user_id, transaction_type, amount) VALUES (?, ?, ?)';

  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error starting transaction' });
    }

    db.query(depositQuery, [amount, userId], (err, result) => {
      if (err) {
        console.error(err);
        return db.rollback(() => {
          res.status(500).json({ message: 'Error processing deposit' });
        });
      }

      db.query(insertTransactionQuery, [userId, 'Deposit', + amount], (err) => {
        if (err) {
          console.error(err);
          return db.rollback(() => {
            res.status(500).json({ message: 'Error recording deposit transaction' });
          });
        }

        db.commit((err) => {
          if (err) {
            console.error(err);
            return db.rollback(() => {
              res.status(500).json({ message: 'Error committing transaction' });
            });
          }
          

          res.json({ message: 'Deposit successful' });
        });
      });
    });
  });
});

// Withdrawal route
app.post('/withdraw', (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const withdrawalQuery = 'UPDATE account SET balance = balance - ? WHERE ACCOUNTNUMBER = ?';
  const insertTransactionQuery = 'INSERT INTO transaction_history2 (user_id, transaction_type, amount) VALUES (?, ?, ?)';

  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error starting transaction' });
    }

    db.query(withdrawalQuery, [amount, userId], (err, result) => {
      if (err) {
        console.error(err);
        return db.rollback(() => {
          res.status(500).json({ message: 'Error processing withdrawal' });
        });
      }

      db.query(insertTransactionQuery, [userId, 'Debited', - amount], (err) => {
        if (err) {
          console.error(err);
          return db.rollback(() => {
            res.status(500).json({ message: 'Error recording withdrawal transaction' });
          });
        }

        db.commit((err) => {
          if (err) {
            console.error(err);
            return db.rollback(() => {
              res.status(500).json({ message: 'Error committing transaction' });
            });
          }

          res.json({ message: 'Withdrawal successful' });
        });
      });
    });
  });
});

// Transfer route
app.post('/api/transfer', (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  if (!fromUserId || !toUserId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }
  if (fromUserId === toUserId) {
    return res.status(400).json({ message: 'Cannot transfer money to the same user' });
  }

  // Check balance of the sender (fromUserId)
  const checkBalanceQuery = 'SELECT balance FROM account WHERE ACCOUNTNUMBER = ?';

  db.query(checkBalanceQuery, [fromUserId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error checking balance' });
    }

    const fromUserBalance = results[0].balance;

    if (fromUserBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance for transfer' });
    }

    // Start a database transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error starting transaction' });
      }

      // Deduct the amount from the sender (fromUserId)
      const deductQuery = 'UPDATE account SET balance = balance - ? WHERE ACCOUNTNUMBER = ?';
      db.query(deductQuery, [amount, fromUserId], (err) => {
        if (err) {
          console.error(err);
          db.rollback(() => {
            res.status(500).json({ message: 'Error deducting from the sender' });
          });
          return;
        }

        // Add the amount to the receiver (toUserId)
        const addQuery = 'UPDATE account SET balance = balance + ? WHERE ACCOUNTNUMBER = ?';
        db.query(addQuery, [amount, toUserId], (err) => {
          if (err) {
            console.error(err);
            db.rollback(() => {
              res.status(500).json({ message: 'Error adding to the receiver' });
            });
            return;
          }

          // Record the transfer transaction for the sender
          const insertTransactionQuery1 = 'INSERT INTO transaction_history2 (user_id, transaction_type, amount) VALUES (?, ?, ?)';
          db.query(insertTransactionQuery1, [fromUserId, 'Money Transfer(Debited)'+' '+'Sent to AC'+' '+ toUserId, -amount], (err) => {
            if (err) {
              console.error(err);
              db.rollback(() => {
                res.status(500).json({ message: 'Error recording transfer transaction for sender' });
              });
              return;
            }

            // Record the transfer transaction for the receiver
            const insertTransactionQuery2 = 'INSERT INTO transaction_history2 (user_id, transaction_type, amount) VALUES (?, ?, ?)';
            db.query(insertTransactionQuery2, [toUserId, 'Money Transfer(Credited)'+' '+'Received From Ac'+' '+ fromUserId, +amount], (err) => {
              if (err) {
                console.error(err);
                db.rollback(() => {
                  res.status(500).json({ message: 'Error recording transfer transaction for receiver' });
                  
                });
                return;
              }

              // Commit the transaction if all steps are successful
              db.commit((err) => {
                if (err) {
                  console.error(err);
                  db.rollback(() => {
                    res.status(500).json({ message: 'Error committing transaction' });
                  });
                  return;
                }

                res.json({ message: 'Transfer successful' });
              });
            });
          });
        });
      });
    });
  });
});

// Transaction history route
app.get('/transaction-history/:userId', (req, res) => {
  const userId = req.params.userId;
  const getTransactionHistoryQuery = 'SELECT * FROM transaction_history2 WHERE user_id = ?';

  db.query(getTransactionHistoryQuery, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching transaction history' });
    }
    res.json(results);
  });
});
app.post('/register', (req, res) => {
  const userData = req.body.data; // Assuming you are sending user data as 'data' in the request body

  // Check if the email already exists
  const checkEmailQuery = 'SELECT 1 FROM account WHERE email = ?';

  db.query(checkEmailQuery, [userData.email], (checkErr, checkResults) => {
    if (checkErr) {
      console.error(checkErr);
      return res.status(500).json({ message: 'Error checking email existence' });
    }

    // If the email already exists, return a response indicating the duplicate entry
    if (checkResults.length > 0) {
      return res.json({ message: 'User with this email already exists' });
    }

    // If the email doesn't exist, proceed with the INSERT operation
    const insertQuery = `
      INSERT INTO account (name, email, password, confirmpassword, fathersname, adhar_number, education, city, state, age, mobilenumber, balance)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM account WHERE email = ?)
    `;

    const values = [
      userData.name,
      userData.email,
      userData.password,
      userData.confirmpassword,
      userData.fathersname,
      userData.adhar_number,
      userData.education,
      userData.city,
      userData.state,
      userData.age,
      userData.mobilenumber,
      userData.balance,
      userData.email,  // Add the email again for the WHERE clause
    ];

    db.query(insertQuery, values, (insertErr, result) => {
      if (insertErr) {
        console.error(insertErr);
        res.status(500).json({ message: 'Error registering user' });
      } else {
        res.json({ message: 'User registered successfully' });
      }
    });
  });
});

///Acc Account Random number
app.post('/storeAccountNumber', (req, res) => {
  const { accountNumber } = req.body;

  // Assuming 'yourTable' is the name of your table
  const query = `INSERT INTO accounts (account_number) VALUES (${accountNumber})`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error storing account number:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Account number stored successfully.');
      res.status(200).json({ message: 'Account number stored successfully.' });
    }
  });
});

// Define your API route directly on the app object
app.get('/api/user/:email', (req, res) => {
  const email = req.params.email;

  // Query the database to retrieve user data based on the email
  const query = 'SELECT * FROM account WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        // User found, return user data as JSON
        const userData = results[0];
        res.json(userData);
      } else {
        // User not found
        res.status(404).json({ error: 'User not found' });
      }
    }
  });
});
// API endpoint to fetch user data by email
app.get('/api/dashboard', (req, res) => {
  const userEmail = req.query.email; // Retrieve the email from the query parameters
  const sql = `SELECT * FROM account WHERE email = ?`;

  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const userData = results[0];
        res.json(userData);
      }
    }
  });
});

// get single data 
app.get('/user/:email',(req,res)=>{
      
  let email = req.params.email;
  let qr = `select *from account where email = ${email}`;
  db.query(qr,(err,result)=>{
      if(err){
          console.log(err);
      }
      else{
          res.send({
          messsage:"get single data",
          data:result
          });
      }
  })
})

// get single data
app.get('/api/data/:email', (req, res) => {
  const email = req.params.email;
  const query = 'SELECT * FROM account WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    const data = results[0];
    res.json(data);
  });
});
// Create an API route to fetch transactions for a specific user
app.get('/api/datatransaction/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `SELECT * FROM transaction_history2 WHERE user_id = ?`;
  db.query(query,[userId], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'An error occurred.' });
      return;
    }
    res.json(results);
  });
});
// Define a route to fetch data from the MySQL table
app.get('/api/alldata', (req, res) => {
  const query = 'SELECT * FROM account'; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});
// Define a route to fetch data from the MySQL table
app.get('/api/transaction_history1', (req, res) => {
  const query = 'SELECT * FROM transaction_history2'; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});


// API endpoint to check Aadhar and Mobile in the database
// API endpoint to check Aadhar and Mobile in the database
app.post('/check', (req, res) => {
  const adhar_number = req.body.adhar_number;
  const mobilenumber = req.body.mobilenumber;

  // Check Mobile in the database
  const mobileQuery = 'SELECT * FROM account WHERE mobilenumber = ?';
  db.query(mobileQuery, [mobilenumber], (err, mobileResults) => {
    if (err) throw err;

    // Send response based on the database check
    if (mobileResults.length > 0) {
      res.json({ error: 'duplicateMobile', message: 'Mobile number already exists in the database' });
    } else {
      res.json({ success: true });
    }
  });
});
app.post('/check', (req, res) => {
  
  const mobilenumber = req.body.mobilenumber;

  // Check Mobile in the database
  const mobileQuery = 'SELECT * FROM account WHERE mobilenumber = ?';
  db.query(mobileQuery, [mobilenumber], (err, mobileResults) => {
    if (err) throw err;

    // Send response based on the database check
    if (mobileResults.length > 0) {
      res.json({ error: 'duplicateMobile', message: 'Mobile number already exists in the database' });
    } else {
      res.json({ success: true });
    }
  });
});





 






















app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// // Import Nodemailer
// const nodemailer = require('nodemailer');

// // ... (your existing code)

// // Deposit route
// app.post('/deposit', (req, res) => {
//   // ... (your existing deposit logic)

//   // Fetch the account holder's email from the database
//   const getEmailQuery = 'SELECT email FROM account WHERE id = ?';

//   db.query(getEmailQuery, [userId], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error fetching email' });
//     }

//     const userEmail = result[0].email;

//     // Compose the email message
//     const emailMessage = `Your account has been credited with ${amount}`;

//     // Send the email
//     sendEmail(userEmail, 'Transaction Notification', emailMessage);

//     res.json({ message: 'Deposit successful' });
//   });
// });

// // Similar modifications for the withdrawal route

// // Function to send email using Nodemailer
// function sendEmail(to, subject, text) {
//   const transporter = nodemailer.createTransport({
//     service: 'your_email_service_provider', // e.g., Gmail
//     auth: {
//       user: 'your_email@example.com', // your email address
//       pass: 'your_email_password', // your email password or app password
//     },
//   });

//   const mailOptions = {
//     from: 'your_email@example.com', // your email address
//     to,
//     subject,
//     text,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Email error:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// }

// // ... (your other routes)
