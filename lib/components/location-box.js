import {MDCTextFieldIcon} from '@material/textfield/icon';

require('imports-loader?define=>false!typeahead.js/dist/typeahead.jquery.min.js');
const Bloodhound = require('imports-loader?define=>false!typeahead.js/dist/bloodhound.min.js');

export class LocationBoxComponent {
  constructor(textbox) {
    this.textbox = $(textbox);
    this.config = this.textbox.data('location-search');
    this.la = $(this.config.laSelector);
    this.tsiArea = $(this.config.tsiAreaSelector);
    this.tsiContact = $(this.config.tsiContactSelector);
    this.lat = $(this.config.latSelector);
    this.lng = $(this.config.lngSelector);
    this.ls = $(this.config.locationServicesSelector);
    this.form = this.textbox.parents('form');

    this.selected = false;

    this.icon = new MDCTextFieldIcon(this.ls[0]);
    this.defaultOption = null;

    this.lookup_addr = (this.config.locationServicesSelector == '.postcode-lookup')? 'postcode-lookup' : 'geo-lookup';

    var charMap = {
      'a': /[àá]/gi,
      'e': /[èé]/gi,
      'i': /[íì]/gi,
      'o': /[óò]/gi,
      'u': /[úù]/gi
    };
    var normalize = function (str) {
      $.each(charMap, function (normalized, regex) {
        str = str.replace(regex, normalized);
      });
      return str;
    };
    var queryTokenizer = function (q) {
      var normalized = normalize(q);
      return Bloodhound.tokenizers.whitespace(normalized);
    };

    this.bloodhound = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: queryTokenizer,
      remote: {
        url: '/'+this.lookup_addr+'?q=%QUERY',
        wildcard: '%QUERY',
        transform: (res) => {
          this.defaultOption = (Array.isArray(res) && res.length > 0) ? res[0] : null;
          return res;
        }
      }
    });

    this.textbox.typeahead(null, {
      name: 'location',
      display: 'display',
      source: this.bloodhound
    });

    this.textbox
      .on('typeahead:select', (ev, suggestion) => {
        this.autocompleted = true;
        console.log('typeahead:select', ev, suggestion);
        this.typeaheadSelect(ev, suggestion);
      })
      .on('typeahead:autocomplete', (ev, suggestion) => {
        this.autocompleted = true;
        console.log('typeahead:autocomplete', ev, suggestion);
        this.typeaheadSelect(ev, suggestion);
      })
      .on('blur', (ev) => {
        var menuOpen =
          this.textbox.parent().find('.tt-open').length > 0 &&
          this.textbox.parent().find('.tt-empty').length === 0;
        console.log('Menu open', menuOpen);
        if (this.autocompleted) {
          ev.preventDefault();
        } else if (!this.defaultOption || !this.textbox.val()) {
          this.la.val('');
          this.tsiArea.val('');
          this.tsiContact.val('');
          this.lat.val('');
          this.lng.val('');
        } else if (this.defaultOption) {
          ev.preventDefault();
          this.typeaheadSelect(ev, this.defaultOption);
        }
        this.autocompleted = false;
      })
      .on('keydown', (ev) => {
        switch (ev.keyCode) {
          case (9):
            var menuOpen =
              this.textbox.parent().find('.tt-open').length > 0 &&
              this.textbox.parent().find('.tt-empty').length === 0;
            console.log('Menu open', menuOpen);
            if (this.autocompleted) {
              ev.preventDefault();
            } else if (menuOpen && this.defaultOption) {
              this.typeaheadSelect(ev, this.defaultOption);
            }
            break;
          case (13):
            var menuOpen =
              this.textbox.parent().find('.tt-open').length > 0 &&
              this.textbox.parent().find('.tt-empty').length === 0;
            console.log('Menu open', menuOpen);
            if (this.autocompleted) {
              ev.preventDefault();
            } else if (menuOpen && this.defaultOption) {
              ev.preventDefault();
              this.typeaheadSelect(ev, this.defaultOption);
            } else if (!menuOpen && !this.selected) {
              ev.preventDefault();
            }
            break;
          default:
            this.la.val('');
            this.tsiArea.val('');
            this.tsiContact.val('');
            this.lat.val('');
            this.lng.val('');
            this.selected = false;
        }
        this.autocompleted = false;
      });

    const comp = this;

    this.ls.css('z-index', 500).on('click', (evt) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const suggestion = {
            "display": lat + "," + lon,
            "la": "",
            "point": {
              "lat": lat,
              "lon": lon
            }
          };

          var url = 'https://api.postcodes.io/outcodes?lat=' + lat + '&lon=' + lon;
          $.getJSON(url, (place) => {
            if (!place.result || place.result.length === 0) return;
            const result = place.result[0];
            suggestion.display =
              result.admin_district && result.admin_district[0] ||
              result.outcode ||
              result.country && result.country[0] ||
              'Current location';
            suggestion.display = suggestion.display.replace(' Islands', '').replace(' City', '').replace('City of ', '').replace(' and ', ' & ');
            suggestion.district = suggestion.display;
            comp.typeaheadSelect(evt, suggestion);
          });
        });
      }
    });

    this.form.on('submit', (evt) => {
      if (this.textbox.val() && !this.lat.val()) {
        const parents = this.textbox.parents('.mdc-text-field');
        if (parents.length > 0 && parents[0].MDCTextField) {
          const textfield = parents[0].MDCTextField;
          textfield.valid = false;
        }
        evt.preventDefault();
        this.textbox.focus();
      }
    });
  }

  typeaheadSelect(ev, suggestion) {
    // console.log('typeaheadSelect', ev, suggestion);
    if (suggestion && suggestion.point && suggestion.point.lat) {
      console.log(suggestion);
      this.textbox.typeahead('val', suggestion.display);
      this.la.val(suggestion.district);
      this.tsiArea.val(suggestion.tsiArea);
      this.tsiContact.val(suggestion.tsiContact);
      this.la.val(suggestion.district);
      this.lat.val(suggestion.point.lat);
      this.lng.val(suggestion.point.lon);
      this.selected = true;
    } else {
      this.textbox.typeahead('val', '');
      this.la.val('');
      this.tsiArea.val('');
      this.tsiContact.val('');
      this.lat.val('');
      this.lng.val('');
      this.selected = false;
    }
    this.textbox.typeahead('close');
    this.form.trigger('change');
  }
}