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

    this.$watch(
      () => [this.origin, this.destination, this.travelMode, this.panel],
      () => {
        let { origin, destination, travelMode, panel } = this;
        if (origin == null) {
          this.renderer.setMap(null);
          this.renderer.set('directions', null);
        }
        if (!origin || !destination) {
        return;
        }

        this.renderer.setMap(this.map);
        
        directionsService.route(
          {
            origin,
            destination,
            travelMode
          },
          (response, status) => {
            if (status !== "OK") return;
            this.renderer.setDirections(response);
            this.renderer.setPanel(panel);
          }
        );
      }
    );
  }
});
