import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VoucherService } from '../../services/voucher.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.cedula = params.get('cedula');
    });
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
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
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Comprobante subido',
          text: 'Comprobante subido con éxito',
        });
        this.open = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'success',
          title: 'Comprobante subido',
          text: 'Comprobante subido con éxito',
        });
      }
    });
  }
}
