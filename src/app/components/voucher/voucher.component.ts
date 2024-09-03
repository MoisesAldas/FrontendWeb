import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VoucherService } from '../../services/voucher.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxImageCompressService } from 'ngx-image-compress';

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

    if (file.size > 50 * 1024 * 1024) { // Verificación de tamaño máximo de 50MB
      Swal.fire({
        icon: 'warning',
        title: 'Imagen demasiado grande',
        text: 'Elija una imagen de menor tamaño.',
      });
      return;
    }

    // Optimización de la imagen antes de enviarla (opcional)
    const orientation = -1; // Usa la orientación original
    this.imageCompress.compressFile(URL.createObjectURL(file), orientation, 50, 50).then(
      (compressedImage) => {
        // Convertir base64 a Blob
        const imageBlob = this.base64ToBlob(compressedImage.split(',')[1], file.type);
        // Convertir Blob a File
        this.file = new File([imageBlob], file.name, { type: file.type });
      }
    );
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
          icon: 'error',
          title: 'Error al subir el comprobante',
          text: 'Hubo un error al intentar subir el comprobante.',
        });
      }
    });
  }
}
