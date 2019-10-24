<template>
  <div class="map-container"> 
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';
import * as topojson from 'topojson';

export default {
  name: 'Map',
  props: {
    colors: {
      type: Object,
      default: () => ({land: '#000', boundary: '#fff'})
    },
    margin: { 
      type: Object,
      default: () => ({top: 0, right: 0, bottom: 0, left: 0})
    }
  },
  computed: {
    ...mapGetters({
      transform: 'TRANSFORM',
      projection: 'PROJECTION',
      data: 'DATA_MAP',
      app: 'APP',
      zoom: 'ZOOM',
      scaleExtent: 'SCALE_EXTENT'
    })
  },
  data() {
    return {
      container: null,
      containerD3: null,
      canvas: null,
      context: null,
      width: 0,
      height: 0,
      widthCanvas: 0,
      heightCanvas: 0,
      land: [],
      boundary: [],
    }
  },
  watch: {
    data: function () {
      this.fetchData();
      this.draw();
    },
    transform: function () {
      this.resize();
    },
    projection: function () {
      this.draw();
    }
  },
  mounted() {
    this.container = this.$el;
    this.containerD3 = d3.select(this.container);

    this.canvas = this.containerD3.append('canvas');
    this.context = this.canvas.node().getContext("2d");

    this.resize();    

    this.fetchData();
  
    this.$store.dispatch('SET_ZOOM', this.scaleExtent);
    this.zoom.on("zoom", this.zoomed.bind(this));

    this.$store.dispatch('SET_APP');
    this.app.call(this.zoom);
    
    window.addEventListener("resize", this.resize);
  },
  methods: {
    fetchData() {      
      this.land = topojson.merge(this.data, this.data.objects.countries.geometries);
      this.boundary = topojson.mesh(this.data, this.data.objects.countries);
    },
    resize() {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      this.widthCanvas = this.width - this.margin.left - this.margin.right;
      this.heightCanvas = this.height - this.margin.top - this.margin.bottom;

      this.canvas.attr('width', this.widthCanvas).attr('height', this.heightCanvas);     

      this.$store.dispatch('SET_PROJECTION', { width: this.widthCanvas, height: this.heightCanvas });
    },
    draw() {
      const path = d3.geoPath().projection(this.projection).context(this.context);      
      // Prepare canvas
      this.context.clearRect(0, 0, this.widthCanvas, this.heightCanvas);
      this.context.save();
      this.context.translate(this.transform.x, this.transform.y);
      this.context.scale(this.transform.k, this.transform.k);
      // Draw land
      this.context.beginPath();
      path(this.land);
      this.context.fillStyle = this.colors.land;
      this.context.fill();
      // Draw boundary
      this.context.beginPath();
      path(this.boundary);
      this.context.strokeStyle = this.colors.boundary;
      this.context.stroke();
    },
    zoomed() {
      this.$store.dispatch('SET_TRANSFORM', d3.event.transform);
    }
  }
}
</script>

<style scoped>
.map-container {
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  left: 0px; 
  top: 0px; 
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
