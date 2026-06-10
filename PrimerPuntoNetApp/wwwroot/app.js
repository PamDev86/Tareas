async function cargarTareas() {
    const res = await fetch("https://localhost:44351/api/tareas");
    const data = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    data.forEach(t => {
        lista.innerHTML += `<li class="list-group-item">
            ${t.titulo }
            <button class="btn btn-danger btn-sm" onclick="eliminarTarea(${t.id})">
                Eliminar
            </button>
        </li>`;
    });
}

async function crearTarea() {
    const titulo = document.getElementById("titulo").value;

    await fetch("https://localhost:44351/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titulo: titulo,
            completada: false
        })
    });

    if (!titulo.trim()) {
        alert("Escribe una tarea")
        return;
    }

    document.getElementById("titulo").value = "";

    cargarTareas(); //Refresca la lista
}

async function eliminarTarea(id) {
    await fetch(`https://localhost:44351/api/tareas/${id}`, {
        method: "DELETE",        
    });

    cargarTareas(); //Refresca la lista
}

cargarTareas();