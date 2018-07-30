const express = require('express');
const router = express.Router();
const traderManager = require('../crypto/traderManager');

router.get('/', (req, res) => {
    res.send('api started');
});

router.get('/getDefaultConfig', (req, res) => {    
    res.status(200).json(traderManager.getDefaultTraderConfig());
});

router.post('/start', (req, res) => {
  traderManager.startTrader(req.body);
  res.send('trader started');
});

router.post('/stop', (req, res) => {
    traderManager.stopTrader();
    res.send('trader will stop soon');
});

/* GET available currencies */
router.get('/currencies', (req, res) => {
    traderManager.getCurrenciesPromise()
    .then(x => res.status(200).json(x))
    .catch(error => res.status(500).send(error));
});

/* GET available products */
router.get('/products', (req, res) => {
    traderManager.getProductsPromise()
    .then(x => res.status(200).json(x))
    .catch(error => res.status(500).send(error));
});

/* GET available accounts */
router.get('/accounts', (req, res) => {
    traderManager.getAccountsPromise()
    .then(x => res.status(200).json(x))
    .catch(error => res.status(500).send(error));
});

/* POST buy order */
router.post('/buy', (req, res) => {
    try {
        let id = global.trader.buy(req.body);
        res.status(200).json({ id });
    } catch (error) {
        res.status(500).send(e);
    }
});

/* POST sell order */
router.post('/sell', (req, res) => {
    try {
        let id = global.trader.sell(req.body);
        res.status(200).json({ id });
    } catch (error) {
        res.status(500).send(e);
    }
});

module.exports = router;