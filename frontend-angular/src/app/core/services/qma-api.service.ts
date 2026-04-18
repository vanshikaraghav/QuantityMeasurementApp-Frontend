import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface QuantityInputDTO {
  value1: number;
  unit1: string;
  value2?: number;
  unit2?: string;
  targetUnit?: string;
  type: string;
}

export interface OperationResponse {
  result: number;
  resultUnit: string;
  operation: string;
  message: string;
  timestamp?: string;
}

export interface QuantityOperation {
  id?: number;
  operation: string;
  type: string;
  value1: number;
  unit1: string;
  value2?: number;
  unit2?: string;
  result: number;
  resultUnit: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QmaApiService {
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/v1/quantities`;

  constructor(private http: HttpClient) {}

  add(input: QuantityInputDTO): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${this.baseUrl}/add`, input);
  }

  subtract(input: QuantityInputDTO): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${this.baseUrl}/subtract`, input);
  }

  multiply(input: QuantityInputDTO): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${this.baseUrl}/multiply`, input);
  }

  divide(input: QuantityInputDTO): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${this.baseUrl}/divide`, input);
  }

  compare(input: QuantityInputDTO): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${this.baseUrl}/compare`, input);
  }

  convert(input: QuantityInputDTO): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${this.baseUrl}/convert`, input);
  }

  getHistoryByOperation(operation: string): Observable<QuantityOperation[]> {
    return this.http.get<QuantityOperation[]>(`${this.baseUrl}/history/operation/${operation}`);
  }

  getHistoryByType(type: string): Observable<QuantityOperation[]> {
    return this.http.get<QuantityOperation[]>(`${this.baseUrl}/history/type/${type}`);
  }

  countByOperation(operation: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/${operation}`);
  }
}
