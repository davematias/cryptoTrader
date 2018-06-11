const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('api started');
});

/* GET available currencies */
router.get('/currencies', (req, res) => {
    global.trader.getCurrenciesPromise()
    .then(x => res.status(200).json(x))
    .catch(error => res.status(500).send(error));
});

/* GET available products */
router.get('/products', (req, res) => {
    global.trader.getProductsPromise()
    .then(x => res.status(200).json(x))
    .catch(error => res.status(500).send(error));
});

/* GET available accounts */
router.get('/accounts', (req, res) => {
    global.trader.getAccountsPromise()
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
router.post('/buy', (req, res) => {
    try {
        let id = global.trader.sell(req.body);
        res.status(200).json({ id });
    } catch (error) {
        res.status(500).send(e);
    }    
});
  
module.exports = router;