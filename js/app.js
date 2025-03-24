// Variables
const listaTweets = document.querySelector("#lista-tweets");
const formulario = document.querySelector("#formulario");
const tweetInput = document.querySelector("#tweet");
const btnSubmit = document.querySelector("#btn-submit");
const mensajeEdicion = document.querySelector("#mensaje-edicion");
let tweets = [];
let tweetEditando = null; // Para saber si estamos editando

// Event Listeners
eventListeners();

function eventListeners() {
    formulario.addEventListener("submit", agregarTweet);
    listaTweets.addEventListener("click", manejarClicks);
    document.addEventListener("DOMContentLoaded", () => {
        tweets = JSON.parse(localStorage.getItem("tweets")) || [];
        crearHTML();
    });
}

// Añadir o editar tweet
function agregarTweet(e) {
    e.preventDefault();
    const texto = tweetInput.value.trim();

    if (texto === "") {
        mostrarError("Un mensaje no puede ir vacío");
        return;
    }

    if (tweetEditando) {
        // Si hay un tweet en edición, actualizar su texto
        tweets = tweets.map(tweet => tweet.id === tweetEditando ? { ...tweet, texto } : tweet);
        tweetEditando = null;
        btnSubmit.value = "Agregar"; // Volver a estado original
        mensajeEdicion.style.display = "none";
    } else {
        // Crear un nuevo tweet
        const tweetObj = { id: Date.now(), texto };
        tweets.push(tweetObj);
    }

    crearHTML();
    formulario.reset();
}

// Manejar clics en "Editar" y "Borrar"
function manejarClicks(e) {
    if (e.target.classList.contains("borrar-tweet")) {
        borrarTweet(e.target.parentElement.dataset.tweetId);
    } else if (e.target.classList.contains("editar-tweet")) {
        cargarEdicion(e.target.parentElement.dataset.tweetId);
    }
}

// Mostrar mensaje de error
function mostrarError(error) {
    const mensajeError = document.createElement("p");
    mensajeError.textContent = error;
    mensajeError.classList.add("error");

    const contenido = document.querySelector("#contenido");
    contenido.appendChild(mensajeError);

    setTimeout(() => mensajeError.remove(), 3000);
}

// Crear HTML con los tweets
function crearHTML() {
    limpiarHTML();

    tweets.forEach(tweet => {
        const li = document.createElement("li");
        li.innerText = tweet.texto;
        li.dataset.tweetId = tweet.id;

        const botonBorrar = document.createElement("a");
        botonBorrar.classList.add("borrar-tweet");
        botonBorrar.innerText = "X";

        const botonEditar = document.createElement("a");
        botonEditar.classList.add("editar-tweet");
        botonEditar.innerText = "Editar";

        li.appendChild(botonBorrar);
        li.appendChild(botonEditar);
        listaTweets.appendChild(li);
    });

    sincronizarStorage();
}

// Cargar mensaje en edición
function cargarEdicion(id) {
    const tweetSeleccionado = tweets.find(tweet => tweet.id == id);
    tweetInput.value = tweetSeleccionado.texto;
    tweetEditando = tweetSeleccionado.id;
    btnSubmit.value = "Actualizar"; // Cambiar el botón a "Actualizar"
    mensajeEdicion.style.display = "block"; // Mostrar el mensaje de edición
}

// Eliminar tweet
function borrarTweet(id) {
    tweets = tweets.filter(tweet => tweet.id != id);
    crearHTML();
}

// Guardar en localStorage
function sincronizarStorage() {
    localStorage.setItem("tweets", JSON.stringify(tweets));
}

// Limpiar lista de mensajes
function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}
