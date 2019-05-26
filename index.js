import express from 'express';
import cors from 'cors';

import routes from './routes';

import { sequelize } from './models';

const app = express();
sequelize.sync();

app.use(cors());

app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/', routes);
app.use((err, req, res, next) => {
    const { status, code, message } = err;
    res.status(status || 500).json({ code: code || 'UNDEFINED_CODE', message });
});

app.listen(process.env.PORT || 3000);