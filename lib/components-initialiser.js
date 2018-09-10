import * as mdc from 'material-components-web';
import { TypeaheadController } from './typeahead-controller';

const $ = require('jquery');

export class ComponentsInitialiser {
  constructor() { }

  initialise() {
    this.createElements();
    mdc.autoInit();

    // Think we just need the one global snackbar
    this.snackbar = new mdc.snackbar.MDCSnackbar(this.$snackbar[0]);

    $('[data-ajax-button]').on('click', function(evt) {
      evt.preventDefault();
      var $o = $(event.currentTarget);
      var config = $o.data('ajax-button');

      var request = {
        url: config.url,
        method: ['POST', 'GET', 'PUT', 'DELETE'].indexOf(config.method.toUpperCase()) > -1 ? config.method.toUpperCase() : 'GET',
        dataType: config.responseType || 'html',
        success: function(response, status, xhr) {
          if (config.successMessage) {
            goodmoves.snackbarShow({
              message: config.successMessage
            });
          }
          
          if (config.successCallback) {
            window[config.successCallback].call(this, evt, config, response, status, xhr);
          }
        },
        error: function(xhr, status, err) {
          if (config.failureMessage) {
            goodmoves.snackbarShow({
              message: config.failureMessage,
              backgroundColor: '#dd4b39'
            });
          }

          if (config.failureCallback) {
            window[config.failureCallback].call(this, evt, config, xhr, status, err);
          }
        },
        data: config.postBody
      };

      console.log('REQUEST:', request);
      $.ajax(request);
    });

    // Ajax Forms
    $('form[data-ajax-form]').submit(function(evt) {
      evt.preventDefault();
      var $o = $(event.currentTarget);
      var config = $o.data('ajax-form');
      var url = $o.attr('action');
      var method = $o.attr('method') || 'GET';

      var request = {
        url: url,
        method: ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET',
        dataType: config.responseType || 'html',
        success: function(response, status, xhr) {
          console.log('AJAX Form Success', response, status, xhr, config, config);
          if (config.successMessage) {
            goodmoves.snackbarShow({
              message: config.successMessage
            });
          }
          
          if (config.successCallback) {
            window[config.successCallback].call(this, evt, config, response, status, xhr);
          }
        },
        error: function(xhr, status, err) {
          console.log('AJAX Form Failure', xhr, status, err);
          if (config.failureMessage) {
            goodmoves.snackbarShow({
              message: config.failureMessage,
              backgroundColor: '#dd4b39'
            });
          }

          if (config.failureCallback) {
            window[config.failureCallback].call(this, evt, config, xhr, status, err);
          }
        }
      };

      if (method.toUpperCase() === 'GET') {
        request.url += (request.url.indexOf('?') > -1 ? '&' : '') + $o.serialize();
      } else {
        var data = {};
        var params = $o.serializeArray();
        console.log('PARAMS:', params);
        for (var p = 0; p < params.length; p++) {
          var param = params[p];
          if (!data.hasOwnProperty(param.name)) {
            data[param.name] = param.value;
          } else {
            if (!$.isArray(data[param.name])) {
              data[param.name] = [data[param.name]];
            }
            data[param.name].push(param.value);
          }
        }
        request.data = data;
      }
      console.log('REQUEST:', request);
      $.ajax(request);
    });

    $('[data-mdc-auto-init="MDCTextField"][novalidate]').each(function(i, o) {
      var foundation = o.MDCTextField.foundation_;
      foundation.useCustomValidityChecking = true;
      $(o).find('input').on('blur', function() {
        o.MDCTextField.valid = true;
      });
    });

    // Menu buttons
    $('[data-menu-target]').each(function(i, o) {
      var selector = $(o).attr('data-menu-target');
      var menuEl = $(selector)[0];
      $(o).on('click', function() {
        menuEl.MDCMenu.open = !menuEl.MDCMenu.open;
      });
    });

    // Dialog activator buttons
    $('[data-dialog-target]').each(function(i, o) {
      var selector = $(o).attr('data-dialog-target');
      var dialogEl = $(selector)[0];
      $(o).on('click', function() {
        dialogEl.MDCDialog.show();
      });
    });

    // Temporary drawer buttons
    $('[data-drawer-target]').each(function(i, o) {
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
    $('[data-collapse-target]').off('click').on('click', function(evt) {
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
    $('[data-ajax-chip]').each(function(i, o) {
      var $chip = $(o);
      var options = $chip.data('ajax-chip');
      var chip = new mdc.chips.MDCChip(o);

      options.onUrl = options.onUrl || options.toggleUrl;
      options.offUrl = options.offUrl || options.onUrl;
      options.onData = options.onData || options.toggleData || null;
      options.offData = options.offData || options.onData;
      options.onMethod = options.onMethod || options.toggleMethod || 'GET';
      options.offMethod = options.offMethod || options.onMethod;

      $chip.on('click', function() {
        if (!$chip.data('disabled')) {
          $chip.data('disabled', true);
          $chip.css('opacity', 0.5);
          var selected = $chip.hasClass('mdc-chip--selected');
          var ajax = {
            url: selected ? options.offUrl || options.onUrl : options.onUrl,
            method: selected ? options.offMethod || options.onMethod : options.onMethod,
            data: selected ? options.offData || options.onData || null : options.onData || null,
            dataType: 'html',
            success: function() {
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
            error: function() {
              console.error('Failed toggle', options, arguments);
              $chip.data('disabled', false);
              $chip.css('opacity', 1);
            }
          };
          $.ajax(ajax);
        }
      });
    });
    
    $('[data-map-options]').each(function(i, o) {
      var options = $(o).data('map-options');
      var initialLat = 55.94528820000001;
      var initialLng = -3.200755699999945;
      var initialZoom = 9;
      if (options.center) {
        var initialLat = options.center.lat;
        var initialLng = options.center.lng;
        var initialZoom = options.zoom;
      }
      var map = L.map(o, {
        fullscreenControl: true,
        scrollWheelZoom: false,
        trackResize: false
      }).setView([initialLat, initialLng], initialZoom);
      var osmAttrib = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
      L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
        attribution: osmAttrib,
        minZoom: 6,
        maxZoom: 18,
        opacity: 0.8
      }).addTo(map);
      L.control.scale().addTo(map);
      var mapName = $(o).data('map-name');

      // console.log(options.circle);
      var searchArea;
      var searchAreaShown = false;
      if (options.circle) {
        if (options.circle.radius > 0) {
          searchArea = L.circle(
            [options.circle.lat, options.circle.lng],
            {
              radius: options.circle.radius*1000,
              color: '#9cd986',
              fillColor: '#9cd986',
              fillOpacity: 0.1
            }
          ).addTo(map);
          searchAreaShown = true;
        }
      }

      var $vacancies = $('marker[data-map="' + mapName + '"]');
      var vacancyMarkers = {};

      $vacancies.each(function(i, o) {
        var $o = $(o);
        var key = $o.data('lat') + ',' + $o.data('lng');
        if (!vacancyMarkers.hasOwnProperty(key)) {
          vacancyMarkers[key] = {
            position: {
              lat: $o.data('lat'),
              lng: $o.data('lng')
            },
            shortlisted: $o.data('shortlisted'),
            homebased: $o.data('homebased'),
            contents: []
          };
        }
        vacancyMarkers[key].contents.push($o.html());
      });

      var markers = new L.featureGroup();
      var vacancyPositions = Object.keys(vacancyMarkers);

      for (var p = 0; p < vacancyPositions.length; p++) {
        var vacancyPosition = vacancyPositions[p];
        var vacancyMarker = vacancyMarkers[vacancyPosition];
        var iconType = '';
        if (vacancyMarker.homebased) {
          iconType = ' homebased';
        }
        if (vacancyMarker.shortlisted) {
          iconType = ' shortlisted';
        }
        var icon = L.divIcon({
          html: '<i class="marker-icon fas fa-map-marker' + iconType + '"></i><span class="map-marker-overlay' + iconType + '">' + vacancyMarker.contents.length  + '</span>',
          iconSize: [30, 40],
          iconAnchor: [15, 40],
          popupAnchor: [0, -42],
          className: 'vacancy_icon'
        });
        var marker = L.marker([vacancyMarker.position.lat, vacancyMarker.position.lng], {icon: icon}).addTo(map);
        var html;
        if (vacancyMarker.contents.length > 1) {
          var id = 'popup-pager-' + p;
          var content = $('<div>');
          var pager = $('<div>')
          .attr('id', id)
          .addClass('popup-pager')
          .append(vacancyMarker.contents.join('\n'))
          .appendTo(content);
          var back = $('<a>')
          .attr('href', 'javascript:goodmoves.popupPagerPage("#' + id + '", "back")')
          .addClass('scroll-button pager pager-left')
          .append('<span class="fas fa-fw fa-angle-left fa-2x"></span>')
          .appendTo(content);
          var next = $('<a>')
          .attr('href', 'javascript:goodmoves.popupPagerPage("#' + id + '", "next")')
          .addClass('scroll-button pager pager-right')
          .append('<span class="fas fa-fw fa-angle-right fa-2x"></span>')
          .appendTo(content);
          back.on('click', function(evt) {
            var pager = $(evt.currentTarget).parent();
            popupPage(pager, 'back');
          });
          next.on('click', function(evt) {
            var pager = $(evt.currentTarget).parent();
            popupPage(pager, 'next');
          });
          html = content.html();
        } else {
          html = vacancyMarker.contents[0];
        }
        marker.bindPopup(html);
        markers.addLayer(marker);
      }

      if (!options.center) {
        if (searchAreaShown) {
          map.fitBounds(searchArea.getBounds());
        } else {
          map.fitBounds(markers.getBounds());
        }
      }

      that.maps[mapName] = map;
    });

    this.typeaheads = [];
    $('[data-typeahead]').each((i, o) => {
      const typeahead = new TypeaheadController(o);
      this.typeaheads.push(typeahead);
    });
  }

  createElements() {
    if (!this.$snackbar) {
      this.$snackbar = $('<div>')
        .addClass('mdc-snackbar mdc-elevation--z10')
        .attr({
          'aria-live': 'assertive',
          'aria-atomic': true,
          'aria-hidden': true,
          'id': 'app-snackbar'
        })
        .appendTo('body');
      this.$snackbarText = $('<div>')
        .addClass('mdc-snackbar__text')
        .appendTo(this.$snackbar);
      this.$snackbarActionWrapper = $('<div>')
        .addClass('mdc-snackbar__action-wrapper')
        .appendTo(this.$snackbar);
      this.$snackbarActionButton = $('<button>')
        .addClass('mdc-snackbar__action-button')
        .attr('type', 'button')
        .appendTo(this.$snackbarActionWrapper);
      this.$snackbar.data('defaultCss', {
        'background-color': this.$snackbar.css('background-color'),
        'color': this.$snackbar.css('color')
      });
    }
  }
}
