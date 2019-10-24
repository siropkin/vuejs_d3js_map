import Vue from 'vue';
import Vuex from 'vuex';
import * as d3 from 'd3';

import MapService from './services/MapService';
import MarkersService from './services/MarkersService';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        transform: d3.zoomIdentity,
        projection: null,
        dataMap: [],
        dataMarkers: [],
        app: null,
        zoom: null,
        statusDataMap: 'pending',
        scaleExtent: [1, 8]
    },
    getters: {
        TRANSFORM: state => state.transform,
        PROJECTION: state => state.projection,
        DATA_MAP: state => state.dataMap,
        DATA_MARKERS: state => state.dataMarkers,
        APP: state => state.app,
        ZOOM: state => state.zoom,
        STATUS_DATA_MAP: state => state.statusDataMap,
        SCALE_EXTENT: state => state.scaleExtent
    },
    mutations: {
        SET_TRANSFORM(state, transform) {
            state.transform = transform;
        },
        SET_PROJECTION(state, projection) {
            state.projection = projection;
        },
        SET_DATA_MAP(state, data) {
            state.dataMap = data;
        },
        SET_DATA_MARKERS(state, data) {
            state.dataMarkers = data;
        },
        SET_APP(state, app) {
            state.app = app;
        },
        SET_ZOOM(state, zoom) {
            state.zoom = zoom;
        },
        SET_STATUS_DATA_MAP(state, statusDataMap) {
            state.statusDataMap = statusDataMap;
        },
        SET_SCALE_EXTENT(state, scaleExtent) {
            state.scaleExtent = scaleExtent;
        }
    },
    actions: {
        SET_TRANSFORM({ commit }, transform) {
            commit('SET_TRANSFORM', transform);
        },
        SET_PROJECTION({ commit }, size) {
            const projection = d3.geoMercator() //d3.geoEquirectangular()
                .scale(size.height / 4)
                .translate([size.width / 2, size.height / 2]);
            commit('SET_PROJECTION', projection);
        },
        async SET_DATA_MAP({ commit }) {
            try {
                const data = await MapService.getData();
                commit('SET_DATA_MAP', data);
                
                commit('SET_STATUS_DATA_MAP', 'success');
            } catch (e) {
                console.error(e);                
                commit('SET_STATUS_DATA_MAP', 'error');
            }            
        },
        async SET_DATA_MARKERS({ commit }) {
            try {
                const data = await MarkersService.getData();
                commit('SET_DATA_MARKERS', data);
            } catch (e) {
                console.error(e);                
            }
        },
        SET_APP({ commit }) {
            const app = d3.select('#app');
            commit('SET_APP', app);
        },
        SET_ZOOM({ commit }, scaleExtent) {
            const zoom = d3.zoom().scaleExtent(scaleExtent);
            commit('SET_ZOOM', zoom);
        },
        SET_SCALE_EXTENT({ commit }, scaleExtent) {
            commit('SET_SCALE_EXTENT', scaleExtent);
        }        
    }
});