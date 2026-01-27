require("dotenv").config();
const app = require("./app");  // Import app từ app.js

const PORT = process.env.PORT || 5000;

// Lắng nghe và chạy ứng dụng
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
