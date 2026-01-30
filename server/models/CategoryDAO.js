require("../utils/MongooseUtil");
const Models = require("./Models");

const CategoryDAO = {
  // 1. Lấy danh sách tất cả Category
  async selectAll() {
    const query = {};
    const categories = await Models.Category.find(query).exec();
    return categories;
  },
  // 2. Thêm mới Category
  async insert(category) {
    const mongoose = require("mongoose");
    category._id = new mongoose.Types.ObjectId();
    const result = await Models.Category.create(category);
    return result;
  },
  // 3. Cập nhật Category
  async update(category) {
    const newvalues = { name: category.name };
    const result = await Models.Category.findByIdAndUpdate(
      category._id,
      newvalues,
      { new: true },
    );
    return result;
  },
  // 4. Xóa Category
  async delete(_id) {
    const result = await Models.Category.findByIdAndDelete(_id);
    return result;
  },
};
module.exports = CategoryDAO;