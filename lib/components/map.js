
export class MapComponent {
  constructor(mapContainer) {
    this.$mapContainer = $(mapContainer);
    this.mapContainer = this.$mapContainer[0];
    this.options = {
      center: {
        lat: 55.94528820000001,
        lng: -3.200755699999945
      },
      zoom: 9
    }
    this.options = $.extend(true, this.options, this.$mapContainer.data('map-options'));

    const initialLat = this.options.center.lat;
    const initialLng = this.options.center.lng;
    const initialZoom = this.options.zoom;

    this.map = L.map(this.mapContainer, {
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
    }).addTo(this.map);
    L.control.scale().addTo(this.map);

    // console.log(options.circle);
    var searchArea;
    var searchAreaShown = false;
    if (this.options.circle) {
      if (this.options.circle.radius > 0) {
        searchArea = L.circle(
          [this.options.circle.lat, this.options.circle.lng],
          {
            radius: this.options.circle.radius*1000,
            color: '#9cd986',
            fillColor: '#9cd986',
            fillOpacity: 0.1
          }
        ).addTo(this.map);
        searchAreaShown = true;
      }
    }

    var $markers = this.$mapContainer.find('marker');
    var markers = {};

    $markers.each((i, o) => {
      var $o = $(o);
      var key = $o.data('lat') + ',' + $o.data('lng');
      if (!markers.hasOwnProperty(key)) {
        markers[key] = {
          position: {
            lat: $o.data('lat'),
            lng: $o.data('lng')
          },
          classes: [],
          contents: [],
          iconClasses: []
        };
      }
      markers[key].contents.push($o.html());
      ($o.data('class') || '').split(' ').forEach(className => {
        if (className && markers[key].classes.indexOf(className) === -1) {
          markers[key].classes.push(className);
        }
      });
      ($o.data('icon-class') || '').split(' ').forEach(iconClassName => {
        if (iconClassName && markers[key].iconClasses.indexOf(iconClassName) === -1) {
          markers[key].iconClasses.push(iconClassName);
        }
      });
      $o.hide();
    });

    var markerGroup = new L.featureGroup();
    var markerPositions = Object.keys(markers);

    for (var p = 0; p < markerPositions.length; p++) {
      var markerPosition = markerPositions[p];
      var markerItem = markers[markerPosition];
      var iconType = markerItem.iconClasses.join(' ');
      var icon = L.divIcon({
        html: '<i class="marker-icon fas fa-map-marker' + iconType + '"></i><span class="map-marker-overlay' + iconType + '">' + markerItem.contents.length  + '</span>',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -42],
        className: 'vacancy_icon'
      });
      var marker = L.marker([markerItem.position.lat, markerItem.position.lng], {icon: icon}).addTo(this.map);
      var html;
      if (markerItem.contents.length > 1) {
        var id = 'popup-pager-' + p;
        var content = $('<div>');
        var pager = $('<div>')
        .attr('id', id)
        .addClass('popup-pager')
        .append(markerItem.contents.join('\n'))
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
        html = markerItem.contents[0];
      }
      marker.bindPopup(html);
      markerGroup.addLayer(marker);
    }

    if (!this.options.center) {
      if (searchAreaShown) {
        this.map.fitBounds(searchArea.getBounds());
      } else {
        this.map.fitBounds(markers.getBounds());
      }
    }
  }

  redraw() {
    this.map.invalidateSize()
  }
}
