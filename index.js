const connection = require('./config');
const express = require('express');
const app = express();
const port = 3000;

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Here are the albums');
});

//ALBUMS
//see albums
app.get('/api/albums', (req, res) => {
  connection.query('SELECT * from album', (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving data');
    } else {
      res.status(200).json(results);
    }
  });
});

//album by id
app.get('/api/albums/:id', (req, res) => {
  connection.query(
    'SELECT * from album WHERE id=?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error retrieving data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//create album
app.post('/api/albums', (req, res) => {
  const { title, genre, picture, artist } = req.body;
  connection.query(
    'INSERT INTO album(title, genre, picture, artist) VALUES(?, ?, ?, ?)',
    [title, genre, picture, artist],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error saving an album');
      } else {
        res.status(200).send('Successfully saved');
      }
    }
  );
});

//edit album
app.put('/api/albums/:id', (req, res) => {
  const albumId = req.params.id;
  const newAlbum = req.body;
  connection.query(
    'UPDATE album SET ? WHERE id = ?',
    [newAlbum, albumId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating an album');
      } else {
        res.status(200).send('Album updated successfully 🎉');
      }
    }
  );
});

//delete an album
app.delete('/api/albums/:id', (req, res) => {
  const albumId = req.params.id;
  connection.query('DELETE FROM album WHERE id = ?', [albumId], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Not able to delete');
    } else {
      res.sendStatus(200);
    }
  });
});

//TRACKSSS
// create song and assign to album

app.post('/api/albums/:id/tracks', (req, res) => {
  const { title, youtube_url, album_id } = req.body;
  connection.query(
    'INSERT INTO track(title, youtube_url, album_id) VALUES(?, ?, ?)',
    [title, youtube_url, album_id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error saving a song');
      } else {
        res.status(200).send('Successfully saved');
      }
    }
  );
});

// list songs from an album
app.get('/api/albums/:id/tracks', (req, res) => {
  connection.query(
    'SELECT * from track WHERE album_id=?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error retrieving data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// edit song from an album -- NE MARCHE PASSSS :@@@@@@
app.put('/api/albums/:id/tracks/:id', (req, res) => {
  const trackId = req.params.id;
  const newTrack = req.body;
  const albumId = req.params.album_id;
  connection.query(
    'UPDATE track SET ? WHERE album_id = ? AND WHERE id = ?',
    [newTrack, trackId, albumId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating the song');
      } else {
        res.status(200).send('song modified YES');
      }
    }
  );
});

//delete song
app.delete('/api/tracks/:id', (req, res) => {
  const trackId = req.params.id;
  connection.query('DELETE FROM track WHERE id = ?', [trackId], (err) => {
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
