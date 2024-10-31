let ready = () => {
    console.log('DOM está listo')
    getData();
}

const databaseURL = 'https://landing-f3011-default-rtdb.firebaseio.com/coleccion.json';

let sendData = () => {
    //Obtener los datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); //Convierte formData a objeto

    //new Date().toLocaleDateString( locales, options );
    data['saved'] = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(databaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ${response.statusText}');
            }
            return response.json(); //procesa la respuesta como JSON
        })
        .then(result => { //result es el resultado de response.JSON
            alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces');
            form.reset();

            getData();
        })
        .catch(error => { //recibe el error cuando alguno de los elementos de la cadena de responsabilidad (.then) arroja algun error
            alert('Hemos experimentado un error. ¡Vuelve pronto!');
        })
}

let getData = async () => {
    try {
        // Realiza la petición fetch a la URL de la base de datos
        const response = await fetch(databaseURL, {
            method: 'GET'
        });

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
        }

        // Convierte la respuesta en formato JSON
        const data = await response.json();

        if (data != null) {

            // Cuente el número de suscriptores registrados por fecha a partir del objeto data
            let countSuscribers = new Map()
            if (Object.keys(data).length > 0) {
                for (let key in data) {

                    let { email, saved } = data[key]

                    let date = saved.split(",")[0]

                    let count = countSuscribers.get(date) || 0; //el operador binario || permite hacer una especie de if para asignar un valor dependiendo de la respuesta
                    countSuscribers.set(date, count + 1)
                }
            }

            // END

            // Genere y agregue filas de una tabla HTML para mostrar fechas y cantidades de suscriptores almacenadas 
            if (countSuscribers.size > 0) {

                subscribers.innerHTML = ''

                let index = 1;
                for (let [date, count] of countSuscribers) {
                    let rowTemplate = `
                    <tr>
                        <th>${index}</th>
                        <td>${date}</td>
                        <td>${count}</td>
                    </tr>`

                    subscribers.innerHTML += rowTemplate
                    index++;
                }
            }

            // END

        }

    } catch (error) {
        // Muestra cualquier error que ocurra durante la petición
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje

    }
}

let loaded = () => {
    //console.log('Iframes e Images cargadas')
    let myform = document.getElementById('form');

    myform.addEventListener("submit", (eventSubmit) => {
        eventSubmit.preventDefault();

        let emailElement = document.querySelector('.form-control-lg');
        let emailText = emailElement.value;

        if (emailText.length === 0) {
            emailElement.focus();
            emailElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            )

            return;
        }

        sendData();
    });


}


window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded);

