const colors = require('colors');
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require('./models/busquedas');

console.clear()



const main = async()=>{

    let option;
    const busquedas = new Busquedas;

    do {
        console.clear()

        //imprimir el menu y capturar la opción por input
        option = await inquirerMenu();
        option = option.opt;   

        switch (option) {
            case 1:
                // Buscar ciudad

                // leer el input
                const busqueda = await leerInput('\n¿Qué ciudad deseas buscar? ');
                console.clear()
                console.log('\nCargando...\n'.yellow);

                // buscar lugares
                const lugares = await busquedas.ciudad(busqueda);

                if(lugares != null){
                    console.clear()
                    console.log('\nCargando...\n'.yellow)
                    console.clear()

                    // seleccionar el lugar
                    let id = await listarLugares(lugares);
                    id = id.id;

                    if(id != 0){

                        // encontrar el id del lugar seleccionado que sea igual al id en la lista de lugares
                        const lugar_seleccionado = lugares.find( seleccionado => seleccionado.id == id)
                        
                        const latitud = lugar_seleccionado.latitud;
                        const longitud = lugar_seleccionado.longitud;
                        console.clear()
                        console.log('\nCargando...\n'.yellow)
                        
                        const clima = await busquedas.clima(latitud,longitud)
                        console.clear()
                        // Mostrar los resultados
                        console.log(colors.blue('\nInformación del clima de la ciudad: \n'))
                        console.log(`- Ciudad: ${lugar_seleccionado.nombre}`)
                        console.log(`- Latitud: ${lugar_seleccionado.latitud}`)
                        console.log(`- Longitud: ${lugar_seleccionado.longitud}`)
                        console.log(`- Temperatura: ${clima.temp}°C`)
                        console.log(`- Mínima: ${clima.min}°C`)
                        console.log(`- Máxima: ${clima.max}°C`)
                        console.log(`- Cómo está el clima: ${clima.desc}`)
                        
                        // agregar lugar seleccionado y la fecha en el historial de búsquedas
                        let date = new Date();
                        busquedas.agregarHistorial(date.toLocaleString(),lugar_seleccionado.nombre);
                        busquedas.guardarDB();

                        await pausa();
                    };
                }else{
                    await pausa();
                };

                break;

            case 2:
                console.log('\nÚltimas 10 búsquedas:')
                // Historial (últimos 10 buscados)
                const historial = busquedas.historial;

                if(historial[0] == undefined){
                    console.log(''); //deja un salto de linea
                    console.log('No hubo búsquedas aún.')
                    console.log(''); //deja un salto de linea

                }else{
                    console.log(''); //deja un salto de linea
                    for (let i = 0; i < 10; i++) {

                        if(historial[i] != undefined){
                            const fecha = historial[i].fecha;
                            const lugar = historial[i].lugar;
    
                            console.log(`${fecha.blue} ${lugar.white}`)
                        }
                    }

                    console.log(''); //deja un salto de linea
                }
                
                await pausa()
                break;
        }

        if(option == 0){
            console.log(''); //deja un salto de linea 
            console.log(colors.red('Saliendo...'))
            console.log(''); //deja un salto de linea
        };

    } while (option != 0);




}

main()