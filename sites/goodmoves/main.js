const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

import { MDC } from '../../lib/mdc';

export class Goodmoves {
  constructor(firebaseConfig) {
    this.firebaseConfig = firebaseConfig;
    this.mdc = new MDC();
    this.mdc.initialise();
  }
}
