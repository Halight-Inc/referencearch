import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 80;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'build')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});