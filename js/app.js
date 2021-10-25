function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function () {
  /*
    1 = Americano 1.15
    2 = Asiatico 1.05
    3 = Europeo 1.35
  */
  let cantidad;
  const base = 2000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;

    default:
      break;
  }

  //Leer el año
  const diferencia = new Date().getFullYear() - this.year;

  // Cada año la diferencia es mayor, el costo va a reducir un 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*
    Si el seguro es básico se multiplica por un 30% mas
    Si el seguro es completo se multiplica por un 50% mas
  */
  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }

  return cantidad;
};

function UI() {}

UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear();
  const min = max - 20;

  const selectYear = document.getElementById("year");

  for (let i = max; i > min; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;

    selectYear.appendChild(option);
  }
};

// Muestra alerta en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = document.createElement("div");

  if (tipo === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }

  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;

  const formulario = document.getElementById("cotizar-seguro");
  formulario.insertBefore(div, document.getElementById("resultado"));

  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.mostrarResultado = (seguro, total) => {
  const { marca, year, tipo } = seguro;
  let textoMarca;

  switch (marca) {
    case "1":
      textoMarca = "Americano";
      break;
    case "2":
      textoMarca = "Asiatico";
      break;
    case "3":
      textoMarca = "Europeo";
      break;
    default:
      break;
  }

  const div = document.createElement("div");
  div.classList.add("mt-10");
  div.innerHTML = `
    <p class="header">Tu Resumen</p>
    <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
    <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
  `;

  const resultadoDiv = document.getElementById("resultado");

  // Mostrar el spinner
  const spinner = document.getElementById("cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none"; // Se borra el spinner
    resultadoDiv.appendChild(div); // Se muestra el resultado
  }, 3000);
};

const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones();
});

eventListeners();

function eventListeners() {
  const formulario = document.getElementById("cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  const marca = document.getElementById("marca").value;

  const year = document.getElementById("year").value;

  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }

  ui.mostrarMensaje("Cotizando...", "exito");

  // Ocultar las cotizaciones previas
  const resultados = document.querySelector("#resultado div");

  if (resultados !== null) {
    resultados.remove();
  }

  //Instanciar el seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();

  //Utilizar el prototype que va a cotizar
  ui.mostrarResultado(seguro, total);
}
