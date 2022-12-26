import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../app.typed';

const url:string = "https://angular-project-backend.vercel.app/api/product"

@Injectable({
  providedIn: 'root',
})

export class ProductServiceService {
  constructor(private http: HttpClient) {}

  addProduct(data: Product) {
    return this.http.post<Product>(`${url}`, data);
  }

  getProduct() {
    return this.http.get<Product[]>(url);
  }

  updateProduct(data: Product, id: string) {
    return this.http.put<Product>(
      `${url}/${id}`,
      data
    );
  }

  deleteProduct(id: string) {
    return this.http.delete<Product>(`${url}/${id}`);
  }
}
