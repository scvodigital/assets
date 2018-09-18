import * as mdc from 'material-components-web';

import { ScreenSizeMonitor } from './screen-size-monitor';
import { AjaxButtonComponent } from './components/ajax-button';
import { AjaxFormComponent } from './components/ajax-form';
import { AnchoredMenuComponent } from './components/anchored-menu';
import { MapComponent } from './components/map';
import { SimpleMdeComponent } from './components/simple-mde';
import { TabBarComponent } from './components/tab-bar';
import { TypeaheadComponent } from './components/typeahead';
import { HorizontalScrollerComponent } from './components/horizontal-scroller';
import { SnackbarComponent } from './components/snackbar';

const $ = require('jquery');

window.mdc = mdc;

export class ComponentsInitialiser {
  constructor(options = {}) {
    this.options = {
      themes: {
        primary: {
          background: '#ffffff',
          text: '#000000'
        },
        secondary: {
          background: '#fafafa',
          text: '#000000'
        },
        success: {
          background: '#007700',
          text: '#ffffff'
        },
        warning: {
          background: '#aa6600',
          text: '#ffffff'
        },
        error: {
          background: '#880000',
          text: '#ffffff'
        }
      },
      displayModes: [
        { name: 'mobile', min: 0, max: 599 },
        { name: 'tablet', min: 600, max: 959 },
        { name: 'desktop', min: 960, max: 20000 }
      ]
    }
    $.extend(this.options, options);

    this.resizeMonitor = new ScreenSizeMonitor(this.options.displayModes);
    this.resizeMonitor.registerListener(this.resized.bind(this));
  }

  resized(displayMode) {
    console.log('RESIZED:', this, displayMode); 
  }

  initialise() {
    mdc.autoInit();

    // Think we just need the one global snackbar
    this.snackbar = new SnackbarComponent(this.options.themes);

    this.ajaxButtons = [];
    $('[data-ajax-button]').each((i, o) => {
      const ajaxButton = new AjaxButtonComponent(o, this.snackbar);
      this.ajaxButtons.push(ajaxButton);
    });

    this.tabBars = [];
    $('[data-tab-bar]').each((i, o) => {
      const tabBar = new TabBarComponent(o);
      tabBar.tabBar.listen("MDCTabBar:activated", this.redraw.bind(this));
      this.tabBars.push(tabBar);
    });

    this.simpleMdes = [];
    $('textarea[data-simple-mde]').each((i, o) => {
      const simpleMde = new SimpleMdeComponent(o);
      this.simpleMdes.push(simpleMde);
    });

    this.ajaxForms = [];
    $('form[data-ajax-form]').each((i, o) => {
      const ajaxForm = new AjaxFormComponent(o, this.snackbar);
      this.ajaxForms.push(ajaxForm);
    });

    $('[data-mdc-auto-init="MDCTextField"][novalidate]').each((i, o) => {
      var foundation = o.MDCTextField.foundation_;
      foundation.useCustomValidityChecking = true;
      $(o).find('input').on('blur', () => {
        o.MDCTextField.valid = true;
      });
    });

    this.anchoredMenus = [];
    $('[data-menu-trigger]').each((i, o) => {
      const anchoredMenu = new AnchoredMenuComponent(o);
      this.anchoredMenus.push(anchoredMenu);
    });

    // Dialog activator buttons
    $('[data-dialog-target]').each((i, o) => {
      var selector = $(o).attr('data-dialog-target');
      var dialogEl = $(selector)[0];
      $(o).on('click', function() {
        dialogEl.MDCDialog.show();
      });
    });

    // Temporary drawer buttons
    $('[data-drawer-target]').each((i, o) => {
      var selector = $(o).attr('data-drawer-target');
      var drawerEl = $(selector)[0];
      var drawerType = $(selector).attr('data-mdc-auto-init');
      if (drawerType) {
        $(o).on('click', function() {
          drawerEl[drawerType].open = !drawerEl[drawerType].open;
        });
      }
    });

    // Collapsibles
    $('[data-collapse-target]').off('click').on('click', (evt) => {
      // console.log('Collapse click:', evt);
      var $el = $(evt.currentTarget);
      var selector = $el.attr('data-collapse-target');
      var $target = $(selector);
      // var $caption = $el.find('.mdc-typography--caption');
      var $icon = $el.find('.far');
      if ($target.is(':visible')) {
        $target.hide();
        // $caption.show();
        $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
      } else {
        $target.show();
        // $caption.hide();
        $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
      }
    });

    // Ajax Chips
    $('[data-ajax-chip]').each((i, o) => {
      var $chip = $(o);
      var options = $chip.data('ajax-chip');
      var chip = new mdc.chips.MDCChip(o);

      options.onUrl = options.onUrl || options.toggleUrl;
      options.offUrl = options.offUrl || options.onUrl;
      options.onData = options.onData || options.toggleData || null;
      options.offData = options.offData || options.onData;
      options.onMethod = options.onMethod || options.toggleMethod || 'GET';
      options.offMethod = options.offMethod || options.onMethod;

      $chip.on('click', () => {
        if (!$chip.data('disabled')) {
          $chip.data('disabled', true);
          $chip.css('opacity', 0.5);
          var selected = $chip.hasClass('mdc-chip--selected');
          var ajax = {
            url: selected ? options.offUrl || options.onUrl : options.onUrl,
            method: selected ? options.offMethod || options.onMethod : options.onMethod,
            data: selected ? options.offData || options.onData || null : options.onData || null,
            dataType: 'html',
            success: () => {
              if (options.onClasses) {
                var selectors = Object.keys(options.onClasses);
                for (var s = 0; s < selectors.length; ++s) {
                  var selector = selectors[s];
                  var cssClass = options.onClasses[selector];
                  $(selector)[selected ? 'removeClass' : 'addClass'](cssClass);
                }
              }
              if (options.offClasses) {
                var selectors = Object.keys(options.offClasses);
                for (var s = 0; s < selectors.length; ++s) {
                  var selector = selectors[s];
                  var cssClass = options.offClasses[selector];
                  $(selector)[!selected ? 'removeClass' : 'addClass'](cssClass);
                }
              }
              // $chip.find('.mdc-chip__icon--leading')[selected ? 'removeClass' : 'addClass']('mdc-chip__icon--leading-hidden');
              $chip.find('.mdc-chip__text').text(!selected ? options.onText : options.offText);
              chip.foundation.setSelected(!selected);
              $chip.data('disabled', false);
              $chip.css('opacity', 1);
            },
            error: () => {
              console.error('Failed toggle', options, arguments);
              $chip.data('disabled', false);
              $chip.css('opacity', 1);
            }
          };
          $.ajax(ajax);
        }
      });
    });
   
    this.maps = []; 
    $('[data-map-options]').each((i, o) => {
      const mapComponent = new MapComponent(o);
      this.maps.push(mapComponent);
    });

    this.typeaheads = [];
    $('[data-typeahead]').each((i, o) => {
      const typeahead = new TypeaheadComponent(o);
      this.typeaheads.push(typeahead);
    });

    this.horizontalScrollers = [];
    $('.scrolling-grid').each((i, o) => {
      const horizontalScroller = new HorizontalScrollerComponent(o);
      this.horizontalScrollers.push(horizontalScroller);
    }); 
  }

  initialiseGMapsDependents(apiKey) {
    $('[data-location-search]').each((i, o) => {
      const $o = $(o);
      const options = $o.data('location-search');
      const $lat = $(options.latSelector);
      const $lng = $(options.lngSelector);
      const $ls = $(options.locationServicesSelector);
      
      var autocomplete = new google.maps.places.Autocomplete(o, options.googleMapsOptions);
      autocomplete.addListener('place_changed', function(evt) {
        var place = this.getPlace();
        if (place.geometry.location) {
          $o.val(place.formatted_address);
          $lat.val(place.geometry.location.lat());
          $lng.val(place.geometry.location.lng());
        }
      });

      $o.on('focus', function(evt) {
        if ($lat.val() !== '') {
          $(o).val('');
          $lat.val('');
          $lng.val('');
        }
      }).on('blur', function(evt) {
        if ($lat.val() === '') {
          $o.val('');
        }
      });

      $ls.on('click', function(evt) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            $lat.val(lat);
            $lng.val(lng);

            var base = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
            var coords = lat + ',' + lng;
            var url = base + coords + '&key=' + apiKey + '&result_type=locality';
            $.getJSON(url, function(place) {
              if (place.results && place.results.length > 0) {
                var locality = place.results[0].address_components[0].short_name;
              }
              if (locality) {
                $o.val(locality);
              } else {
                $o.val(lat + ', ' + lng);
              }
            });
          });
        }
      });
    }).on('keypress', function(evt) {
      if (evt.which === 13) {
        evt.preventDefault();
        return false;
      }
    });
  }

  redraw() {
    for (var map of this.maps) {
      map.redraw();
    }
    for (var simpleMde of this.simpleMdes) {
      simpleMde.redraw();
    }
  }
}
