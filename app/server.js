const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger/swagger.yaml');

const app = express();
const port = 5000;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const ItemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', ItemSchema);

app.use(express.json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/items', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.status(201).send(item);
});

app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.status(200).send(items);
});

app.get('/items/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).send();
  }
  res.status(200).send(item);
});

app.put('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    return res.status(404).send();
  }
  res.status(200).send(item);
});

app.delete('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).send();
  }
  res.status(200).send(item);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
