import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ProductServiceService } from '../services/product-service.service';
import { Product } from '../app.typed';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    'productName',
    'category',
    'price',
    'comment',
    'freshNess',
    'date',
    'Action',
  ];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private productService: ProductServiceService
  ) {}
  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        enterAnimationDuration: '1ms',
        exitAnimationDuration: '1ms',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllProducts();
        }
      });
  }

  getAllProducts() {
    this.productService.getProduct().subscribe({
      next: (res: Product[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(row: Product) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        enterAnimationDuration: '1ms',
        exitAnimationDuration: '1ms',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'updated') {
          this.getAllProducts();
        }
      });
  }

  deletedProduct(id: string) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        console.log(`Product deleted successfully`);
        this.getAllProducts();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
