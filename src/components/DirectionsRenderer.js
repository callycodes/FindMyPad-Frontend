import { MapElementFactory } from "vue2-google-maps";

export default MapElementFactory({
  name: "directionsRenderer",

  ctr() {
    return window.google.maps.DirectionsRenderer;
  },

  events: [],

  mappedProps: {},

  props: {
    origin: { type: Object, twoWay: true },
    destination: { type: Object, twoWay: true },
    travelMode: { type: String },
    panel: { type: HTMLDivElement },
    renderer: {type: Object},
    map: {type:Object},
  },
  afterCreate() {
    let directionsService = new window.google.maps.DirectionsService();

    console.log('after create')
    this.$watch(
      () => [this.origin, this.destination, this.travelMode, this.panel],
      () => {
        let { origin, destination, travelMode, panel } = this;
        if (origin == null) {
          this.renderer.setMap(null);
          this.renderer.set('directions', null);
        }
        if (!origin || !destination) {
          console.log('something is null lol')
        return;
        }

        this.renderer.setMap(this.map);
        
        console.log('origin: ' + origin)
        console.log('destination: ' + destination)
        directionsService.route(
          {
            origin,
            destination,
            travelMode
          },
          (response, status) => {
            console.log('Found directions: ' + status);
            if (status !== "OK") return;
            console.log('Directions:  ' + response);
            this.renderer.setDirections(response);
            this.renderer.setPanel(panel);
          }
        );
      }
    );
  }
});
