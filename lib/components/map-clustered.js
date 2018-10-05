import 'leaflet';
import 'mapbox.js';

export class MapClusteredComponent {
    constructor(mapContainer) {
        this.$mapContainer = $(mapContainer);
        this.mapContainer = this.$mapContainer[0];
        this.options = this.$mapContainer.data('map-clustered-options');
        // This is a note, have you picked it up?
        console.log("options are...");
        console.log(JSON.stringify(this.options));

        // $.getJSON(this.options.outerUrl, function(data){
        //     console.log(data);
        // })


          window.popupPager = function (pager, direction) {
            var currentPage = $(pager).find('.chosen');
            var nextPage = currentPage;
            if (direction === 'next') {
              var nextElement = currentPage.next();
              if (!nextElement || nextElement.length === 0) {
                nextPage = $(pager).children().first();
              } else {
                nextPage = nextElement;
              }
            } else if (direction === 'back') {
              var prevElement = currentPage.prev();
              if (!prevElement || prevElement.length === 0) {
                nextPage = $(pager).children().last();
              } else {
                nextPage = prevElement;
              }
            }
            currentPage.hide();
            currentPage.removeClass("chosen");
            nextPage.addClass("chosen");
            nextPage.show();
          }

        // TODO - evil, any way of reading this from a handlebars template?
        this.makeMarker = function(mapObject){
            var markerString = "";
            markerString += '<div style="display:none;" data-map="fullMap" data-lat="' + mapObject.geo_coords.lat + '" data-lng="' + mapObject.geo_coords.lon + '" data-title="' + mapObject.title + '">';
            markerString += '<h3 class="mdc-typography--headline7"><a href="' + mapObject.URL + '">' + mapObject.title + '</a></h3>';
            if (mapObject.subtitle) markerString += '<div class="mdc-typography--body1 v-margin"><strong>' + mapObject.subtitle + '</strong></div>';
            markerString += '<div class="mdc-typography--body2"><a href="' + mapObject.URL + '" class="mdc-card__action">Find out more</a></div>';
            markerString += '</div>'
            return markerString;
        }

        const initialLat = (this.options.center && this.options.center.lat) ? this.options.center.lat : 55.94528820000001;
        const initialLng = (this.options.center && this.options.center.lng) ? this.options.center.lng : -3.200755699999945;
        const initialZoom = this.options.zoom || 9;

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

        var _this = this;

        // Don't try this with areas in the arctic circle, or far pacific, but it should be okay for scotland.
        var extendBounds = (ratio, bounds) => {
            var differenceLat = ((bounds._northEast.lat - bounds._southWest.lat) / 2) * ratio;
            var differenceLng = ((bounds._northEast.lng - bounds._southWest.lng) / 2) * ratio;
            return {
                _northEast : {lat : bounds._northEast.lat + differenceLat, lng : bounds._northEast.lng + differenceLng},
                _southWest : {lat : bounds._southWest.lat - differenceLat, lng : bounds._southWest.lng - differenceLng}
            };
        }

        _this.map.on('moveend', function(e) {
            var rawBounds = _this.map.getBounds();
            var extendedBounds = extendBounds(0.05, rawBounds);
            // Can't get the raw version of this query coming into the Router, and it doesn't seem to like parsing it coming in as an object, so left in raw form.
            _this.options.query.ne_lat = extendedBounds._northEast.lat;
            _this.options.query.ne_lon = extendedBounds._northEast.lng;
            _this.options.query.sw_lat = extendedBounds._southWest.lat;
            _this.options.query.sw_lon = extendedBounds._southWest.lng;
            loadMarkers(setMap);
        });


        var searchArea;
        var searchAreaShown = false;
        if (this.options.circle) {
          if (this.options.circle.radius > 0) {
            searchArea = L.circle(
              [this.options.circle.lat, this.options.circle.lng],
              {
                radius: this.options.circle.radius*1000,
                color: this.options.circle.color,
                fillColor: this.options.circle.color,
                fillOpacity: 0.1
              }
            ).addTo(this.map);
            searchAreaShown = true;
          }
        }

        var loadMarkers = (thenFunction) => {
            $.getJSON(_this.options.innerUrl, _this.options.query, function(data){
                thenFunction(data.results);
            })
        }

        var setMarkers = (markerData) => {
            var markers = {};
            for (var x = 0; x < markerData.length; x++){
                var markerDatum = markerData[x];
                var key = markerDatum.geo_coords.lat + "," + markerDatum.geo_coords.lon;
                if (!markers.hasOwnProperty(key)) {
                    markers[key] = {
                        position: {
                            lat: markerDatum.geo_coords.lat,
                            lng: markerDatum.geo_coords.lon
                        },
                        classes: [],
                        contents: [],
                        iconClasses: []
                    };
                }
                markers[key].contents.push(this.makeMarker(markerDatum))
                // ($o.data('class') || '').split(' ').forEach(className => {
                //     if (className && markers[key].classes.indexOf(className) === -1) {
                //         markers[key].classes.push(className);
                //     }
                // });
                // ($o.data('icon-class') || '').split(' ').forEach(iconClassName => {
                //     if (iconClassName && markers[key].iconClasses.indexOf(iconClassName) === -1) {
                //         markers[key].iconClasses.push(iconClassName);
                //     }
                // });
                // $o.hide();
            }
            return markers;
        }

        _this.markerGroup = new L.featureGroup();
        _this.mapMarkers = [];
        var setMap = (markerData) => {
            for(var i = 0; i < this.mapMarkers.length; i++){
                this.map.removeLayer(this.mapMarkers[i]);
            }
            var markers = setMarkers(markerData);

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
                        $(pager).children(":first").show();
                        $(pager).children(":first").addClass("chosen");
                        var back = $('<a>')
                        .attr('href', 'javascript:popupPager("#' + id + '", "back")')
                        .addClass('scroll-button pager pager-left')
                        .append('<span class="fas fa-fw fa-angle-left fa-2x"></span>')
                        .appendTo(content);
                    var next = $('<a>')
                        .attr('href', 'javascript:popupPager("#' + id + '", "next")')
                        .addClass('scroll-button pager pager-right')
                        .append('<span class="fas fa-fw fa-angle-right fa-2x"></span>')
                        .appendTo(content);
                    back.on('click', function(evt) {
                        var pager = $(evt.currentTarget).parent();
                        window.popupPager(pager, 'back');
                    });
                    next.on('click', function(evt) {
                        var pager = $(evt.currentTarget).parent();
                        window.popupPager(pager, 'next');
                    });
                    html = content.html();
                } else {
                    html = markerItem.contents[0];
                }
                marker.bindPopup(html);
                _this.mapMarkers.push(marker);
                _this.markerGroup.addLayer(marker);
            }

            // if (!this.options.center) {
            //     let bounds;
            //     if (searchAreaShown) {
            //         bounds = searchArea.getBounds();
            //     } else if (markerGroup.getLayers().length > 0) {
            //         bounds = markerGroup.getBounds();
            //     }
            //     if (bounds) {
            //         bounds.pad(0.1);
            //         this.map.fitBounds(bounds);
            //     }
            // }

        }
        // First time go
        loadMarkers(setMap);
    }

    redraw() {
        this.map.invalidateSize()
    }

}
