import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css',
})
export class DatatableComponent {
  letrasIncognitas = [
    'x', // Primera incógnita
    'y', // Segunda incógnita
    'w', // Cuarta incógnita
    'u', // Quinta incógnita
    'v', // Sexta incógnita
    't', // Séptima incógnita
  ];

  letrasParametros = [
    'a', // Primera incógnita
    'b', // Segunda incógnita
    'c', // Tercera incógnita
    'd', // Cuarta incógnita
    'e', // Quinta incógnita
    'f', // Sexta incógnita
    'g', // Séptima incógnita
  ];

  dataTableData = {
    objetivo: 0,
    objetivoText: 'Selecciona un objetivo',
    parametrosCantidad: 0,
    parametros: [0],
    parametrosText: ['Ingresa parametros'],
    variablesText: ['Ingresa variables'],
    // objetivo: 1,
    // objetivoText: 'Maximizar ganancias',
    // parametrosCantidad: 3,
    // parametros: [2, 4, 5],
    // parametrosText: ['A = 3', 'B = 4', 'C = 5'],
    // variablesText: [
    //   '	X = cantidad de A',
    //   'Y = cantidad de B',
    //   'W = cantidad de C',
    // ],
    restricciones: [[0]],
    restriccionesText: ['Ingresa restricciones'],
    foText: 'Ingresa parametros y variables',
  };

  // ? Objetivo
  @ViewChild('modalObjetivo') miModal!: ElementRef;
  guardarObjetivo() {
    const selectElement = document.getElementById(
      'objetivoSelect'
    ) as HTMLSelectElement;

    if (parseInt(selectElement.value) == 0) {
      alert('Por favor seleccione una opcion');
      return;
    }

    this.dataTableData.objetivo = parseInt(selectElement.value);

    if (this.dataTableData.objetivo == 0) {
      this.dataTableData.objetivoText = 'Selecciona un objetivo';
    } else if (this.dataTableData.objetivo == 1) {
      this.dataTableData.objetivoText = 'Maximizar ganancias';
    } else if (this.dataTableData.objetivo == 2) {
      this.dataTableData.objetivoText = 'Minimizar costos';
    }

    const modalElement = this.miModal.nativeElement;
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  // ? Parametros
  @ViewChild('modalParametros') modalParametros!: ElementRef;
  cantidadParametros: number = 0;
  parametros: number[] = [];

  abrirModal() {
    const modalElement = this.modalParametros.nativeElement;
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  }

  guardarCantidadParametros() {
    if (this.cantidadParametros <= 1) {
      alert('Por favor, ingresa una cantidad válida (mayor a 1).');
    } else if (this.cantidadParametros > 5) {
      alert('El valor ingresado es muy alto (máx. 5).');
    } else {
      this.generarInputs();
    }
  }

  generarInputs() {
    this.parametros = new Array(this.cantidadParametros).fill('');
  }

  cerrarModal() {
    const modalElement = this.modalParametros.nativeElement;
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  guardarParametros() {
    if (this.parametros.some((parametro) => !parametro)) {
      alert('Por favor, complete todos los parámetros.');
    } else {
      this.dataTableData.parametros = this.parametros;
      this.dataTableData.parametrosCantidad = this.cantidadParametros;
      this.dataTableData.parametrosText = [];
      this.dataTableData.variablesText = [];
      for (let i = 0; i < this.dataTableData.parametros.length; i++) {
        this.dataTableData.parametrosText.push(
          `${this.letrasParametros[i].toUpperCase()} = ${
            this.dataTableData.parametros[i]
          }`
        );
        this.dataTableData.variablesText.push(
          `${this.letrasIncognitas[
            i
          ].toUpperCase()} = cantidad de ${this.letrasParametros[
            i
          ].toUpperCase()}`
        );
      }
      this.cerrarModal();
      console.log(this.dataTableData);
    }
  }

  // ? Restricciones
  @ViewChild('modalRestricciones') modalRestricciones!: ElementRef;
  cantidadRestricciones: number = 0;
  restricciones: Array<{ parametros: number[] }> = [];
  valorRestricciones: Array<number> = [];

  abrirModalRestricciones() {
    const modalElement = this.modalRestricciones.nativeElement;
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  }

  guardarCantidadRestricciones() {
    if (this.cantidadRestricciones < 2) {
      alert('Por favor, ingresa una cantidad válida (mínimo 2).');
    } else if (this.cantidadRestricciones > 10) {
      alert('El valor ingresado es muy alto (máx. 9).');
    } else {
      this.generarInputsRestricciones();
    }
  }

  generarInputsRestricciones() {
    this.restricciones = Array.from(
      { length: this.cantidadRestricciones },
      () => ({
        parametros: new Array(this.dataTableData.parametrosCantidad).fill(''),
      })
    );
  }

  cerrarModalRestricciones() {
    const modalElement = this.modalRestricciones.nativeElement;
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  guardarRestricciones() {
    // Validar que todos los parámetros de las restricciones están completos
    const restriccionesIncompletas = this.restricciones.some((restriccion) =>
      restriccion.parametros.some(
        (parametro) =>
          parametro === null ||
          parametro === undefined ||
          parametro.toString() === ''
      )
    );

    // Validar que el array de valores también esté completo
    const valoresIncompletos = this.valorRestricciones.some(
      (valor) =>
        valor === null || valor === undefined || valor.toString() === ''
    );

    console.log(
      restriccionesIncompletas ||
        (valoresIncompletos &&
          this.restricciones.length == this.valorRestricciones.length)
    );
    // Mensajes de error específicos
    if (
      restriccionesIncompletas ||
      (valoresIncompletos &&
        this.restricciones.length == this.valorRestricciones.length)
    ) {
      alert('Por favor, complete todos los campos');
      return; // Salir de la función si hay errores
    }

    // Agregar el array de valores a las restricciones
    this.restricciones = this.restricciones.map((objeto, index) => ({
      ...objeto,
      parametros: [...objeto.parametros, this.valorRestricciones[index]],
    }));

    for (let i = 0; i < this.restricciones.length; i++) {
      this.dataTableData.restricciones[i] = this.restricciones[i].parametros;
    }

    this.cerrarModalRestricciones();

    for (let i = 0; i < this.dataTableData.restricciones.length; i++) {
      var s = '';
      for (let j = 0; j < this.dataTableData.restricciones[i].length; j++) {
        if (j == this.dataTableData.restricciones[i].length - 1) {
          if (j != 0) {
            s += ' = ';
          }
          s += `${this.dataTableData.restricciones[i][j]}`;
        } else {
          if (j != 0) {
            s += ' + ';
          }
          s += `${
            this.dataTableData.restricciones[i][j] + this.letrasIncognitas[j]
          }`;
        }
      }
      this.dataTableData.restriccionesText.push(s);
    }

    for (let i = 0; i < this.dataTableData.parametros.length; i++) {
      if (this.dataTableData.foText != 'Ingresa parametros y variables') {
        this.dataTableData.foText += ' + ';
      } else {
        this.dataTableData.foText = '';
      }
      this.dataTableData.foText += `${
        this.dataTableData.parametros[i] + this.letrasIncognitas[i]
      }`;
    }
  }
}
