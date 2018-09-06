import * as mdc from 'material-components-web';

const $ = require('jquery');

export class MDC {
  constructor() { }

  initialise() {
    mdc.autoInit();

    // Think we just need the one global snackbar
    var $snackbar = $('#app-snackbar');
    this.snackbar = new mdc.snackbar.MDCSnackbar($snackbar[0]);
    $snackbar.data('defaultCss', {
      'background-color': $snackbar.css('background-color'),
      color: $snackbar.css('color')
    });

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
  }
}
