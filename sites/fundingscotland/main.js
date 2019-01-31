import * as firebase from 'firebase/app';
import 'firebase/auth';
import "@babel/polyfill";
import { default as Headroom } from 'headroom.js';
import * as mdc from 'material-components-web';
import { ComponentsInitialiser } from '../../lib/components-initialiser';

import * as cookieInfoScript from '../../lib/cookie-info-script';

window.firebase = firebase;

export class FundingScotland {
  constructor(firebaseConfig) {
    this.firebaseConfig = firebaseConfig;
    this.app = firebase.initializeApp(this.firebaseConfig);

    this.displayMode = null;
    this.displayModes = [
      { name: 'mobile', min: 0, max: 599 },
      { name: 'tablet', min: 600, max: 959 },
      { name: 'desktop', min: 960, max: 20000 }
    ];

    this.ie = navigator.appName.indexOf('Microsoft') > -1 || navigator.userAgent.indexOf('Trident') > -1;
    this.occasionalDrawers = Array.from(document.querySelectorAll('.mdc-drawer--occasional')).map(el => {
      return {
        element: el,
        mdc: null
      };
    });

    $(window).on('resize', () => {
      this.windowResized();
    });
    this.windowResized();

    this.componentsInitialiser = new ComponentsInitialiser({
      themes: {
        primary: {
          background: '#178737',
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
      displayModes: this.displayModes
    });
    this.componentsInitialiser.initialise();

    // Headroom
    var header = document.querySelector("header.top-bar-stuck");
    var headroom  = new Headroom(header, {
      "offset": 138,
      "tolerance": 5
    });
    headroom.init();

    const ci = new cookieinfo();
    ci.options.message = "We use cookies to track anonymous usage statistics and do not collect any personal information that can be used to identify you. By continuing to visit this site you agree to our use of cookies.";
    ci.options.fontFamily = "'Open Sans',Helvetica,Arial,sans-serif";
    ci.options.bg = "#fff";
    ci.options.link = "#178737";
    ci.options.divlink = "#fff";
    ci.options.divlinkbg = "#178737";
    ci.options.position = "bottom";
    ci.options.acceptOnScroll = "true";
    ci.options.moreinfo = "/cookies";
    ci.options.cookie = "CookieInfoScript";
    ci.options.textAlign = "left";
    ci.run();

    this.$hideFundDialog = $('#hide-fund-dialog');
    this.hideFundDialog = new mdc.dialog.MDCDialog(this.$hideFundDialog[0]);
    $('[data-hide-fund-id]').on('click', (evt) => {
      const $el = $(evt.currentTarget);
      const id = $el.data('hide-fund-id');
      const redirect = $el.data('hide-fund-redirect');
      const name = $el.data('hide-fund-name');

      $('#hide-fund-dialog-id').val(id);
      $('#hide-fund-dialog-redirect').val(redirect);
      $('#hide-fund-dialog-name').text(name);

      this.hideFundDialog.open();
    });
  }

  windowResized() {
    var width = $(window).width();
    var newDisplayMode = null;
    this.displayModes.forEach(function(mode) {
      if (width >= mode.min && width < mode.max) {
        newDisplayMode = mode.name;
      }
    });
    if (newDisplayMode !== this.displayMode) {
      this.displayMode = newDisplayMode;
      this.displayModeChanged();
    }
    this.fie();
  }

  displayModeChanged() {
    this.occasionalDrawers.forEach(od => {
      var menuButton = $(od.element).data('menu-button');
      if (this.displayMode === 'desktop') {
        if (od.mdc) {
          od.mdc.destroy();
        }
        $(od.element).removeClass('mdc-drawer--modal');
        $(menuButton).off('click');
      } else {
        $(od.element).addClass('mdc-drawer--modal');
        od.mdc = mdc.drawer.MDCDrawer.attachTo(od.element);
        $(menuButton).on('click', () => { od.mdc.open = !od.mdc.open; });
      }
    });
  }

  fie() {
    if (!this.ie) return;
    $('.mdc-drawer--occasional .mdc-drawer__drawer').each(function(i, o) {
      var $o = $(o);
      var parentHeight = $o.parent().height();
      $o.css('height', parentHeight);
    });
  }

  setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; secure";
  }

  getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

  disable(elements, disable) {
    disable = typeof disable === 'undefined' ? true : disable;
    for (var e = 0; e < elements.length; ++e) {
      var element = elements[e];
      var opacity = disable ? 0.5 : 1;
      $(element).prop('disabled', disable).css('opacity', opacity);
    }
  }

  snackbarShow(options) {
    console.log('DEPRECATED SNACKBARSHOW CALLED:', arguments);
  }
}