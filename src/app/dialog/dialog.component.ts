import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../app.typed';
import { ProductServiceService } from '../services/product-service.service';

interface EditProduct extends Product {
  id: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  productForm!: FormGroup;
  actionBtn: string = 'Add';
  freshList: string[] = ['New Brand', 'Second Hand', 'Ruberfished'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: EditProduct,
    private formBuilder: FormBuilder,
    private productService: ProductServiceService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshNess: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = 'Edit';
      this.setValue('productName', this.editData.productName);
      this.setValue('price', this.editData.price);
      this.setValue('category', this.editData.category);
      this.setValue('comment', this.editData.comment);
      this.setValue('date', this.editData.date);
      this.setValue('freshNess', this.editData.freshNess);
    }
  }

  addProduct() {
    if (this.productForm.valid) {
      if (!this.editData) {
        this.productService.addProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('Product added succesfully');
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            alert(err.message);
          },
        });
      } else {
        this.updateProduct();
      }
    }
  }

  updateProduct() {
    this.productService
      .updateProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.productForm.reset();
          this.dialogRef.close('updated');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  setValue(action: string, obj: string) {
    return this.productForm.controls[action].setValue(obj);
  }
}
