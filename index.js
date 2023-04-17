const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

class KeyValueServer {
  constructor(log, config) {
    this.log = log;
    this.port = config.port || 3003;
    this.database = config.database;

    // Create the database if it does not exist
    if (!fs.existsSync(this.database)) {
      this.log(`Creating database at ${this.database}`);
      const db = new sqlite3.Database(this.database);
      db.run('CREATE TABLE keyvalues (key TEXT PRIMARY KEY, value TEXT)');
      db.close();
    }

    // Start the server
    this.startServer();
  }

  startServer() {
    const app = express();
    app.use(bodyParser.json());

    app.post('/set', (req, res) => {
      const key = req.body.key;
      const value = req.body.value;

      const db = new sqlite3.Database(this.database);
      db.run('INSERT OR REPLACE INTO keyvalues (key, value) VALUES (?, ?)', [key, value], (err) => {
        if (err) {
          this.log(err.message);
          res.status(500).send('Error setting value');
        } else {
          this.log(`Set ${key} to ${value}`);
          res.status(200).send('OK');
        }
      });
      db.close();
    });

    app.get('/get/:key', (req, res) => {
      const key = req.params.key;

      const db = new sqlite3.Database(this.database);
      db.get('SELECT value FROM keyvalues WHERE key = ?', [key], (err, row) => {
        if (err) {
          this.log(err.message);
          res.status(500).send('Error getting value');
        } else if (!row) {
          this.log(`Key ${key} not found`);
          res.status(404).send('Key not found');
        } else {
          this.log(`Get ${key} = ${row.value}`);
          res.status(200).json({ value: row.value });
        }
      });
      db.close();
    });

    app.delete('/delete/:key', (req, res) => {
      const key = req.params.key;

      const db = new sqlite3.Database(this.database);
      db.run('DELETE FROM keyvalues WHERE key = ?', [key], function(err) {
        if (err) {
          this.log(err.message);
          res.status(500).send('Error deleting value');
        } else if (this.changes === 0) {
          this.log(`Key ${key} not found`);
          res.status(404).send('Key not found');
        } else {
          this.log(`Deleted ${key}`);
          res.status(200).send('OK');
        }
      });
      db.close();
    });

    http.createServer(app).listen(this.port, () => {
      this.log(`KeyValueServer listening on port ${this.port}`);
    });
  }

  getServices() {
    return [];
  }
}

module.exports = (homebridge) => {
  homebridge.registerAccessory('homebridge-keyvalue-server', 'KeyValueServer', KeyValueServer);
};
