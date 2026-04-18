// src/app/services/quantity.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  QuantityDTO,
  QuantityMeasurementEntity,
  CompareResult
} from '../models/quantity.model';

@Injectable({
  providedIn: 'root'
})
export class QuantityService {

  private apiUrl = `${environment.apiUrl}/api/v1/quantities`;

  constructor(private http: HttpClient) {}

  // ➕ ADD two quantities
  add(q1: QuantityDTO, q2: QuantityDTO): Observable<QuantityDTO> {
    return this.http.post<QuantityDTO>(`${this.apiUrl}/add`, [q1, q2]);
  }

  // ➖ SUBTRACT two quantities
  subtract(q1: QuantityDTO, q2: QuantityDTO): Observable<QuantityDTO> {
    return this.http.post<QuantityDTO>(`${this.apiUrl}/subtract`, [q1, q2]);
  }

  // ➗ DIVIDE two quantities
  divide(q1: QuantityDTO, q2: QuantityDTO): Observable<QuantityDTO> {
    return this.http.post<QuantityDTO>(`${this.apiUrl}/divide`, [q1, q2]);
  }

  // ⚖️ COMPARE two quantities
  compare(q1: QuantityDTO, q2: QuantityDTO): Observable<CompareResult> {
    return this.http.post<CompareResult>(`${this.apiUrl}/compare`, [q1, q2]);
  }

  // 🔄 CONVERT a quantity
  convert(q: QuantityDTO, target: string): Observable<QuantityDTO> {
    const params = new HttpParams().set('target', target);
    return this.http.post<QuantityDTO>(`${this.apiUrl}/convert`, q, { params });
  }

  // 📋 GET ALL history records
  getAll(): Observable<QuantityMeasurementEntity[]> {
    return this.http.get<QuantityMeasurementEntity[]>(this.apiUrl);
  }

  // 🔍 GET BY ID
  getById(id: number): Observable<QuantityMeasurementEntity> {
    return this.http.get<QuantityMeasurementEntity>(`${this.apiUrl}/${id}`);
  }

  // ✏️ UPDATE
  update(id: number, entity: QuantityMeasurementEntity): Observable<QuantityMeasurementEntity> {
    return this.http.put<QuantityMeasurementEntity>(`${this.apiUrl}/${id}`, entity);
  }

  // 🗑️ DELETE
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
