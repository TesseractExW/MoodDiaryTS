import express from 'express';
import cookieParser from 'cookie-parser';

import login from '@auth/login';
import logout from '@auth/logout';
import refresh from '@auth/refresh';
import verification from '@auth/verification';

import db from '@config/database';

db.Connect();

const app : express.Express = express();
app.use(cookieParser());

// routes
app.post('/auth/login', login);
app.post('/auth/logout', verification, logout);
app.post('/auth/refresh', refresh);