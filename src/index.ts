import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import * as cors from 'cors';
const http = require('http');
import { Routes } from './routes';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  PORT,
  STAGE,
} from './config';

const isProduction = STAGE === 'prod';

createConnection({
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
  ssl: isProduction,
  extra: {
    ssl: isProduction ? { rejectUnauthorized: false } : null,
  },
})
  .then(async (connection) => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const server = http.createServer(app);
    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        route.middleware
          ? route.middleware
          : (_req, _res, next) => {
              next();
            },
        ...route.validation,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next,
          );
          if (result instanceof Promise) {
            result
              .then((resu) => {
                return resu;
              })
              .catch((error) => {
                return res.status(500).json({
                  message: 'Internal Error',
                  success: false,
                });
              });
          } else {
            return result;
          }
        },
      );
    });

    // setup express app here
    // ...

    // start express server
    server.listen(parseInt(PORT) || 4000);

    console.log(
      `Express server has started on port ${
        PORT || 4000
      } . Open http://localhost:${PORT || 4000} to begin`,
    );
  })
  .catch((error) => console.log(error));
