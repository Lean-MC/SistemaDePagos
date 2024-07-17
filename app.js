// Abre la pestaña por defecto al cargar la página
document.getElementById("defaultOpen").click();

function validarPrecio() {
  var precioInput = document.getElementById("precio");
  if (precioInput.value.includes('e')) {
    precioInput.setCustomValidity('El precio no puede contener la letra "e"');
  } else {
    precioInput.setCustomValidity('');
  }
}

// Mostrar el gráfico al abrir la pestaña "Graficos"
document.getElementById("Grafico").addEventListener("click", function() {
  mostrarGraficoVentas();
});

// Mostrar el gráfico de ventas al cargar la página si la pestaña "Graficos" está abierta
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("Grafico").style.display === "block") {
    mostrarGraficoVentas();
  }
});

// Función para abrir la pestaña seleccionada
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function guardarCompra() {
  var precio = document.getElementById("precio").value;
  var tipoPagoElement = document.querySelector('input[name="tipoPago"]:checked');
  if (!tipoPagoElement) {
    alert("Por favor, selecciona un tipo de pago.");
    return;
  }
  var tipoPago = tipoPagoElement.value;

  var compra = { precio: precio, tipoPago: tipoPago };
  var compras = JSON.parse(localStorage.getItem("compras")) || [];
  compras.push(compra);
  localStorage.setItem("compras", JSON.stringify(compras));

  // Limpiar el formulario
  document.getElementById("precio").value = "";
  document.querySelector('input[name="tipoPago"]:checked').checked = false;

  // Mostrar mensaje de alerta
  Swal.fire({
    icon: 'success',
    title: 'Compra realizada',
    text: '¡Compra realizada con éxito!',
  }).then(() => {
    // Actualizar la lista de compras
    mostrarCompras();

    // Mostrar totales
    mostrarTotales();

    // Refrescar la página
    location.reload();
  });
}

function mostrarCompras() {
  var compras = JSON.parse(localStorage.getItem("compras")) || [];
  var listaCompras = document.getElementById("lista-compras");
  listaCompras.innerHTML = "";

  for (var i = 0; i < compras.length; i++) {
    var compra = compras[i];
    var li = document.createElement("li");
    li.textContent = `${i + 1}: $${compra.precio} , ${compra.tipoPago}`;

    // Agregar botón de borrado con verificación
    var button = document.createElement("button");
    button.textContent = "Eliminar";
    button.classList.add("eliminar-btn");

    button.onclick = (function(index) {
      return function() {
        var codigo = prompt("Ingrese el código de verificación:");
        if (codigo === "442") {
          compras.splice(index, 1);
          localStorage.setItem("compras", JSON.stringify(compras));
          mostrarCompras(); // Actualizar la lista después de borrar
        } else {
          alert("Código incorrecto. No se pudo eliminar la compra.");
        }
      };
    })(i); // Pasar el valor de i a la función de cierre

    li.appendChild(button);
    listaCompras.appendChild(li);
  }

  // Mostrar los pagos a proveedores
  var pagos = JSON.parse(localStorage.getItem("pagos")) || [];
  var listaPagos = document.getElementById("lista-pagos");
  listaPagos.innerHTML = "";

  for (var j = 0; j < pagos.length; j++) {
    var pago = pagos[j];
    var liPago = document.createElement("li");
    liPago.textContent = `${j + 1}: $${pago.cantidad} , ${pago.motivo}`;

    // Agregar botón de borrado con verificación
    var buttonPago = document.createElement("button");
    buttonPago.textContent = "Eliminar";
    buttonPago.classList.add("eliminar-btn");

    buttonPago.onclick = (function(index) {
      return function() {
        var codigo = prompt("Ingrese el código de verificación:");
        if (codigo === "442") {
          pagos.splice(index, 1);
          localStorage.setItem("pagos", JSON.stringify(pagos));
          mostrarCompras(); // Actualizar la lista después de borrar
        } else {
          alert("Código incorrecto. No se pudo eliminar el pago.");
        }
      };
    })(j); // Pasar el valor de j a la función de cierre

    liPago.appendChild(buttonPago);
    listaPagos.appendChild(liPago);
  }
}
  // Mostrar los pagos a proveedores
var pagos = JSON.parse(localStorage.getItem("pagos")) || [];
var listaPagos = document.getElementById("lista-pagos");
listaPagos.innerHTML = "";

for (var j = 0; j < pagos.length; j++) {
  var pago = pagos[j];
  var liPago = document.createElement("li");
  liPago.textContent = `${j + 1}: $${pago.cantidad} , ${pago.motivo}`;

  // Agregar botón de borrado con verificación
  var buttonPago = document.createElement("button");
  buttonPago.textContent = "Eliminar";
  buttonPago.classList.add("eliminar-btn");

  buttonPago.onclick = (function(index) {
    return function() {
      var codigo = prompt("Ingrese el código de verificación:");
      if (codigo === "442") {
        pagos.splice(index, 1);
        localStorage.setItem("pagos", JSON.stringify(pagos));
        mostrarCompras(); // Actualizar la lista después de borrar
      } else {
        alert("Código incorrecto. No se pudo eliminar el pago.");
      }
    };
  })(j); // Pasar el valor de j a la función de cierre
  liPago.appendChild(buttonPago);
  listaPagos.appendChild(liPago);
}

function eliminarCompra(index) {
  var compras = JSON.parse(localStorage.getItem("compras")) || [];
  compras.splice(index, 1);
  localStorage.setItem("compras", JSON.stringify(compras));
  mostrarCompras(); // Actualiza la lista de compras en la interfaz de usuario
}

function calcularTotales() {
  var compras = JSON.parse(localStorage.getItem("compras")) || [];
  var totalCompras = compras.length;
  var totalRecaudado = compras.reduce(function(total, compra) {
    return total + parseFloat(compra.precio);
  }, 0);
  return { totalCompras: totalCompras, totalRecaudado: totalRecaudado };
}

function mostrarTotales() {
  var compras = JSON.parse(localStorage.getItem("compras")) || [];
  var totalCompras = compras.length;
  var totalRecaudado = compras.reduce(function(total, compra) {
    return total + parseFloat(compra.precio);
  }, 0);
  document.getElementById("total-compras").textContent = totalCompras;
  document.getElementById("total-recaudado").textContent = totalRecaudado.toFixed(2);

  // Calcular y mostrar la cantidad de compras y dinero recaudado en cada tipo de pago
  var tiposPago = {
    "Efectivo": { cantidad: 0, total: 0 },
    "Transferencia MP": { cantidad: 0, total: 0 },
    "Posnet MP": { cantidad: 0, total: 0 },
    "Tarjeta Debito": { cantidad: 0, total: 0 },
    "Tarjeta Credito": { cantidad: 0, total: 0 },
    "Cuenta DNI": { cantidad: 0, total: 0 }
  };

  compras.forEach(function(compra) {
    if (compra && compra.tipoPago && tiposPago[compra.tipoPago]) {
      tiposPago[compra.tipoPago].cantidad += 1;
      tiposPago[compra.tipoPago].total += parseFloat(compra.precio);
    }
  });

  for (var tipoPago in tiposPago) {
    if (tiposPago.hasOwnProperty(tipoPago)) {
      document.getElementById("total-" + tipoPago.toLowerCase().replace(" ", "-")).textContent = tiposPago[tipoPago].cantidad + " ($" + tiposPago[tipoPago].total.toFixed(2) + ")";
    }
  }

  // Mostrar los pagos a proveedores
  var pagosProveedores = JSON.parse(localStorage.getItem("pagosProveedores")) || [];
  var totalPagosProveedores = pagosProveedores.length;
  var cantidadTotal = pagosProveedores.reduce(function(total, pago) {
    return total + parseFloat(pago.cantidad);
  }, 0);

  document.getElementById("total-pagos-proveedores").textContent = totalPagosProveedores;
  document.getElementById("cantidad-total-proveedores").textContent = cantidadTotal.toFixed(2);
}


// Función para mostrar las compras y los totales al cargar la página
document.addEventListener("DOMContentLoaded", function() {
  mostrarCompras();
  mostrarTotales();
});

// Mostrar las compras y los totales al cargar la pestaña de compras
document.getElementById("Compras").addEventListener("click", function() {
  mostrarCompras();
  mostrarTotales();
});

function borrarLista() {
  localStorage.removeItem("compras");
  localStorage.removeItem("pagos");
  mostrarCompras();
  mostrarTotales();
     // Mostrar alerta de que se borró la lista
  alert("Se ha borrado la lista de compras.");
  
  // Actualizar el gráfico de ventas
  mostrarGraficoVentas();
}

function mostrarTotalesTipoPago() {
  const totalesPorTipoPago = calcularTotalesPorTipoPago();

  for (const tipoPago in totalesPorTipoPago) {
    if (totalesPorTipoPago.hasOwnProperty(tipoPago)) {
      document.getElementById(`total-${tipoPago.toLowerCase().replace(" ", "-")}`).textContent = totalesPorTipoPago[tipoPago].toFixed(2);
    }
  }
}

function mostrarInformes() {
  mostrarTotales();
  mostrarTotalesTipoPago();
  mostrarPagosProveedores();
}



function mostrarPagosProveedores() {
  var pagosProveedores = JSON.parse(localStorage.getItem("pagosProveedores")) || [];
  var totalPagosProveedores = pagosProveedores.length;
  var cantidadTotal = pagosProveedores.reduce(function(total, pago) {
    return total + parseFloat(pago.cantidad);
  }, 0);

  document.getElementById("total-pagos-proveedores").textContent = totalPagosProveedores;
  document.getElementById("cantidad-total-proveedores").textContent = cantidadTotal.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function() {
  mostrarPagosProveedores();
});

function realizarPago() {
  const cantidad = document.getElementById("cantidad").value;
  const motivo = document.getElementById("motivo").value;

  if (!cantidad || !motivo) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, completa todos los campos.',
    });
    return;
  }

  if (isNaN(parseFloat(cantidad))) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La cantidad debe ser un número válido.',
    });
    return;
  }

  const pago = { cantidad: cantidad, motivo: motivo };
  const pagos = JSON.parse(localStorage.getItem("pagos")) || [];
  pagos.push(pago);
  localStorage.setItem("pagos", JSON.stringify(pagos));

  // Limpiar el formulario
  document.getElementById("cantidad").value = "";
  document.getElementById("motivo").value = "";

  // Mostrar mensaje de alerta
  Swal.fire({
    icon: 'success',
    title: 'Pago realizado',
    text: `Pago de ${cantidad} por ${motivo} realizado con éxito.`,
  }).then(() => {
    // Actualizar la lista de pagos
    mostrarPagos();

    // Actualizar los informes después de realizar el pago
    mostrarInformes();

    // Actualizar el gráfico de ventas
    mostrarGraficoVentas();

    // Recargar la página
    location.reload();
  });
}

function mostrarPagos() {
  var pagos = JSON.parse(localStorage.getItem("pagos")) || [];
  var totalPagos = pagos.length;
  var cantidadTotal = pagos.reduce(function(total, pago) {
    return total + parseFloat(pago.cantidad);
  }, 0);

  document.getElementById("total-pagos-proveedores").textContent = totalPagos;
  document.getElementById("cantidad-total-proveedores").textContent = cantidadTotal.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function() {
  mostrarPagos();
});

function exportarExcel() {
  // Obtener los datos de los elementos en la página
  var totalCompras = document.getElementById("total-compras").innerText;
  var totalEfectivo = document.getElementById("total-efectivo").innerText;
  var totalTransferenciaMP = document.getElementById("total-transferencia-mp").innerText;
  var totalPosnetMP = document.getElementById("total-posnet-mp").innerText;
  var totalTarjetaDebito = document.getElementById("total-tarjeta-debito").innerText;
  var totalTarjetaCredito = document.getElementById("total-tarjeta-credito").innerText;
  var totalCuentaDNI = document.getElementById("total-cuenta-dni").innerText;
  var totalRecaudado = document.getElementById("total-recaudado").innerText;
  var totalPagosProveedores = document.getElementById("total-pagos-proveedores").innerText;
  var cantidadTotalProveedores = document.getElementById("cantidad-total-proveedores").innerText;

  // Crear un array con los datos
  var datosExportar = [
    { "Tipo": "Total de Compras", "Cantidad": totalCompras },
    { "Tipo": "Total Efectivo", "Cantidad": totalEfectivo },
    { "Tipo": "Total Transferencia MP", "Cantidad": totalTransferenciaMP },
    { "Tipo": "Total Posnet MP", "Cantidad": totalPosnetMP },
    { "Tipo": "Total Tarjeta Debito", "Cantidad": totalTarjetaDebito },
    { "Tipo": "Total Tarjeta Credito", "Cantidad": totalTarjetaCredito },
    { "Tipo": "Total Cuenta DNI", "Cantidad": totalCuentaDNI },
    { "Tipo": "Total Recaudado", "Cantidad": totalRecaudado },
    { "Tipo": "Total Pagos a Proveedores", "Cantidad": totalPagosProveedores },
    { "Tipo": "Cantidad Total Proveedores", "Cantidad": cantidadTotalProveedores }
  ];

  // Crear una hoja de cálculo
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(datosExportar);
  XLSX.utils.book_append_sheet(wb, ws, "Informes");

  // Guardar el archivo
  XLSX.writeFile(wb, "informe_ventas_pagos.xlsx");

  borrarLista();
}


function calcularTotalesPorTipoPago() {
  const compras = JSON.parse(localStorage.getItem("compras")) || [];
  const totalesPorTipoPago = {};

  compras.forEach(compra => {
    const tipoPago = compra.tipoPago;
    const precio = parseFloat(compra.precio);

    // Verificar si ya existe un total para este tipo de pago
    if (totalesPorTipoPago.hasOwnProperty(tipoPago)) {
      totalesPorTipoPago[tipoPago] += precio;
    } else {
      // Si no existe, crear el total para este tipo de pago
      totalesPorTipoPago[tipoPago] = precio;
    }
  });

  return totalesPorTipoPago;
}



let ventasChart; // Variable global para almacenar la instancia del gráfico

function mostrarGraficoVentas() {
  const totalesPorTipoPago = calcularTotalesPorTipoPago();
  const etiquetas = Object.keys(totalesPorTipoPago);
  const datos = Object.values(totalesPorTipoPago);

  const ctx = document.getElementById('ventasChart').getContext('2d');

  // Destruir el gráfico existente si ya hay uno
  if (ventasChart) {
    ventasChart.destroy();
  }

  ventasChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Total por Tipo de Pago',
        data: datos,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

