import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Coche,  } from '../coche';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  cocheEditando: Coche;
  arrayColeccionCoche: any = [{
    id: "",
    data: {} as Coche
  }];
  idCocheSelec: String;

  constructor( private firestoreService: FirestoreService,private activateRoute: ActivatedRoute, private router: Router) {

    this.cocheEditando = {} as Coche;
    this.obtenerListaCoches();

  }

  clicBotonCrear () {
    this.router.navigate(['/detalle', 'new']);
  }

  obtenerListaCoches () {
    this.firestoreService.consultar("coches").subscribe((resultadoConsolaCoches) => {
      this.arrayColeccionCoche = [];
      resultadoConsolaCoches.forEach((datosCoche: any) => {
        this.arrayColeccionCoche.push({
          id: datosCoche.payload.doc.id,
          data: datosCoche.payload.doc.data()
        })
      })
    })
  }

  selecCoche (cocheSelec) {
    console.log("Coche Seleccionado:");
    console.log(cocheSelec);
    this.idCocheSelec = cocheSelec.id;
    this.cocheEditando.Marca = cocheSelec.data.Marca;
    this.cocheEditando.Modelo = cocheSelec.data.Modelo;
    this.cocheEditando.Motorizacion = cocheSelec.data.Motorizacion;
    this.cocheEditando.Matricula = cocheSelec.data.Matricula;
    this.cocheEditando.imagen = cocheSelec.data.imagen;
    this.router.navigate(['/detalle', this.idCocheSelec]);
  }

}
