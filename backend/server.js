
//ben load env file qe ka api keys ect
require('dotenv').config();
const app = require('./src/app');

// porta ku ben run back server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});