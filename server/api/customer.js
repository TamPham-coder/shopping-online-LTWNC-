const express = require('express');
const router = express.Router();

// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');

// category
router.get('/categories', async function(req, res) {
const categories = await CategoryDAO.selectAll();
res.json(categories);
});

// product
router.get('/products/new', async function(req, res) {
const products = await ProductDAO.selectTopNew(3);
res.json(products);
});

router.get('/products/hot', async function(req, res) {
const products = await ProductDAO.selectTopHot(3);
res.json(products);
});

router.get('/products/category/:cid', async function(req, res) {
const _cid = req.params.cid;
const products = await ProductDAO.selectByCatID(_cid);
res.json(products);
});

// search product
router.get('/products/search/:keyword', async function(req, res) {
const keyword = req.params.keyword;
const products = await ProductDAO.selectByKeyword(keyword);
res.json(products);
});

// product detail
router.get('/products/:id', async function(req, res) {
const _id = req.params.id;
const product = await ProductDAO.selectByID(_id);
res.json(product);
});

module.exports = router;

// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

// daos
const CustomerDAO = require('../models/CustomerDAO');

// customer signup
router.post('/signup', async function(req, res) {
const username = req.body.username;
const password = req.body.password;
const name = req.body.name;
const phone = req.body.phone;
const email = req.body.email;
const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

if (dbCust) {
res.json({ success: false, message: 'Exists username or email' });
} else {
const now = new Date().getTime();
const token = CryptoUtil.md5(now.toString());

const newCust = {
username: username,
password: password,
name: name,
phone: phone,
email: email,
active: 0,
token: token
};

const result = await CustomerDAO.insert(newCust);

if (result) {
const send = await EmailUtil.send(email, result._id, token);
if (send) {
res.json({ success: true, message: 'Please check email' });
} else {
res.json({ success: false, message: 'Email failure' });
}
} else {
res.json({ success: false, message: 'Insert failure' });
}
}
});

// customer active
router.post('/active', async function(req, res) {
const _id = req.body.id;
const token = req.body.token;
const result = await CustomerDAO.active(_id, token, 1);
res.json(result);
});

// customer login
router.post('/login', async function(req, res) {
const username = req.body.username;
const password = req.body.password;

if (username && password) {
const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

if (customer) {
if (customer.active === 1) {
const token = JwtUtil.genToken();
res.json({ success: true, message: 'Authentication successful', token: token, customer: customer });
} else {
res.json({ success: false, message: 'Account is deactive' });
}
} else {
res.json({ success: false, message: 'Incorrect username or password' });
}

} else {
res.json({ success: false, message: 'Please input username and password' });
}
});

router.get('/token', JwtUtil.checkToken, function(req, res) {
const token = req.headers['x-access-token'] || req.headers['authorization'];
res.json({ success: true, message: 'Token is valid', token: token });
});

// myprofile
router.put('/customers/:id', JwtUtil.checkToken, async function(req, res) {
const _id = req.params.id;
const username = req.body.username;
const password = req.body.password;
const name = req.body.name;
const phone = req.body.phone;
const email = req.body.email;

const customer = { _id: _id, username: username, password: password, name: name, phone: phone, email: email };
const result = await CustomerDAO.update(customer);
res.json(result);
});