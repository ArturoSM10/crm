import { form, nombreInput, emailInput, telefonoInput, empresaInput, tableBody, editarBtn, submitBtn } from './selectores.js';
import { ui } from './variables.js';

let db;

function abrirBase() {
    const abrir = window.indexedDB.open(`AdminClientes`, 1);

    abrir.onerror = () =>{
        console.log(`error`);
    }
    abrir.onsuccess = (e) => {
        db = e.target.result;
        leerBase();
    };
    abrir.onupgradeneeded = (e) => {
        const base = e.target.result;
        const almacen = base.createObjectStore(`Clientes`, {keyPath: `id`});

        almacen.createIndex(`nombre`, `nombre`, {unique: false});
        almacen.createIndex(`email`, `email`, {unique: true});
        almacen.createIndex(`telefono`, `telefono`, {unique: false});
        almacen.createIndex(`empresa`, `empresa`, {unique: false});
    }
}

export function cargarClientes() {
    abrirBase();
    leerBotones();
}

export function iniciarPaginaFormulario() {
    abrirBase();
    eventoFormulario();
}

function eventoFormulario() {    
    form.addEventListener(`submit`, validarFormulario);
}
function validarFormulario(e) {
    e.preventDefault();
    const infoCampos = {
        nombre: nombreInput.value.trim(),
        email: emailInput.value.trim(),
        telefono: telefonoInput.value.trim(),
        empresa: empresaInput.value.trim()
    };

    const { email, telefono } = infoCampos;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const telefonoRegex = /^\d+$/;

    if(Object.values(infoCampos).some (cliente => cliente === ``)) {
        ui.crearAlerta(`Todos los campos son obligatorios`, `incorrecto`);
        return;
    }

    if(!emailRegex.test(email)) {
        ui.crearAlerta(`El campo email es incorrecto`, `incorrecto`);
        return;
    }

    if(!telefonoRegex.test(telefono)) {
        ui.crearAlerta(`El campo telefono es incorrecto`, `incorrecto`);
        return;
    }

    ui.crearAlerta(`Cliente agregado exitosamente`, `correcto`);
    agregarCliente(infoCampos);
    form.reset();
}

function agregarCliente(objeto) {
    const id = Number(new URL(window.location.href).searchParams.get(`id`));
    if (id) {
        objeto.id = id;
        editarCliente(objeto);
        return;
    }

    objeto.id = Date.now();
    const transaccion = db.transaction([`Clientes`], `readwrite`);
    const almacen = transaccion.objectStore(`Clientes`);
    almacen.add(objeto);
    setTimeout(()=>{
        window.location.href = `./index.html`;
    },3000);
}

function leerBase() {
    if(window.location.href.includes(`?id=`)) {
        cargarInfoEditar();
        return;
    }

    if(window.location.href.includes(`nuevo-cliente`)) return;
    const transaccion = db.transaction([`Clientes`], `readonly`);
    const almacen = transaccion.objectStore(`Clientes`);

    const puntero = almacen.openCursor();
    puntero.onsuccess = (e)=>{
        const puntero = e.target.result;
        if(puntero) {
            ui.agregarCliente(puntero.value);
            puntero.continue();
        }
    };
}

function eliminarCliente(id) {
    const transaccion = db.transaction([`Clientes`], `readwrite`);
    const almacen = transaccion.objectStore(`Clientes`);
    almacen.delete(id);

}

function editarCliente(objeto) {
    const transaccion = db.transaction([`Clientes`], `readwrite`);
    const almacen = transaccion.objectStore(`Clientes`);
    almacen.put(objeto);
    setTimeout(()=>{
        window.location.href = `./index.html`;
    },3000);
}

function leerBotones() {
    tableBody.addEventListener(`click`, gestionarBtn);
}

function gestionarBtn(e) {
    e.preventDefault();
    if (!e.target.classList.contains(`btn__editar`) && !e.target.classList.contains(`btn__eliminar`)) return;

    const id = Number(e.target.closest(`tr`).dataset.id);

    if(e.target.classList.contains(`btn__editar`)) {
        window.location.href = `./nuevo-cliente.html?id=${id}`
        return;
    }
    if(e.target.classList.contains(`btn__eliminar`)) {
        eliminarCliente(id);
        ui.eliminarCliente(id);
        return;
    }
}

function cargarInfoEditar() {
    const id = Number(new URL(window.location.href).searchParams.get(`id`));

    const transaccion = db.transaction([`Clientes`], `readonly`);
    const almacen = transaccion.objectStore(`Clientes`);
    const puntero = almacen.get(id);

    puntero.onsuccess = (e)=> {
        const {nombre, email, telefono, empresa} = puntero.result;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;

        submitBtn.value = `editar Cliente`
    }

}