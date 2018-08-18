const express = require('express');
const traderManager = require('../crypto/traderManager');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('api started');
});

router.get('/getDefaultConfig', (req, res) => {
  traderManager.getDefaultTraderConfig()
    .then(x => res.status(200).json(x))
    .catch(error => res.status(500).send(error));
});

router.post('/start', (req, res) => {
  traderManager.startTrader(req.body);
  res.send('trader started');
});

router.post('/stop', (req, res) => {
  traderManager.stopTrader();
  res.send('trader will stop soon');
});

router.get('/status', (req, res) => {
  res.send(traderManager.getTraderStatus());
});

/* GET available currencies */
router.get('/currencies', (req, res) => {
  traderManager.getCurrencies()
    .then(x => res.status(200).json(x))
    .catch(error => res.status(500).send(error));
});

/* GET available products */
router.get('/products', (req, res) => {
  traderManager.getProducts()
    .then(x => res.status(200).json(x))
    .catch(error => res.status(500).send(error));
});

/* GET available accounts */
router.get('/accounts', (req, res) => {
  traderManager.getAccounts()
    .then(x => res.status(200).json(x))
    .catch(error => res.status(500).send(error));
});

module.exports = router;
