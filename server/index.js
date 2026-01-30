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

// Kết nối MongoDB (giả sử bạn đã có phần này ở file khác)
require('./utils/MongooseUtil');  // nếu dùng file riêng

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});