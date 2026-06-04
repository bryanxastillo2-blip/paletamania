// 1. Configuración de tu proyecto de Firebase (Reemplaza estos datos con los que te dé la consola de Firebase)
const firebaseConfig = {
   apiKey: "AIzaSyAykcwD2XfgdBS1y5Sq-zvW0_OYeXUJlME",
  authDomain: "paletamania-7a282.firebaseapp.com",
  projectId: "paletamania-7a282",
  storageBucket: "paletamania-7a282.firebasestorage.app",
  messagingSenderId: "960877546785",
  appId: "1:960877546785:web:5e9730b13305f187768260"
};

// 2. Inicializar Firebase y Firestore (Usando los scripts cargados en el navegador)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3. Referencias a los elementos del HTML
const contenedorReseñas = document.getElementById('contenedor-reseñas-dinamicas');
const formularioReseña = document.getElementById('form-nueva-reseña');

// ==========================================
// FUNCIÓN 1: LEER LAS RESEÑAS DE LA BD Y MOSTRARLAS
// ==========================================
function cargarReseñas() {
    // Escucha la colección "reseñas" ordenada por fecha para traer las más recientes primero
    db.collection("reseñas").orderBy("fecha", "desc").onSnapshot((snapshot) => {
        // Limpiamos el contenedor (quitamos el mensaje de "Cargando...")
        contenedorReseñas.innerHTML = "";

        if (snapshot.empty) {
            contenedorReseñas.innerHTML = `<p class="cargando-texto">¡Sé el primero en dejar una reseña para Paletamanía! 🍓</p>`;
            return;
        }

        // Iteramos sobre cada documento almacenado en la base de datos
        snapshot.forEach((doc) => {
            const datos = doc.data();
            
            // Convertimos el número de estrellas en emojis de estrellas de forma dinámica
            const estrellasEmoji = "⭐".repeat(parseInt(datos.estrellas));

            // Creamos la estructura de la tarjeta HTML para cada comentario
            const tarjetaHTML = `
                <div class="tarjeta-comentario">
                    <h4>${datos.nombre}</h4>
                    <div class="estrellas-comentario">${estrellasEmoji}</div>
                    <p class="texto-comentario">"${datos.comentario}"</p>
                </div>
            `;
            
            // Inyectamos la tarjeta real en el contenedor de nuestra página
            contenedorReseñas.innerHTML += tarjetaHTML;
        });
    }, (error) => {
        console.error("Error al traer las reseñas: ", error);
        contenedorReseñas.innerHTML = `<p class="cargando-texto">Hubo un problema al cargar los comentarios.</p>`;
    });
}

// ==========================================
// FUNCIÓN 2: GUARDAR UNA NUEVA RESEÑA EN LA BD
// ==========================================
formularioReseña.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitamos que la página se recargue al enviar el formulario

    // Capturamos los datos que el usuario escribió en las cajas de texto
    const nombreUsuario = document.getElementById('reseña-nombre').value;
    const estrellasUsuario = document.getElementById('reseña-estrellas').value;
    const comentarioUsuario = document.getElementById('reseña-comentario').value;

    // Enviamos el objeto con los datos directo a la colección de Firebase
    db.collection("reseñas").add({
        nombre: nombreUsuario,
        estrellas: estrellasUsuario,
        comentario: comentarioUsuario,
        fecha: new Date() // Guardamos la fecha exacta del sistema
    })
    .then(() => {
        // Al guardarse con éxito, limpiamos las cajas de texto del formulario
        formularioReseña.reset();
        alert("¡Gracias! Tu reseña se ha publicado de forma inmediata.");
    })
    .catch((error) => {
        console.error("Error al guardar la reseña: ", error);
        alert("No se pudo publicar tu reseña en este momento. Inténtalo de nuevo.");
    });
});

// Ejecutar la lectura de comentarios en cuanto cargue la página
window.addEventListener('DOMContentLoaded', cargarReseñas);
