import dotenv from 'dotenv';
import path from 'path';

// must be imported first: other modules read process.env at import time
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});
