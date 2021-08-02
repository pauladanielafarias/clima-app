//pkgs and modules
const inquirer = require('inquirer');
const colors = require('colors');

//opciones del menú con el formato para poder usar inquirer
const menuOpts =[
    {
        type:'list',
        name: 'opt',
        message: '¿Qué desea hacer? \n',
        choices:[
            {
                value: 1,
                name: `1. Buscar ciudad`
            },
            {
                value: 2,
                name: `2. Historial`
            },
            {  
                value: 0,
                name: `0. Salir`
            }
        ]
    }
];

// funcion async() que utiliza inquirer para obtener el input del usuario con la opcion elegida
const inquirerMenu = async() =>{
    console.log('CLIMA APP\n'.rainbow);
    console.log('============================'.green);
    console.log('   Seleccione una opción'.white);
    console.log('============================\n'.green);

    const option = await inquirer.prompt(menuOpts);

    return option;
}

// mensaje de enter para que la persona continue
const enter =[
    {
        type:'input',
        name: 'enter',
        message: `Presione ${'ENTER'.blue} para volver al menú principal.\n`,
    }
];

// funcion async() para que haga una pausa antes del enter del usuario
const pausa = async()=>{
    console.log(''); //deja un salto de linea 
    
    const pausa = await inquirer.prompt(enter);
    return pausa;
};

// funcion async() que se le pasa el mensaje que escribe el usuario como input para que se vea en la consola
const leerInput = async(message)=>{
    const pregunta = [
        {
            type:'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true
            }
        }];
    const {desc} = await inquirer.prompt(pregunta);
    return desc;
};


//lista de tareas para borrar una tarea 
const listarLugares = async(lugares = [])=>{
    const choices = lugares.map((lugar, i) =>{
        i++;
        return {
            value: lugar.id,
            name: `${i}. ${lugar.nombre}`,  
        }
    });

    choices.push({
        value: 0,
        name: '- Cancelar\n'
    });

    const pregunta =[
        {
            type: 'list',
            name:'id',
            message: 'Seleccione el lugar que quiere consultar\n',
            choices
        }
    ];

    console.log(''); //deja un salto de linea
    const id = await inquirer.prompt(pregunta);
    return id;
};



// exportar funciones
module.exports={
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
}