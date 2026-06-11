function mostrarApp() {
    document.getElementById("app").classList.add("active");
}
function ocultarApp() {
    document.getElementById("app").classList.remove("active");
}

async function cargarTareas() {
    const res = await fetch("https://localhost:44351/api/tareas");
    const data = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    data.forEach(t => {
        /*input type="checkbox" → crea el checklist
          checked → si está completada
          onchange → cuando lo clickeas
          line-through → texto tachado, solo es algo estetico*/
        lista.innerHTML += `
            <li class="list-group-item d-flex justify-content-left align-items-center">
            <div>
                <input type="checkbox"
                    ${t.completada ? "checked" : ""}
                    onchange="toggleCompletada(${t.id}, this.checked)">
                <span style="${t.completada ? 'text-decoration: line-through; ' : ''}">
                    ${t.titulo}&nbsp;&nbsp;&nbsp   
                </span >
            </div>
            <button class="btn btn-danger btn-sm"
                onclick="eliminarTarea(${t.id})">
                Eliminar
            </button>
        </li>`;
    });
}

async function crearTarea() {
    const titulo = document.getElementById("titulo").value;

    if (!titulo.trim()) {
        alert("Escribe una tarea")
        return;
    }

    await fetch("https://localhost:44351/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titulo: titulo,
            completada: false
        })
    });

    document.getElementById("titulo").value = "";

    cargarTareas(); //Refresca la lista
}

async function eliminarTarea(id) {
    await fetch(`https://localhost:44351/api/tareas/${id}`, {
        method: "DELETE",        
    });

    cargarTareas(); //Refresca la lista
}

async function toggleCompletada(id, estado) {
    const res = await fetch(`https://localhost:44351/api/tareas`);
    const tareas = await res.json();

    const tarea = tareas.find(t => t.id === id);

    await fetch(`https://localhost:44351/api/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            id: id,
            titulo: tarea.titulo,
            completada: estado
        })

    });

    cargarTareas(); //Refresca la lista
}

cargarTareas();