const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

class Busquedas{
    historial = [];
    db = './db/db.json';
   
    constructor(){
        this.leerDB();
    }

    async ciudad(lugar = ''){
        //let lugares = []
        //lugares.push(lugar)

        try {

            // crear una instancia del endpoint con axios
            const mapbox_instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params:{
                    'access_token': process.env.MAPBOX_KEY, //setear el MAPBOX_KEY en el archivo .env con el token propio
                    'limit' : 5
                }
            })

            // traer los lugares de la api como una petición http con axios
            const response = await mapbox_instance.get();
            //console.log(response.data)

            const features = response.data.features
            //console.log(features);
            
            if(features[0] == undefined){
                console.clear()
                console.log(''); //deja un salto de linea
                console.log('No se encontró esa ciudad.'.magenta)
                console.log(''); //deja un salto de linea
                return null;

            }else{

                const lugares = features.map( element =>({
                    id: element.id,
                    nombre: element.place_name,
                    longitud: element.center[0],
                    latitud: element.center[1]
                }))
                return lugares;
            }

        } catch (error) {
            if(error){
                console.log('No se encontró esa ciudad.')
                console.log(error)
                return [];
            }
        }
        
        
    }

    async clima(lat, lon){
        try {
            // crear una instancia del endpoint con axios
            const openweather_instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params:{
                    'appid': process.env.OPENWEATHER_KEY, //setear el OPENWEATHER_KEY en el archivo .env con el token propio
                    'lat' : lat,
                    'lon': lon,
                    'units': 'metric',
                    'lang': 'es'
                }
            })

            // traer los lugares de la api como una petición http con axios
            const response = await openweather_instance.get();
            //const response = openweather_instance
            const data = response.data;

            const clima = {
                desc: data.weather[0].description,
                temp: data.main.temp,
                min: data.main.temp_min,
                max: data.main.temp_max
            };

            return clima;

        } catch (error) {
            console.log(error)
        }
    }

    async agregarHistorial(fecha,lugar){

        const busqueda = {
            "fecha":fecha,
            "lugar":lugar
        }

        this.historial.unshift(busqueda);
    }

    guardarDB(){
        const payload ={
            historial: this.historial
        }

        fs.writeFileSync(this.db, JSON.stringify(payload));
    }

    leerDB(){

        if (!fs.existsSync(this.db)){
            return null;

        }else{
            const info = fs.readFileSync(this.db, {encoding:'utf-8'})
            const data = JSON.parse(info);

            this.historial = data.historial;
        }
    }

}


module.exports = Busquedas;