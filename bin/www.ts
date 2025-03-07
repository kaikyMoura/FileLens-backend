import app from '../src/app';
import http from 'http';
import debugLib from 'debug';

const debug = debugLib('myapp:server');
const PORT = process.env.PORT || 5000;

const normalizePort = (val: string): number | string | boolean => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(PORT.toString());
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', (error: any) => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
  console.log(`Server is running on http://localhost:${port}`);
});