import { MDC } from './mdc';

export class Goodmoves {
  mdc: MDC = new MDC();

  constructor(firebaseConfig: any) {
    this.mdc.initialise();
  }
}
