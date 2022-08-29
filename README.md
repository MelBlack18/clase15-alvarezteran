# Clase 15 - Fetch

La app permite convertir unidades de medida utilizadas en pastelería, ingresando un valor y eligiendo ambas unidades, y mostrando en pantalla el resultado.

Los resultados anteriores se guardan en un Historial en el Local Storage que además se muestra también en pantalla.

Se usó la librería Luxon para imprimir fecha y hora exacta tanto en pantalla como en el Local Storage

El cálculo de la conversión se realiza mediante el fetch a una API que con los parámetros de Ingrediente, Cantidad y Unidad a Convertir devuelve un objeto con varias equivalencias de unidades. Link de la API: https://rapidapi.com/smilebot/api/food-unit-of-measurement-converter/ 