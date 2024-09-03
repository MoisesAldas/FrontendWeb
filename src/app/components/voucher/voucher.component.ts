import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VoucherService } from '../../services/voucher.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxImageCompressService, DOC_ORIENTATION } from 'ngx-image-compress';

@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],
})
export class VoucherComponent implements OnInit {
  imagenUrl = 'assets/logo.png';
  open = false;
  file: File | null = null;
  cedula: string | null = null;

  constructor(
    private voucherService: VoucherService,
    private route: ActivatedRoute,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.cedula = params.get('cedula');
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64 = reader.result as string;

        // Obtener la orientación de la imagen (opcional)
        this.imageCompress
          .getOrientation(file)
          .then((orientation: DOC_ORIENTATION) => {
            // Redimensionar imagen a 375x629 píxeles con calidad del 100%
            this.imageCompress
              .compressFile(base64, orientation, 100, 100, 375, 629)
              .then((compressedImage) => {
                // Convertir base64 a Blob
                const imageBlob = this.base64ToBlob(
                  compressedImage.split(',')[1],
                  file.type
                );
                // Convertir Blob a File
                this.file = new File([imageBlob], file.name, {
                  type: file.type,
                });
              })
              .catch(() => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al redimensionar la imagen',
                  text: 'Hubo un error al intentar redimensionar la imagen.',
                });
              });
          });
      };
    }
  }

  base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: type });
  }

  onButtonClick() {
    if (!this.file) {
      Swal.fire({
        icon: 'warning',
        title: 'Archivo no seleccionado',
        text: 'Por favor, sube un archivo antes de enviar.',
      });
      return;
    }

    if (!this.cedula) {
      Swal.fire({
        icon: 'error',
        title: 'Cédula no encontrada',
        text: 'No se pudo obtener la cédula del cliente.',
      });
      return;
    }

    this.voucherService.uploadVoucher(this.cedula, this.file).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Comprobante subido',
          text: 'Comprobante subido con éxito',
        });
        this.open = false;
      },
      error: () => {
        Swal.fire({
          icon: 'success',
          title: 'Comprobante subido',
          text: 'Comprobante subido con éxito',
        });
      },
    });
  }
}
