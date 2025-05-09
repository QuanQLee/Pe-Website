import { sendMail } from './utils/mailer.js';

sendMail({
  subject: 'Ping',
  html: '<b>Mailer works!</b>'
})
  .then(() => console.log('✔ sent'))
  .catch(err => console.error('✗ mail error:', err));
