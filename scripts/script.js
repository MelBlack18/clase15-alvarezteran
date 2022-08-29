//Constante para manejar la libreria Luxon para imprimir la fecha y hora
const DateTime = luxon.DateTime

//Constante con las credenciales para la API
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '9f395de39cmsh265366f06f1faa2p164201jsn60af8a77cc35',
		'X-RapidAPI-Host': 'food-unit-of-measurement-converter.p.rapidapi.com'
	}
}

//Funcion que llama a la API pasando como parámetros los valores que se necesitan para los parámetros de la query y la unidad de destino para poder usarla después
function convertir(unidadInicial, ingredientes, cantidadInicial, unidadDestino) {

    fetch(`https://food-unit-of-measurement-converter.p.rapidapi.com/convert?unit=${unidadInicial}&ingredient=${ingredientes}&value=${cantidadInicial}`, options)
	.then(response => response.json())
	.then(response => resultadoApi(unidadDestino,response))
	.catch(err => console.error(err)) 
}

// Objeto que tiene todos los datos base necesarios para operar
let datosBase = {
    unidadInicial : "",
    unidadInicialEs: "",
    unidadDestino : "",
    unidadDestinoEs : "",
    cantidadInicial : 0,
    unidades : [
        "mililitros",
        "tazas",
        "gramos",
        "onzas"
    ],
    ingrediente : "",
    ingredienteEs: ""
}

//Variable para poder guardar todos los resultados en el Local Storage como objetos diferentes en la misma clave
let idResultado
//Variable para almacenar el array del Storage
let resultadoStorage

// Variable para obtener el botón de "Borrar Historial"
let borrarHistorial = document.getElementById("borrarHistorial")

// Al hacer click en el botón se elimina el historial del Local Storage y se recarga el sitio
borrarHistorial.onclick = (e) => {
    localStorage.clear()
    location.reload()
}

//Evalúo antes de empezar si ya hay algo en el storage o no y almaceno en las variables los datos previos si los hubiera 
if (localStorage.getItem("resultados") == null) {
    
    idResultado = 0
    resultadoStorage = []

} else {
    
    idResultado = JSON.parse(localStorage.getItem("resultados")).length
    resultadoStorage = JSON.parse(localStorage.getItem("resultados"))

    for (let i = 0; i < idResultado; i++) {
        //Creo una etiqueta P para imprimir el resultado, y voy a buscar el div en donde lo quiero imprimir
        let result = document.createElement("p")
        let resultadoFinal = document.getElementById("historial")

        //Le agrego el texto al p
        result.innerText = `${resultadoStorage[i].fechayhora} - ${resultadoStorage[i].cantInicial} ${resultadoStorage[i].unInicial} de ${resultadoStorage[i].ingredient} equivalen a ${resultadoStorage[i].resultOp} ${resultadoStorage[i].unDestino} de ${resultadoStorage[i].ingredient}`
        
        //Imprimo el p en el div
        resultadoFinal = resultadoFinal.append(result)
    }
}

//Creo un constructor para el objeto que se envía al LocalStorage
function storeResultado(id,cantinicial,uninicial,resultop,undestino,horaFecha,ingrediente) {
    this.id = id,
    this.cantInicial = cantinicial,
    this.unInicial = uninicial,
    this.resultOp = resultop,
    this.unDestino = undestino,
    this.fechayhora = horaFecha,
    this.ingredient = ingrediente 
}

//Busco los eventos Change de cada campo del formulario y almaceno los valores de cada uno en el objeto datosBase

let obtenerCantidad = document.querySelector("#cantidadInicial")

obtenerCantidad.onchange = (e) => { datosBase.cantidadInicial = obtenerCantidad.value }

let obtenerUnidadInicial = document.getElementById("unidadInicial")

// En el onchange de las unidades y los ingredientes hago un switch que para cada posible valor guarda su equivalente en Español para poder mostrar el texto correctamente en el front

obtenerUnidadInicial.onchange = (e) => { 
    datosBase.unidadInicial = obtenerUnidadInicial.value 

    switch (datosBase.unidadInicial) {
        case "grams":
            datosBase.unidadInicialEs = "Gramos"
            break;
        case "cups":
            datosBase.unidadInicialEs = "Tazas"
            break;
        case "oz":
            datosBase.unidadInicialEs = "Onzas"
            break;
        case "milliliters":
            datosBase.unidadInicialEs = "Mililitros"
            break;
        default:
            datosBase.unidadInicialEs = ""
            break;
    }

    return datosBase.unidadInicial, datosBase.unidadInicialEs
}

let obtenerUnidadFinal = document.getElementById("unidadFinal")

obtenerUnidadFinal.onchange = (e) => { 
    datosBase.unidadDestino = obtenerUnidadFinal.value 

    switch (datosBase.unidadDestino) {
        case "grams":
            datosBase.unidadDestinoEs = "Gramos"
            break;
        case "cups":
            datosBase.unidadDestinoEs = "Tazas"
            break;
        case "oz":
            datosBase.unidadDestinoEs = "Onzas"
            break;
        case "milliliters":
            datosBase.unidadDestinoEs = "Mililitros"
            break;
        default:
            datosBase.unidadDestinoEs = ""
            break;
    }

    return datosBase.unidadDestino, datosBase.unidadDestinoEs
}

let obtenerIngrediente = document.getElementById("ingredientes")

obtenerIngrediente.onchange = (e) => { 
    datosBase.ingrediente = obtenerIngrediente.value 

    switch (datosBase.ingrediente) {
        case "sugar":
            datosBase.ingredienteEs = "azucar"
            break;
        case "flour":
            datosBase.ingredienteEs = "harina"
            break;
        case "butter":
            datosBase.ingredienteEs = "manteca"
            break;
        case "water":
            datosBase.ingredienteEs = "líquido"
            break;
        default:
            datosBase.ingredienteEs = ""
            break;
    }

    return datosBase.ingrediente, datosBase.ingredienteEs

}

// Funcion que evalua con un switch cuál es la Unidad de Destino y según cual sea envía el valor a la función que imprime los datos en el Front
function resultadoApi(unidadDestino,respuestaApi) {

    switch (unidadDestino) {
        case "cups":
            agregarResultado(respuestaApi.cups)
            break;
        case "grams":
            agregarResultado(respuestaApi.grams)
            break;
        case "milliliters":
            agregarResultado(respuestaApi.milliliters)
            break;
        case "oz":
            agregarResultado(respuestaApi.oz)
            break;
        default:
            //Creo una etiqueta P para imprimir el resultado, y voy a buscar el div en donde lo quiero imprimir
            let result = document.createElement("p")
            let operacionErronea = document.getElementById("resultados")

            //Le agrego el texto al p
            result.innerText = "Intentaste hacer una operación no contemplada. Probá de nuevo"
            
            //Imprimo el p en el div
            operacionErronea = operacionErronea.append(result)

            break;
    }
    
}

//Funcion para agregar el resultado final al LocalStorage y al HTML
function agregarResultado (operacion) {

    //Sumo 1 a la variable idResultado para cambiar el ID cada vez que agrego uno nuevo
    idResultado += 1

    //Guardo el resultado de la operación que se realizó en una variable local
    let resultadoOperacion = operacion.toFixed(2)

    //Creo una variable que tome la fecha y hora exacta en la que se hizo la operación
    let dt = DateTime.now()
    
    //Voy guardando en el array del Storage un objeto nuevo con los resultados
    resultadoStorage.push(new storeResultado(idResultado,datosBase.cantidadInicial,datosBase.unidadInicialEs,resultadoOperacion,datosBase.unidadDestinoEs,dt.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS),datosBase.ingredienteEs))

    //Mando, parseando previamente, el objeto al LocalStorage
    localStorage.setItem("resultados",JSON.stringify(resultadoStorage))

    agregarHTML(resultadoOperacion)
}

//Función para agregar los resultados al HTML

function agregarHTML(resultOperacion) {
    let resultadoOperacion = resultOperacion
    let resultadoFinal = document.querySelector(".ultimoResultado")

    //Evalúo si ya existen resultados impresos en pantalla o no. 
    //Si existe primero lo borro y cuando imprimo el nuevo, imprimo al final del Historial el anterior, si no existe se crea.
    if (resultadoFinal.firstChild != null) {
    
        //Borro el resultado anterior
        resultadoFinal.firstChild.remove()

        //Agrego el nuevo resultado
        resultadoFinal.innerHTML = `<p class="res">${datosBase.cantidadInicial} ${datosBase.unidadInicialEs} de ${datosBase.ingredienteEs} equivalen a ${resultadoOperacion} ${datosBase.unidadDestinoEs} de ${datosBase.ingredienteEs}</p>`

        //Creo la etiqueta para guardar el valor que borré en "Historial"
        let resultHist = document.createElement("p")
        let historial = document.getElementById("historial")

        //Uso la variable "idResultado" como índice para buscar el último dato agregado al array del Storage
        let arrayStorage = idResultado-2

        //Le agrego el texto al p
        resultHist.innerText = `${resultadoStorage[arrayStorage].fechayhora} - ${resultadoStorage[arrayStorage].cantInicial} ${resultadoStorage[arrayStorage].unInicial} de ${resultadoStorage[arrayStorage].ingredient} equivalen a ${resultadoStorage[arrayStorage].resultOp} ${resultadoStorage[arrayStorage].unDestino} de ${resultadoStorage[arrayStorage].ingredient}`
        
        //Imprimo el p en el div
        historial = historial.append(resultHist)

    } else {
        //Imprimo el resultado en el p
        resultadoFinal.innerHTML = `<p class="res">${datosBase.cantidadInicial} ${datosBase.unidadInicialEs} de ${datosBase.ingredienteEs} equivalen a ${resultadoOperacion} ${datosBase.unidadDestinoEs} de ${datosBase.ingredienteEs}</p>`
    }

}

//Busco el elemento form y sobre el evento submit del mismo ejecuto la función que calcula la conversión
let formulario = document.getElementById("conversor")

formulario.onsubmit = (e) => {

    e.preventDefault()

    convertir(datosBase.unidadInicial, datosBase.ingrediente, datosBase.cantidadInicial, datosBase.unidadDestino)
}