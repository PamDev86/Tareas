using Microsoft.EntityFrameworkCore;
using PrimerPuntoNetApp.Models;

namespace PrimerPuntoNetApp.Data
{
    public class AppDbContext : DbContext
    {
        //Constructor del contexto, es decir la configuracion de la BD
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) //y la configuracion se manda a la clase padre DbContext
        { }

        //Representa una tabla en la base de datos
        //es decir, habrá una tabla llamada Tareas con columnas basadas en la clase Tarea
        public DbSet<Tarea> Tareas { get; set; }
    }
}
