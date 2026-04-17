import { main, tableBody } from '../selectores.js';
export class UI { 
    crearAlerta(texto, tipo) {
        const siExiste = [...document.querySelectorAll('.alerta')];

        if (siExiste.some(existe => existe.textContent === texto)) return;

        const alerta = document.createElement(`P`);
        alerta.classList.add(`alerta`, `${tipo}`);
        alerta.textContent = texto;
        main.appendChild(alerta);
        setTimeout(()=>{
            alerta.remove()
        },3000);
    }

    agregarCliente(objeto) {
        const { nombre, email, telefono, empresa, id } = objeto;
        const trElement = document.createElement(`TR`);
        trElement.dataset.id = `${id}`;

    
        trElement.innerHTML = `
        <tr>
            <td class="nombre">
                <h3>${nombre}</h3>
                <p>${email}</p>
            </td>
            <td class="telefono">${telefono}</td>
            <td class="empresa">${empresa}</td>
            <td class="acciones">
                <div class="btn">
                    <a class="btn__editar" href="#">Editar</a>
                    <a class="btn__eliminar" href="#">Eliminar</a>
                </div>
            </td>
        </tr>
        `;
        tableBody.appendChild(trElement);
    }

    eliminarCliente(id) {
        document.querySelector(`[data-id ="${id}"]`).remove();
    }

}