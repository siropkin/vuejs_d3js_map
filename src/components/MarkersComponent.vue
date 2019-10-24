<template>
  <div class="markers-container">
    <div id="tooltip"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';

export default {
  name: 'Markers',
  props: {
    colors: {
      type: Object,
      default: () => ({markers: '#000'})
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
      data: 'DATA_MARKERS'
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
      heightCanvas: 0
    }
  },
  watch: {
    data: function () {
      this.draw();
    },
    transform: function () {
      this.draw();
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

    this.getData();

    this.container.addEventListener('touchmove', this.onMouseMove, false);
    this.container.addEventListener('touchend', this.onMouseLeft, false);
    this.container.addEventListener('mousemove', this.onMouseMove, false);
    this.container.addEventListener('mouseleave', this.onMouseLeft, false);
  },
  methods: {
    getData() {
      this.$store.dispatch('SET_DATA_MARKERS');
    },
    resize() {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      this.widthCanvas = this.width - this.margin.left - this.margin.right;
      this.heightCanvas = this.height - this.margin.top - this.margin.bottom;

      this.canvas.attr('width', this.widthCanvas).attr('height', this.heightCanvas);
    },
    draw() {
      // Prepare canvas
      this.context.clearRect(0, 0, this.widthCanvas, this.heightCanvas);
      this.context.save();
      this.context.translate(this.transform.x, this.transform.y);
      this.context.scale(this.transform.k, this.transform.k);
      // Draw markers
      this.data.forEach((item) => {
        const x = this.projection(item.coordinates)[0];
        const y = this.projection(item.coordinates)[1];
        // TODO: Make Radius as parametr
        const r = 5;
        
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI, false);
        this.context.fillStyle = this.colors.markers;
        this.context.fill();      
      });
      this.context.restore();
    },
    onMouseMove(e){
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      d3.select('#tooltip')
        .style('opacity', 1)
		    .style('top', mouseY + 25 + 'px')
		    .style('left', mouseX + 15 + 'px')
		    .html('x: ' + mouseX + '<br>' + 'y: ' + mouseY);  
    },
    onMouseLeft(e){
      d3.select('#tooltip')
        .style('opacity', 0);
    }
  } 
}
</script>

<style scoped>
.markers-container {
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  left: 0px; 
  top: 0px; 
  width: 100%;
  height: 100%;
  margin: 0;
}

#tooltip {
    pointer-events: none;
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 1px 1px #d8d8d8;
    position: absolute;
    padding: 6px 2px 4px;
    max-width: 166px;
    box-shadow: 0 2px 6px 0 rgba(253, 249, 249, 0.753);
}
</style>
