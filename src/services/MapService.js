class MapService {
    // Get data for map    
    static getData() {
        return new Promise(async (resolve, reject) => {
            try {
                const resp = await fetch('https://d3js.org/world-110m.v1.json');
                const data = resp.json();
                resolve(data);
            } catch(err) {
                reject(err);
            }
        });
    }
}

export default MapService;