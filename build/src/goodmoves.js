"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdc_1 = require("./mdc");
class Goodmoves {
    constructor(firebaseConfig) {
        this.mdc = new mdc_1.MDC();
        this.mdc.initialise();
    }
}
exports.Goodmoves = Goodmoves;
//# sourceMappingURL=goodmoves.js.map