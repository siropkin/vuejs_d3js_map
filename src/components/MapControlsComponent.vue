<template>
    <div class="map-controls-view">
        <div class="zoom-control">
            <div class="zoom-control__group">
                <button class="zoom-control__zoom-in" v-on:click="zoomIn" :disabled="transform.k >= scaleExtent[1]"></button>
                <hr/>
                <button class="zoom-control__zoom-out" v-on:click="zoomOut" :disabled="transform.k <= scaleExtent[0]"></button>
            </div>
            <div class="zoom-control__group">
                <button class="zoom-control__zoom-reset" v-on:click="zoomReset"></button>
            </div>
        </div>
  </div>  
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';

export default {
    name: 'MapControls',
    props: {
    },
    computed: {
        ...mapGetters({
            app: 'APP',
            zoom: 'ZOOM',
            transform: 'TRANSFORM',
            scaleExtent: 'SCALE_EXTENT'            
        })
    },
    methods: {
        zoomIn() {
            this.zoom.scaleBy(this.app.transition().duration(500), 1.3);
        },
        zoomOut() {
            this.zoom.scaleBy(this.app.transition().duration(500), 1 / 1.3);
        },
        zoomReset() {
            this.app.transition().duration(500).call(this.zoom.transform, d3.zoomIdentity);
        }
    }
}
</script>

<style scoped>
.map-controls-view {
    position: absolute;
    right: 8px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}

.zoom-control__group {
    display: block;
    border-radius: 24px;
    background-color: #fff; 
    box-shadow: 0 2px 6px 0 rgba(253, 249, 249, 0.753);
}

button, button:hover, button:after, button:focus {
    display: block;
    clear: both;
    padding: 0;
    border: 0;
    cursor: pointer;
    width: 24px;
    height: 24px;       
    overflow: hidden;
    outline: none;
    mask-size: cover;
    background: black;        
}

button:disabled {
    background: gray;
}

.zoom-control__zoom-in {
    margin-top: 0px;
    border-radius: 32px 32px 0px 0px; 
    mask: url('../assets/icons/zoom-in.svg');    
}

.zoom-control__zoom-out {
    margin-top: 0px;
    border-radius: 0px 0px 32px 32px;
    mask: url('../assets/icons/zoom-out.svg');
}

.zoom-control__zoom-reset {
    margin-top: 24px;
    border-radius: 32px;
    mask: url('../assets/icons/zoom-reset.svg');
}

hr {
    margin: 0;
}
</style>