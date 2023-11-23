import { Liquid } from 'liquidjs';
import path from 'path';

const engine = new Liquid({
  extname: '.liquid',
  root: path.join(__dirname, 'templates'),
});

export default engine;
