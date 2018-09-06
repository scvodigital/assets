import { MDC } from '../../lib/mdc';

export class Goodmoves {
  constructor(firebaseConfig) {
    this.firebaseConfig = firebaseConfig;
    this.mdc = new MDC();
    this.mdc.initialise();
  }
}
