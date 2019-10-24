<template>
  <div id="app">    
    <div v-if="statusDataMap === 'success'" class="map-body">      
      <MapComponent :colors="{land: '#67BAAF', boundary: '#002855'}"/>
      <MarkersComponent :colors="{markers: 'blue'}" />
      <MapControlsComponent />
      <div class="logo"></div>
    </div>
    <div v-else-if="statusDataMap === 'error'" id="error">Error while loading map data...</div>
    <div v-else id="preloader"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MapComponent from './components/MapComponent.vue'
import MarkersComponent from './components/MarkersComponent.vue'
import MapControlsComponent from './components/MapControlsComponent.vue'

export default {
  name: 'app',
  components: {
    MapComponent,    
    MarkersComponent,
    MapControlsComponent
  },
  computed: {
    ...mapGetters({
      statusDataMap: 'STATUS_DATA_MAP'
    })
  },
  mounted() {
    // TODO: Create map options (colors, margin, scale)
    this.$store.dispatch('SET_DATA_MAP');
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  background: repeating-linear-gradient(45deg, #2b2b2b, #2b2b2b 5px, #222222 5px, #222222 15px);
}

body {
  margin: 0
}

#preloader {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 48px;
    height: 48px;
    margin-left: -24px;
    margin-top: -24px;
    border: #31a9df 3px solid;
    border-left-color: transparent;
    border-radius: 50%;
    -webkit-animation: rotating 1s linear infinite;
}

@-webkit-keyframes rotating {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

#error {
  position: absolute;
  top: 50%;
  width: 100%;
  color: #fff;
  text-align: center;
}

.logo {
  position: relative;
  margin: 8px;
  width: 180px;
  height: 180px;
  background-image: url('./assets/logo.png');
  background-size: cover;
}
</style>