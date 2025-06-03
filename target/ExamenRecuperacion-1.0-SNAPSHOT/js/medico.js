document.addEventListener('DOMContentLoaded', function () {
  let table = new DataTable('#example', {
    ajax: {  
      url: 'medico'
    },
    columns: [
      { data: 'codigo' },
      { data: 'nombre' },
      { data: 'appa' },
      { data: 'apma' },
      { data: 'ndni' },
      {
        data: 'fechnaci',
        render: function (data) {
          return moment(data, 'ddd MMM DD HH:mm:ss z YYYY').format('YYYY-MM-DD');
        }
      },
      { data: 'username' },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          return `<button class="btn-eliminar btn btn-danger" data-id='${row.codigo}'>Eliminar</button>`;
        }
      },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          return `<button class="btn-editar btn btn-primary" data-alumno='${encodeURIComponent(JSON.stringify(row))}'>Editar</button>`;
        }
      }
    ]
  });

  // Función para agregar alumno (igual que antes)
  agregarAlumno(table);

  // Manejo de botones dentro de la tabla (delegación)
  document.querySelector('#example tbody').addEventListener('click', async function (e) {

    // EDITAR
    if (e.target.classList.contains('btn-editar')) {
      // Obtener el JSON decodificado
      let alumno = JSON.parse(decodeURIComponent(e.target.getAttribute('data-alumno')));

      // Rellenar formulario con datos
      document.querySelector('#newnombre').value = alumno.nombre;
      document.querySelector('#newappa').value = alumno.appa;
      document.querySelector('#newapma').value = alumno.apma;
      document.querySelector('#newndni').value = alumno.ndni;
      const fechaFormateada = moment(alumno.fechnaci, 'ddd MMM DD HH:mm:ss z YYYY').format('YYYY-MM-DD');
      document.querySelector('#newfechnaci').value = fechaFormateada;
      document.querySelector('#newusername').value = alumno.username;

      // Abrir modal (si usas Bootstrap con jQuery)
      $('#exampleModal').modal('show');

      // Evitar múltiples bindings, primero eliminar event listener previo
      const formActualizar = document.getElementById("frm-actualizar-alumno");
      formActualizar.onsubmit = null;

      // Crear el nuevo listener para el submit
      formActualizar.onsubmit = async function (ev) {
        ev.preventDefault();

        const alumNuevo = {
          codigo: alumno.codigo,
          nombre: document.querySelector('#newnombre').value,
          appa: document.querySelector('#newappa').value,
          apma: document.querySelector('#newapma').value,
          ndni: document.querySelector('#newndni').value,
          fechnaci: document.querySelector('#newfechnaci').value,
          username: document.querySelector('#newusername').value
        };

        try {
          const resp = await fetch("http://localhost:8080/ExamenRecuperacion/medico", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(alumNuevo)
          });

          const result = await resp.json();

          if (!result.success) {
            alert("Error al actualizar el registro");
            return;
          }

          alert("Registro actualizado correctamente");
          $('#exampleModal').modal('hide');

          // Recargar tabla sin resetear paginación
          table.ajax.reload(null, false);

        } catch (error) {
          console.error("Error en la actualización:", error);
          alert("Error al actualizar el registro");
        }
      };
    }

    // ELIMINAR
    if (e.target.classList.contains('btn-eliminar')) {
      let codigo = e.target.getAttribute('data-id');
      if (!confirm("¿Estás seguro de eliminar este registro?")) return;

      const idCliente = {
        codigo: parseInt(codigo)
      };

      try {
        const resp = await fetch("http://localhost:8080/ExamenRecuperacion/medico", {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify(idCliente)
        });

        const result = await resp.json();

        if (!result.success) {
          alert("Error al eliminar");
          return;
        }

        alert("Registro eliminado");
        table.ajax.reload(null, false);
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar registro");
      }
    }
  });

});

// Función para agregar alumno, igual que la que ya tienes
function agregarAlumno(table) {
  const frmCreate = document.querySelector('#frm-crear');

  frmCreate.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(frmCreate);
    const data = Object.fromEntries(formData.entries());

    try {
      const resp = await fetch("http://localhost:8080/ExamenRecuperacion/medico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(data)
      });

      const result = await resp.json();
      if (!result.success) {
        alert("Error al crear registro");
        return;
      }
      alert("Registro creado");
      frmCreate.reset();
      table.ajax.reload(null, false);

    } catch (error) {
      console.error("Error al crear:", error);
      alert("Error al crear registro");
    }
  });
}
