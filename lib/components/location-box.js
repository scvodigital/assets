require('imports-loader?define=>false!typeahead.js/dist/typeahead.jquery.min.js');
const Bloodhound = require('imports-loader?define=>false!typeahead.js/dist/bloodhound.min.js');

export class LocationBoxComponent {
  constructor(textbox) {
    this.textbox = $(textbox);
    this.config = this.textbox.data('location-search');
    this.lat = $(this.config.latSelector);
    this.lng = $(this.config.lngSelector);
    this.ls = $(this.config.locationServicesSelector);

    this.defaultOption = null;

    this.bloodhound = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: '/geo-lookup?q=%QUERY',
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
      .on('keydown', (ev) => {
        switch (ev.keyCode) {
          case (9):
            if (this.autocompleted) ev.preventDefault();
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
            }
            break;
        }
        this.autocompleted = false;
      });
  }

  typeaheadSelect(ev, suggestion) {
    console.log('typeaheadSelect', ev, suggestion);
    if (suggestion && suggestion.point && suggestion.point.lat) {
      this.textbox.typeahead('val', suggestion.display);
      this.lat.val(suggestion.point.lat);
      this.lng.val(suggestion.point.lon);
    } else {
      this.textbox.typeahead('val', '');
      this.lat.val('');
      this.lng.val('');
    }
    this.textbox.typeahead('close');
  }
}