import { Component, OnInit } from '@angular/core';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {
  imageSrc: string | ArrayBuffer;
  private selectFile: any;
  private fileUrl: any;

  constructor(private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.selectFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
    }
  }

  upload(): void {
    if (this.selectFile !== null) {
      const filePath = `file/${this.selectFile.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      console.log(filePath);
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectFile).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.fileUrl = url;
          });
        })
      ).subscribe();
    }
  }
}
