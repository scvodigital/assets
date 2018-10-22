import "@babel/polyfill";
import 'leaflet';
import 'mapbox.js';
import { default as Headroom } from 'headroom.js';
import * as mdc from 'material-components-web';
import { ComponentsInitialiser } from '../../lib/components-initialiser';

export class SCVO {
  constructor(firebaseConfig) {
    this.componentsInitialiser = new ComponentsInitialiser({
      themes: {
        primary: {
          background: '#42842A',
          text: '#ffffff'
        },
        secondary: {
          background: '#e0e0e0',
          text: '#000000'
        },
        success: {
          background: '#679c54',
          text: '#000000'
        },
        warning: {
          background: '#A95E1E',
          text: '#ffffff'
        },
        error: {
          background: '#A9201E',
          text: '#ffffff'
        }
      },
      displayModes: [
        { name: 'mobile', min: 0, max: 599 },
        { name: 'tablet', min: 600, max: 959 },
        { name: 'desktop', min: 960, max: 20000 }
      ]
    });
    this.componentsInitialiser.initialise();
   
    // Headroom
    var header = document.querySelector("header.mdc-toolbar");
    var headroom  = new Headroom(header, {
      "offset": 138,
      "tolerance": 5
    });
    headroom.init();
  }
}