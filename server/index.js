const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Route test đơn giản
app.get('/', (req, res) => {
  res.json({ message: 'Backend MERN Shopping Online đang chạy!' });
});

app.get('/shoppingonline', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Mount API admin
const adminRouter = require('./api/admin');
app.use('/api/admin', adminRouter);

// apis
app.use('/api/customer', require('./api/customer.js'));

// Kết nối MongoDB
require('./utils/MongooseUtil');

// ================= DEPLOYMENT =================
const path = require('path');

// admin static
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));

// ❌ bỏ app.get('/admin/*')
// ✅ dùng fallback này
app.use('/admin', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build/index.html'));
});

// customer static
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));

// ❌ bỏ app.get('*')
// ✅ dùng fallback này
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build/index.html'));
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});