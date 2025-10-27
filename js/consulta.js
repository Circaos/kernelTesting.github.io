import { API_CONFIG, PROJECT_CONFIG } from "../config/config.js";
import { verificarSession } from "../functions/funcionesGenerales.js";

document.addEventListener("DOMContentLoaded", function () {
  const consultarBtn = document.getElementById("consultarBtn");
  // const obtenerInfoBtn = document.getElementById("obtenerInfoBtn");
  const modalBtn = document.getElementById("modalBtn");
  const tablaResultados = document.getElementById("resultadosTable").getElementsByTagName("tbody")[0];
  const loadingOverlay = document.getElementById("loadingOverlay");
  const botonDescargaExcel = document.getElementById("botonDescargaExcel");

  const sessionCode = localStorage.getItem("sessionCode");
  const horaSessionCode = localStorage.getItem("horaSessionCode");

  // Verificar sesión
  let rptVerificaSession = verificarSession(sessionCode, horaSessionCode);
  if (!rptVerificaSession.status) {
    alert(rptVerificaSession.mensaje);
    window.location.href = "index.html";
    return;
  }

  // Variables
  /**
   * @type {Array<{razonSocial: string, ruc: string, idSolicitud: string, origen: string, destino: string, fechaSalida: string, fechaLLegada: string,tractoPlaca:string,camaBajaPlaca:string,carga:string}>}
   */
  let allData = [];

  /** @type {{RsFilt: string, rucFilt: string, idSolFilt: string, origen: string, destino: string,tractoPlaca:string,camaBajaPlaca:string,carga:string}} */
  let filtroData = {
    RsFilt: "",
    rucFilt: "",
    idSolFilt: "",
    origen: "",
    destino: "",
    tractoPlaca: "",
    camaBajaPlaca: "",
    carga: "",
  };

  let varID = "";

  // Mostrar spinner
  function showLoading() {
    loadingOverlay.style.display = "flex";
  }

  // Ocultar spinner
  function hideLoading() {
    loadingOverlay.style.display = "none";
  }

  // Función para habilitar el botón "Obtener Información"
  // function enableInfoButton() {
  //   obtenerInfoBtn.disabled = false;
  //   obtenerInfoBtn.classList.add("enabled");
  // }

  // Función para deshabilitar el botón "Obtener Información"
  // function disableInfoButton() {
  //   obtenerInfoBtn.disabled = true;
  //   obtenerInfoBtn.classList.remove("enabled");
  // }

  // Funcion Pintado Tabla
  /**
   * @param {Array<{razonSocial: string, ruc: string, idSolicitud: string, origen: string, destino: string, fechaSalida: string, fechaLLegada: string}>} listaEmpresas - Este parámetro debe ser un array.
   */
  function pintadoTabla(listaEmpresas) {
    tablaResultados.innerHTML = "";
    listaEmpresas.forEach((item) => {
      let linkIDDestino = `http://autorizacionesespeciales.proviasnac.gob.pe:8080/provias48a60tn/verFormDetalleSolicitudes48tn?idSol=${item.idSolicitud}`;

      const row = tablaResultados.insertRow();
      row.insertCell(0).textContent = item.razonSocial || "-/-";
      row.insertCell(1).textContent = item.ruc || "-/-";
      // row.insertCell(2).textContent = item.idSolicitud || "-/-";
      row.insertCell(2).textContent = item.origen || "-/-";
      row.insertCell(3).textContent = item.destino || "-/-";
      row.insertCell(4).textContent = item.fechaSalida || "-/-";
      row.insertCell(5).textContent = item.fechaLLegada || "-/-";

      row.insertCell(6).textContent = item.tractoPlaca || "-/-";
      row.insertCell(7).textContent = item.camaBajaPlaca || "-/-";
      row.insertCell(8).textContent = item.carga || "-/-";

      let nuevoA = document.createElement("a");
      nuevoA.href = linkIDDestino;
      nuevoA.target = "_blank";
      nuevoA.textContent = "Ver en Provias";

      row.insertCell(9).appendChild(nuevoA);
    });
  }

  // Funcion de filtrado
  /**@param {{RsFilt: string, rucFilt: string, idSolFilt: string, origen: string, destino: string,tractoPlaca:string,camaBajaPlaca:string,carga:string}} filtro  */
  function filtrado(filtro) {
    let dataFiltrada = allData;

    const cabeceraNombreEmpresa = document.getElementById("nombreEmpresaID");
    const cabeceraRuc = document.getElementById("rucID");
    // const cabeceraIdSolicitud = document.getElementById("idSolicitudID");
    const cabeceraOrigen = document.getElementById("origenID");
    const cabeceraDestino = document.getElementById("destinoID");
    const cabeceraCamaBaja = document.getElementById("placaCamaBajaID");
    const cabeceraTracto = document.getElementById("placaTractoID");
    const cabeceraCarga = document.getElementById("cargaID");

    if (filtro.RsFilt != "") {
      cabeceraNombreEmpresa.classList.add("cabeceraFiltrada");
      cabeceraNombreEmpresa.querySelector(".iconoCabeceraTabla").textContent = "❌";
      dataFiltrada = dataFiltrada.filter(
        (item) => item.razonSocial.includes(filtro.RsFilt) || item.razonSocial.includes(filtro.RsFilt.toUpperCase())
      );
    } else {
      cabeceraNombreEmpresa.classList.remove("cabeceraFiltrada");
      cabeceraNombreEmpresa.querySelector(".iconoCabeceraTabla").textContent = "🔎";
    }
    if (filtro.rucFilt != "") {
      cabeceraRuc.classList.add("cabeceraFiltrada");
      cabeceraRuc.querySelector(".iconoCabeceraTabla").textContent = "❌";
      dataFiltrada = dataFiltrada.filter(
        (item) => item.ruc.includes(filtro.rucFilt) || item.ruc.includes(filtro.rucFilt.toUpperCase())
      );
    } else {
      cabeceraRuc.classList.remove("cabeceraFiltrada");
      cabeceraRuc.querySelector(".iconoCabeceraTabla").textContent = "🔎";
    }
    // if (filtro.idSolFilt != "") {
    //   cabeceraIdSolicitud.classList.add("cabeceraFiltrada");
    //   cabeceraIdSolicitud.querySelector(".iconoCabeceraTabla").textContent = "❌";
    //   dataFiltrada = dataFiltrada.filter(
    //     (item) =>
    //       item.idSolicitud.includes(filtro.idSolFilt) || item.idSolicitud.includes(filtro.idSolFilt.toUpperCase())
    //   );
    // } else {
    //   cabeceraIdSolicitud.classList.remove("cabeceraFiltrada");
    //   cabeceraIdSolicitud.querySelector(".iconoCabeceraTabla").textContent = "🔎";
    // }
    if (filtro.origen != "") {
      cabeceraOrigen.classList.add("cabeceraFiltrada");
      cabeceraOrigen.querySelector(".iconoCabeceraTabla").textContent = "❌";
      dataFiltrada = dataFiltrada.filter(
        (item) => item.origen.includes(filtro.origen) || item.origen.includes(filtro.origen.toUpperCase())
      );
    } else {
      cabeceraOrigen.classList.remove("cabeceraFiltrada");
      cabeceraOrigen.querySelector(".iconoCabeceraTabla").textContent = "🔎";
    }
    if (filtro.destino != "") {
      cabeceraDestino.classList.add("cabeceraFiltrada");
      cabeceraDestino.querySelector(".iconoCabeceraTabla").textContent = "❌";
      dataFiltrada = dataFiltrada.filter(
        (item) => item.destino.includes(filtro.destino) || item.destino.includes(filtro.destino.toUpperCase())
      );
    } else {
      cabeceraDestino.classList.remove("cabeceraFiltrada");
      cabeceraDestino.querySelector(".iconoCabeceraTabla").textContent = "🔎";
    }
    if (filtro.tractoPlaca != "") {
      cabeceraTracto.classList.add("cabeceraFiltrada");
      cabeceraTracto.querySelector(".iconoCabeceraTabla").textContent = "❌";
      dataFiltrada = dataFiltrada.filter(
        (item) =>
          item.tractoPlaca.includes(filtro.tractoPlaca) || item.tractoPlaca.includes(filtro.tractoPlaca.toUpperCase())
      );
    } else {
      cabeceraTracto.classList.remove("cabeceraFiltrada");
      cabeceraTracto.querySelector(".iconoCabeceraTabla").textContent = "🔎";
    }
    if (filtro.camaBajaPlaca != "") {
      cabeceraCamaBaja.classList.add("cabeceraFiltrada");
      cabeceraCamaBaja.querySelector(".iconoCabeceraTabla").textContent = "❌";
      dataFiltrada = dataFiltrada.filter(
        (item) =>
          item.camaBajaPlaca.includes(filtro.camaBajaPlaca) ||
          item.camaBajaPlaca.includes(filtro.camaBajaPlaca.toUpperCase())
      );
    } else {
      cabeceraCamaBaja.classList.remove("cabeceraFiltrada");
      cabeceraCamaBaja.querySelector(".iconoCabeceraTabla").textContent = "🔎";
    }
    if (filtro.carga != "") {
      cabeceraCarga.classList.add("cabeceraFiltrada");
      cabeceraCarga.querySelector(".iconoCabeceraTabla").textContent = "❌";
      dataFiltrada = dataFiltrada.filter(
        (item) => item.carga.includes(filtro.carga) || item.carga.includes(filtro.carga.toUpperCase())
      );
    } else {
      cabeceraCarga.classList.remove("cabeceraFiltrada");
      cabeceraCarga.querySelector(".iconoCabeceraTabla").textContent = "🔎";
    }

    pintadoTabla(dataFiltrada);
  }

  // Inicialmente deshabilitar el botón
  // disableInfoButton();

  botonDescargaExcel.addEventListener("click", function () {
    try {
      // // Convertir tabla a workbook de Excel
      // const workbook = XLSX.utils.table_to_book(cabeceras);

      // // Opciones adicionales (puedes personalizar)
      // const opciones = {
      //   bookType: "xlsx", // Puedes usar 'xls' para formato más antiguo
      //   compression: true, // Comprimir el archivo resultante
      // };

      // // Generar y descargar el archivo
      // XLSX.writeFile(workbook, "datos_descargados.xlsx", opciones);

      // Crear un nuevo libro de trabajo

      let allDataFiltrada = allData.filter(item => item.fechaLLegada.length > 1).map(item =>({
        ...item,
        idAutogenerado: `AS-${item.id}`
      }))

      const wb = XLSX.utils.book_new();
      
      // Convertir JSON a hoja de trabajo
      const ws = XLSX.utils.json_to_sheet(allDataFiltrada);
      
      // Procesar las fechas para forzar formato de texto
      const range = XLSX.utils.decode_range(ws['!ref']);
      
      // Identificar columnas que contienen fechas por nombre
      for (let C = range.s.c; C <= range.e.c; ++C) {
          const header = XLSX.utils.encode_cell({r: 0, c: C});
          const headerValue = ws[header] ? ws[header].v : '';
          
          // Si el encabezado sugiere que es una fecha
          if (headerValue && headerValue.toLowerCase().includes('fecha')) {
              // Procesar todas las celdas de esta columna
              for (let R = range.s.r + 1; R <= range.e.r; ++R) {
                  const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
                  if (ws[cellAddress]) {
                      // Forzar el valor como texto
                      ws[cellAddress].t = 's';
                      // Opcional: agregar comilla simple para Excel
                      // ws[cellAddress].v = "'" + ws[cellAddress].v;
                  }
              }
          }
      }
      
      // Ajustar el ancho de las columnas
      const colWidths = [
          {wch: 8},   // ID
          {wch: 15},  // Nombre
          {wch: 60},  // Fecha Nacimiento
          {wch: 15},  // Fecha Registro
          {wch: 15},  // Saldo
          {wch: 60},  // Saldo
          {wch: 60},  // Saldo
          {wch: 15},  // Saldo
          {wch: 15},  // Saldo
          {wch: 10},   // Activo
          {wch: 10},   // Activo
          {wch: 60}   // Activo
      ];
      ws['!cols'] = colWidths;
      
      // Agregar la hoja de trabajo al libro
      XLSX.utils.book_append_sheet(wb, ws, "Datos");
      
      // Generar el nombre del archivo con la fecha actual
      const date = new Date();
      const fileName = `datos_directos_${date.toISOString().split('T')[0]}.xlsx`;
      
      // Descargar el archivo
      XLSX.writeFile(wb, fileName);
      
      // Mostrar mensaje de éxito
      // const message = document.getElementById('message');
      // message.style.display = 'block';
      // setTimeout(() => {
      //     message.style.display = 'none';
      // }, 3000);


    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  });

  consultarBtn.addEventListener("click", function () {

    ocultarDescarga()

    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
    const sessionCode = localStorage.getItem("sessionCode");

    if (!fechaInicio || !fechaFin) {
      alert("Por favor ingrese ambas fechas");
      return;
    }

    // disableInfoButton();
    allData = [];

    const fechaInicioPartes = fechaInicio.split("-");
    const fechaInicioFormateada = `${fechaInicioPartes[2]}/${fechaInicioPartes[1]}/${fechaInicioPartes[0]}`;

    const fechaFinPartes = fechaFin.split("-");
    const fechaFinFormateada = `${fechaFinPartes[2]}/${fechaFinPartes[1]}/${fechaFinPartes[0]}`;

    console.log(`fechaInicio ${fechaInicioFormateada}`);
    console.log(`fechaFin ${fechaFinFormateada}`);
    console.log(`Sesion code ${sessionCode}`);

    // Verificar sesión
    let rptVerificaSession2 = verificarSession(sessionCode, horaSessionCode);
    if (!rptVerificaSession2.status) {
      alert(rptVerificaSession2.mensaje);
      window.location.href = "index.html";
      return;
    }

    showLoading();
    // Limpiar tabla antes de nueva consulta
    tablaResultados.innerHTML = "";

    // Mostrar mensaje de carga
    const loadingRow = tablaResultados.insertRow();
    const loadingCell = loadingRow.insertCell(0);
    loadingCell.colSpan = 4;
    loadingCell.textContent = "Cargando datos...";
    loadingCell.style.textAlign = "center";

    //llamada a la API
    fetch(`${API_CONFIG.BASE_URL}/webInt/getDataFiltradaByFechasSession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${sessionCode}`
      },
      body: JSON.stringify({
        fechaIni: fechaInicioFormateada,
        fechaFin: fechaFinFormateada,
        sessionCode: sessionCode,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la consulta");
        }
        return response.json();
      })
      .then((data) => {
        // Limpiar mensaje de carga

        hideLoading();
        allData = data.dataEncontrada;

        // console.log(data);
        if (data.estatus == 400) {
          alert(`Error en Session, ${data.mensaje}`);
          window.location.href = "index.html";

          ocultarDescarga()
          return;
        }

        tablaResultados.innerHTML = "";

        if (data.length === 0) {
          const emptyRow = tablaResultados.insertRow();
          const emptyCell = emptyRow.insertCell(0);
          emptyCell.colSpan = 4;
          emptyCell.textContent = "No se encontraron resultados";
          emptyCell.style.textAlign = "center";
          ocultarDescarga()
          return;
        }else{
          mostrarDescarga()
        }

        // enableInfoButton();

        // Llenar la tabla con los resultados
        // data.listaEmpresas.forEach((item) => {
        //   const row = tablaResultados.insertRow();
        //   row.insertCell(0).textContent = item.razonSocial || "N/A";
        //   row.insertCell(1).textContent = item.ruc || "N/A";
        //   row.insertCell(2).textContent = item.idSolicitud || "N/A";
        //   // row.insertCell(3).textContent = item.valor || 'N/A';
        // });
        pintadoTabla(data.dataEncontrada);
      })
      .catch((error) => {
        hideLoading();
        ocultarDescarga()
        // disableInfoButton();
        tablaResultados.innerHTML = "";
        const errorRow = tablaResultados.insertRow();
        const errorCell = errorRow.insertCell(0);
        errorCell.colSpan = 4;
        errorCell.textContent = "Error: " + error.message;
        errorCell.style.textAlign = "center";
        errorCell.style.color = "red";
      });
  });

  // obtenerInfoBtn.addEventListener("click", function () {
  //   if (!allData || allData.length === 0) return;
  //   const sessionCode = localStorage.getItem("sessionCode");

  //   if (allData.length > 200) {
  //     alert(`La consulta es muy costosa, ajuste las fechas`);
  //     return;
  //   }

  //   showLoading();
  //   fetch(`${API_CONFIG.BASE_URL}/webInt/getDataFiltradaSession`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Authorization': `Bearer ${sessionCode}`
  //     },
  //     body: JSON.stringify({
  //       listaEmpresas: allData,
  //       sessionCode: sessionCode,
  //     }),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Error en la consulta");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {

  //       hideLoading();

  //       allData = data.dataEncontrada;

  //       console.log(data);
  //       pintadoTabla(allData);

  //     })
  //     .catch((error) => {
  //       hideLoading();
  //       disableInfoButton();
  //       tablaResultados.innerHTML = "";
  //       const errorRow = tablaResultados.insertRow();
  //       const errorCell = errorRow.insertCell(0);
  //       errorCell.colSpan = 4;
  //       errorCell.textContent = "Error: " + error.message;
  //       errorCell.style.textAlign = "center";
  //       errorCell.style.color = "red";
  //     });
  // });

  // Elementos para el modal
  const modal = document.getElementById("myModal");
  const closeBtn = document.getElementById("cancelBtn");
  const okBtn = document.getElementById("okBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const cabeceras = document.getElementById("resultadosTable");
  const textoModal = document.getElementById("modalTextarea");


  function mostrarDescarga(){
    botonDescargaExcel.classList.add("show")
  }

  function ocultarDescarga(){
    botonDescargaExcel.classList.remove("show")
  }

  // Funcion ocultar Modal
  function ocultarModal() {
    // modal.style.display = "none";
    modal.classList.remove("show");
  }

  // Funcion mostrar Modal
  /**
   * @param {String} nombreModal - Este parámetro debe ser un array.
   */
  function mostrarModal(nombreModal) {
    // modal.style.display = "flex"; // Mostrar modal
    modal.classList.add("show");
    const label = document.querySelector("#input-group-modal > label");
    label.textContent = `Filtrar ${nombreModal}`;

    let textoContenedor = "";
    switch (varID) {
      case "nombreEmpresaID":
        textoContenedor = filtroData.RsFilt;
        break;
      case "rucID":
        textoContenedor = filtroData.rucFilt;
        break;
      // case "idSolicitudID":
      //   textoContenedor = filtroData.idSolFilt
      //   break;
      case "origenID":
        textoContenedor = filtroData.origen;
        break;
      case "destinoID":
        textoContenedor = filtroData.destino;
        break;
      case "placaCamaBajaID":
        textoContenedor = filtroData.camaBajaPlaca;
        break;
      case "placaTractoID":
        textoContenedor = filtroData.tractoPlaca;
        break;
      case "cargaID":
        textoContenedor = filtroData.carga;
        break;
      default:
        break;
    }
    textoModal.value = textoContenedor;

    textoModal.focus();
  }

  // modalBtn.addEventListener("click", function () {
  //   mostrarModal("Holi");
  // });

  // Cerrar modal al hacer clic en la X
  closeBtn.addEventListener("click", () => {
    ocultarModal();
  });

  // Cerrar modal al hacer clic en OK
  okBtn.addEventListener("click", () => {
    const text = document.getElementById("modalTextarea").value;
    console.log("Texto ingresado:", text); // Puedes hacer algo con el texto
    // modal.style.display = "none";
    ocultarModal();
  });

  // Cerrar modal al hacer clic en Cancelar
  cancelBtn.addEventListener("click", () => {
    // modal.style.display = "none";
    ocultarModal();
  });

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      // Si se hace clic en el fondo oscuro
      // modal.style.display = "none";
      ocultarModal();
    }
  });

  textoModal.addEventListener("input", function (e) {
    switch (varID) {
      case "nombreEmpresaID":
        filtroData.RsFilt = e.target.value;
        filtrado(filtroData);
        break;
      case "rucID":
        filtroData.rucFilt = e.target.value;
        filtrado(filtroData);
        break;
      // case "idSolicitudID":
      //   filtroData.idSolFilt = e.target.value;
      //   filtrado(filtroData);
      //   break;
      case "origenID":
        filtroData.origen = e.target.value;
        filtrado(filtroData);
        break;
      case "destinoID":
        filtroData.destino = e.target.value;
        filtrado(filtroData);
        break;
      case "placaTractoID":
        filtroData.tractoPlaca = e.target.value;
        filtrado(filtroData);
        break;
      case "placaCamaBajaID":
        filtroData.camaBajaPlaca = e.target.value;
        filtrado(filtroData);
        break;
      case "cargaID":
        filtroData.carga = e.target.value;
        filtrado(filtroData);
        break;
      default:
        break;
    }
  });

  // Cabeceras de Columnas
  cabeceras.addEventListener("click", (e) => {
    console.log(e.target);

    if (e.target.matches("th")) {
      console.log("Se hizo click al th");
      varID = e.target.id;
      mostrarModal(e.target.querySelector("div.cabeceraTabla").textContent);
    } else if (e.target.matches(".cabeceraTabla")) {
      console.log(e.target.parentElement.id);
      console.log("Se hizo click al cabeceraTabla");
      varID = e.target.parentElement.id;
      mostrarModal(e.target.textContent);
    } else if (e.target.matches(".iconoCabeceraTabla")) {
      console.log("Se hizo click al iconoCabeceraTabla");
      let idParent = e.target.parentElement.id;
      console.log(idParent);
      if (e.target.textContent == "❌") {
        switch (idParent) {
          case "nombreEmpresaID":
            filtroData.RsFilt = "";
            break;
          case "rucID":
            filtroData.rucFilt = "";
            break;
          // case "idSolicitudID":
          //   filtroData.idSolFilt = "";
          //   break;
          case "origenID":
            filtroData.origen = "";
            break;
          case "destinoID":
            filtroData.destino = "";
            break;
          case "placaTractoID":
            filtroData.tractoPlaca = "";
            break;
          case "placaCamaBajaID":
            filtroData.camaBajaPlaca = "";
            break;
          case "cargaID":
            filtroData.carga = "";

            break;
          default:
            break;
        }
        filtrado(filtroData);
      } else if (e.target.textContent == "🔎") {
        varID = e.target.parentElement.id;
        let padre = e.target.parentElement;
        let contenido = padre.querySelector("div.cabeceraTabla").textContent;
        mostrarModal(contenido);
      }
    }
    // mostrarModal(e.target.textContent);

    // if (e.target.matches('#nombreEmpresaID')) {
    //   mostrarModal()
    // }else if (e.target.matches('#nombreEmpresaID')) {

    // }else if (e.target.matches('#nombreEmpresaID')) {

    // }else if (e.target.matches('#nombreEmpresaID')) {

    // }else if (e.target.matches('#nombreEmpresaID')) {

    // }

    // console.log(e.target.matches('#nombreEmpresaID'))
  });
});
