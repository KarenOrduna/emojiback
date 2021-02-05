const connection = require('./config');
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Here are the emoji definitions');
});

//see emoji
app.get('/api/emoji', (req, res) => {
  connection.query('SELECT * from emoji', (err, results) => {
    if (err) {
      res.status(500).send('No data');
    } else {
      res.status(200).json(results);
    }
  });
});

//emoji by id
app.get('/api/emoji/:id', (req, res) => {
  connection.query(
    'SELECT * from emoji WHERE id=?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('No data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//create emoji
app.post('/api/emoji', (req, res) => {
  const { title, genre, picture, artist } = req.body;
  connection.query(
    'INSERT INTO emoji(emoji, title, description) VALUES(?, ?, ?)',
    [title, genre, picture, artist],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error saving an emoji');
      } else {
        res.status(200).send('Successfully saved');
      }
    }
  );
});

//edit emoji
app.put('/api/emoji/:id', (req, res) => {
  const emojiId = req.params.id;
  const newEmoji = req.body;
  connection.query(
    'UPDATE emoji SET ? WHERE id = ?',
    [newEmoji, emojiId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating emoji');
      } else {
        res.status(200).send('Emoji updated successfully 🎉');
      }
    }
  );
});

//delete an emoji
app.delete('/api/emoji/:id', (req, res) => {
  const emojiId = req.params.id;
  connection.query('DELETE FROM emoji WHERE id = ?', [emojiId], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Not able to delete');
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
