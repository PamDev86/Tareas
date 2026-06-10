using Microsoft.AspNetCore.Mvc;
using PrimerPuntoNetApp.Models; 
using PrimerPuntoNetApp.Data;

namespace PrimerPuntoNetApp.Controllers
{
    //Hace que se comporte como API
    [ApiController]
    //Define la ruta base para las solicitudes HTTP que llegan al controlador.
    [Route("api/[controller]")]
    public class TareasController : Controller
    {
        //Base de datos temporal quue se borra al reinicar la app
        //private static List<Tarea> tareas = new List<Tarea>(); --> Se elimina porque la BD es mi lista ahora

        //Esto se llama inyección de dependencias
        //.NET te da automáticamente el acceso a la BD
        //tu API deja de usar memoria y empieza a usar la base de datos real.
        private readonly AppDbContext _context;

        public TareasController(AppDbContext context)
        {
            _context = context;
        }

        //Responde a solicitudes de obtener datos
        [HttpGet]

        //Metodo que se ejecuta cuando llaman GET /api/tareas
        public IActionResult Obtener()
        {
            //Devuelve codigo 200 con datos en JSON
            //return Ok(tareas);
            //Sustituye el codigo que se habia eliminado de la L14
            return Ok(_context.Tareas.ToList());
        }

        //Responde a solicitudes de crear datos
        [HttpPost]

        //FromBody: toma datos del JSON que envia el cliente
        //Tarea tarea: convierte JSON a objeto C#
        public IActionResult Crear([FromBody] Tarea tarea)
        {
            //tarea.Id = tareas.Count + 1;
            //tareas.Add(tarea);
            _context.Tareas.Add(tarea);
            _context.SaveChanges();
            return Ok(tarea); //Se devuelve lo que se creo
        }

        [HttpPut("{id}")]
        public IActionResult Actualizar(int id, [FromBody] Tarea tareaActualizada)
        {
            var tarea = _context.Tareas.FirstOrDefault(t => t.Id == id);

            if (tarea == null)
                return NotFound();

            tarea.Titulo = tareaActualizada.Titulo;
            tarea.Completada = tareaActualizada.Completada;

            _context.SaveChanges();
            return Ok(tarea);
        }

        [HttpDelete("{id}")]
        public IActionResult Eliminar(int id)
        {
            var tarea = _context.Tareas.FirstOrDefault(t => t.Id == id);

            if (tarea == null)
                return NotFound();

            _context.Tareas.Remove(tarea);
            _context.SaveChanges();

            return Ok(tarea);
        }
    }
}
