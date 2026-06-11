const API = "https://localhost:44351/api/tareas";

// ABRIR / CERRAR MENU
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

// CAMBIAR SECCIONES
function mostrarSeccion(id) {

    // Mostrar contenido general
    document.querySelector(".contenido").classList.add("active");

    // Ocultar todas las secciones
    document.querySelectorAll(".seccion").forEach(s => s.classList.add("d-none"))

    // Mostrar seleccionada
    document.getElementById(id).classList.remove("d-none");
}

// CREAR TAREA

async function crearTarea() {
    const titulo = document.getElementById("titulo").value;

    if (!titulo.trim()) {
        alert("Escribe una tarea")
        return;
    }

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titulo: titulo,
            completada: false
        })
    });

    document.getElementById("titulo").value = "";

    cargarTareas(); //Refresca la lista

    alert("Tarea creada");
}

// CARGAR TAREAS
async function cargarTareas() {
    const res = await fetch(API);
    const data = await res.json();

    const lista = document.getElementById("listaTareas");

    lista.innerHTML = "";

    data.forEach(t => {
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

                <button class="btn btn-danger btn-sm" onclick="eliminarTarea(${t.id})">
                    Eliminar
                </button>
            
            </li>
        `;
    });
}

async function toggleCompletada(id, estado) {
    const res = await fetch(API);
    const tareas = await res.json();

    const tarea = tareas.find(t => t.id === id);

    await fetch(`${API}/${id}`, {
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

// ELIMINAR TAREA
async function eliminarTarea(id) {
    await fetch(`${API}/${id}`, {
        method: "DELETE",
    });

    cargarTareas(); //Refresca la lista
}

// PDF
async function generarPDF() {
    const res = await fetch(API);
    const tareas = await res.json();

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    //Titulo
    doc.setFontSize(18);
    doc.text("Lista de tareas", 20, 20);

    //Encabezados
    let y = 40;

    doc.setFillColor(46, 204, 113); //Verde

    doc.setFontSize(12);
    doc.rect(20, y - 7, 120, 10, "FD");//Columna Tarea: horizonal, vertical, ancho del rectangulo, alto rectangulo, estilo
    doc.rect(140, y - 7, 40, 10, "FD");//Columna Completada: x, y, ancho, alto, estilo

    doc.setFont(undefined, "bold");
    doc.text("Tarea", 25, y);
    doc.text("Completada", 145, y);

    doc.setFont(undefined, "normal");

    y += 10;

    //Filas
    tareas.forEach((t, index) => {

        doc.rect(20, y - 7, 120, 10);
        doc.rect(140, y - 7, 40, 10);

        doc.text(t.titulo, 25, y);

        if (t.completada)
            doc.text("X", 155, y);

        y += 10;
    });

    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 20, 30);

    doc.save("tareas.pdf");
}

// INICIO
cargarTareas();