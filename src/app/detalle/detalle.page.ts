import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Coche } from '../coche';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id: string = "";
  cocheNuevo: Coche;
  handlerMessage = '';
  roleMessage = '';
  document: any = {
    id: "",
    data: {} as Coche
  };

  constructor(private firestoreService: FirestoreService, private activateRoute: ActivatedRoute, private router: Router, private alertController: AlertController,
    private loadingController: LoadingController, private toastController: ToastController, private imagePicker: ImagePicker) {

  }

  ngOnInit() {
    
    // Pregunta si es un coche nuevo o ya creado.
    if (this.activateRoute.snapshot.paramMap.get('id') == "new") {

      this.cocheNuevo = {} as Coche;
      this.document.data = this.cocheNuevo;

    } else {

      this.id = this.activateRoute.snapshot.paramMap.get('id');
      this.firestoreService.consultarPorId("coches", this.id).subscribe((resultado) => {

        // Preguntar si se hay encontrado un document con ese ID
        if(resultado.payload.data() != null) {

          this.document.id = resultado.payload.id
          this.document.data = resultado.payload.data();
          // Como ejemplo, mostrar el título de la tarea en consola
          console.log(this.document.data.Marca);

        } else {

          // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
          this.document.data = {} as Coche;

        } 

      });

    }
    
  }

  clicBotonBorrar () {
    this.presentAlert();
  }

  clicBotonModificar() {

    // Pregunta si es un coche nuevo o ya creado.
    if (this.activateRoute.snapshot.paramMap.get('id') == "new") {

      // Crea un coche nuevo.
      this.firestoreService.insertar("coches", this.cocheNuevo).then(() => {

        console.log("Coche creado correctamemnte");
        this.router.navigate(['/home']);

      }, (error) => {

        console.error(error);

      });
      
    } else {

      // Actualiza el coche correspondiente.
      this.firestoreService.actualizar("coches", this.id, this.document.data).then(() => {

        // Actualizar la lista completa
        this.router.navigate(['/home']);

      });
    }
  }

  clicBotonVolver() {

    // Redirige a la paguina de inicio.
    this.router.navigate(['/home']);

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¿Deseas borrar este coche?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.firestoreService.borrar("coches", this.id).then(() => {

              // Actualizar la lista completa
              this.router.navigate(['/home']);
        
            });
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }

  async uploadImagePicker () {

    // Mensaje de espera mientras se sube la imagen.
    const loading = await this.loadingController.create({

      message: 'Espere, por favor...'

    });

    // Mensaje de finalización de subida de la imagen.
    const toast = await this.toastController.create({

      message: 'La imagen se actualizó con éxito',
      duration: 3000

    });

    // Comprobar si la aplicación tiene permisos de lectura.
    this.imagePicker.hasReadPermission().then(
      (result) => {

        // Si no tiene permiso de lectura se solicita al usuario.
        if (result == false) {

          this.imagePicker.requestReadPermission();

        } else {

          // Abrir selector de imagenes (ImagePicker).
          this.imagePicker.getPictures({

            maximumImagesCount: 1,  // Permite solo 1 imagen.
            outputType: 1           // 1 = Base64.

          }).then (

            (result) => {

              // En la variable resilts se tienen las imagenes seleccionadas.
              // Carpeta del Storage donde se almacenará la imagen
              let nombreCaroeta = "imagenes";
            }
          )
        }
      }
    )
  }



}

