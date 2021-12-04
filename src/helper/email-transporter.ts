import * as nodemailer from 'nodemailer';
import * as sendgridTransport from 'nodemailer-sendgrid-transport';
import { SEND_GRID_KEY } from '../config';

export const emailTransporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SEND_GRID_KEY,
    },
  }),
);
