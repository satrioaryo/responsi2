import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
const USERNAME = 'namasaya';
@Component({
  selector: 'app-Catatan',
  templateUrl: './Catatan.page.html',
  styleUrls: ['./Catatan.page.scss'],
})
export class CatatanPage implements OnInit {
  public namaUser = '';
  dataTamu: any = [];
  id: number | null = null;
  nama: string = '';
  umur: number | null = null;
  modal_tambah: boolean = false;
  modal_edit: boolean = false;

  constructor(
    private _apiService: ApiService,
    private modal: ModalController,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.cekSesi();
    this.getTamu();
  }

  async cekSesi() {
    const ambilNama = localStorage.getItem(USERNAME);
    if (ambilNama ) {
      // let roleuser = ambilRole;
      let namauser = ambilNama;
      this.nama = namauser;
    } else {
      this.authService.logout();
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }
  logout() {
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Yakin Logout aplikasi ?',
        buttons: [
          {
            text: 'Batal',
            handler: (data: any) => {
              console.log('Canceled', data);
            },
          },
          {
            text: 'Yakin',
            handler: (data: any) => {
              //jika tekan yakin
              this.authService.logout();
              this.router.navigateByUrl('/', { replaceUrl: true });
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  getTamu() {
    this._apiService.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataTamu = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  reset_model() {
    this.id = null;
    this.nama = '';
    this.umur = null;
  }

  cancel() {
    this.modal.dismiss();
    this.modal_tambah = false;
    this.reset_model();
  }

  open_modal_tambah(isOpen: boolean) {
    this.modal_tambah = isOpen;
    this.reset_model();
    this.modal_tambah = true;
    this.modal_edit = false;
  }

  open_modal_edit(isOpen: boolean, idget: any) {
    this.modal_edit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilTamu(this.id);
    this.modal_tambah = false;
    this.modal_edit = true;
  }

  tambahTamu() {
    if (this.nama != '' && this.umur != null) {
      let data = {
        nama: this.nama,
        umur: this.umur,
      };
      this._apiService.tambah(data, '/tambah.php').subscribe({
        next: (hasil: any) => {
          this.reset_model();
          console.log('berhasil tambah Tamu');
          this.getTamu();
          this.modal_tambah = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal tambah Tamu');
        },
      });
    } else {
      console.log('gagal tambah Tamu karena masih ada data yg kosong');
    }
  }

  hapusTamu(id: any) {
    this._apiService.hapus(id, '/hapus.php?id=').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.getTamu();
        console.log('berhasil hapus data');
      },
      error: (error: any) => {
        console.log('gagal');
      },
    });
  }

  ambilTamu(id: any) {
    this._apiService.lihat(id, '/lihat.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let Tamu = hasil;
        this.id = Tamu.id;
        this.nama = Tamu.nama;
        this.umur = Tamu.umur;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      },
    });
  }

  editTamu() {
    let data = {
      id: this.id,
      nama: this.nama,
      umur: this.umur,
    };
    this._apiService.edit(data, 'edit.php').subscribe({
      next: (hasil: any) => {
        console.log(hasil);
        this.reset_model();
        this.getTamu();
        console.log('berhasil edit Tamu');
        this.modal_edit = false;
        this.modal.dismiss();
      },
      error: (err: any) => {
        console.log('gagal edit Tamu ' + err.message);
      },
    });
  }
}
