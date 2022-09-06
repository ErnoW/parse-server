import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import { parseServer } from './parseServer';
import { errorHandler } from './middlewares/errorHandler';
import config from './config';
import { apiRouter } from './apiRouter';
import path from 'path';

const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(`/server`, parseServer);
app.use('/api', apiRouter);
app.use(errorHandler);

app.use(express.static(path.join(__dirname, '../../react-client/build')));

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${config.APP_NAME} is running on port ${config.PORT}`);
});
