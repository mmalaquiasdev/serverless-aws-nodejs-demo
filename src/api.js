const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();

app.use(bodyParser.json({ strict: false }));

const { USERS_TABLE } = process.env;

const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.get('/', (req, res) => {
  console.log(req);
  res.send('Welcome to Bahia!!');
});

app.get('/users/:userId', (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(404).json({ error: 'Could not get user' });
    }

    if (result.Item) {
      const { userId, name } = result.Item;
      res.json({
        data: { userId, name },
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

app.post('/users', (req, res) => {
  const { userId, name } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId,
      name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(`Table Name: ${params.TableName}`);
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ userId, name });
  });
});

module.exports = app;
