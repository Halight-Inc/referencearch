const express = require('express');
const app = express();
const port = process.env.PORT || 80;

app.use(express.static('build'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});