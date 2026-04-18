import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { QuantityService } from '../../services/quantity.service';
import { AuthService } from '../../services/auth.service';
import { QuantityDTO } from '../../models/quantity.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  operator = '+';
  activeType = 'Length';
  activeAction = 'Conversion';
  value1: number = 0;
  value2: number = 0;
  result: any = null;
  errorMessage = '';
  loading = false;
  from = '';
  to = '';

  // Exact unitName values from microservices Unit.java
  unitsMap: any = {
    Length:      ['meter', 'km', 'cm', 'feet', 'inch', 'yard'],
    Weight:      ['kg', 'gram', 'tonne'],
    Volume:      ['litre', 'ml', 'gallon'],
    Temperature: ['celsius', 'fahrenheit']
  };

  // Temperature does not support arithmetic in microservices QuantityEngine
  get availableActions(): string[] {
    return this.activeType === 'Temperature'
      ? ['Conversion', 'Comparison']
      : ['Conversion', 'Arithmetic', 'Comparison'];
  }

  constructor(
    private quantityService: QuantityService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() { this.setType('Length'); }

  setType(type: string) {
    this.activeType = type;
    this.from = this.unitsMap[type][0];
    this.to = this.unitsMap[type][1];
    this.result = null;
    this.errorMessage = '';
    if (type === 'Temperature' && this.activeAction === 'Arithmetic') {
      this.activeAction = 'Conversion';
    }
  }

  goToHistory() {
    this.router.navigate(this.authService.isLoggedIn() ? ['/history'] : ['/login']);
  }

  calculate() {
    this.errorMessage = '';
    this.result = null;
    this.loading = true;

    const q1: QuantityDTO = { value: this.value1, unit: this.from, type: this.activeType };
    const q2: QuantityDTO = { value: this.value2, unit: this.to,   type: this.activeType };

    if (this.activeAction === 'Conversion') {
      this.quantityService.convert(q1, this.to).subscribe({
        next: (res) => { this.loading = false; this.result = `${res.value} ${res.unit}`;this.cd.detectChanges();  },
        error: (err) => { this.loading = false; this.errorMessage = err.error?.error || err.error?.message || 'Backend not reachable. Is it running on port 8080?';this.cd.detectChanges();  }
      });

    } else if (this.activeAction === 'Arithmetic') {
      const obs$ =
        this.operator === '+' ? this.quantityService.add(q1, q2) :
        this.operator === '-' ? this.quantityService.subtract(q1, q2) :
                                this.quantityService.divide(q1, q2);
      obs$.subscribe({
        next: (res) => { this.loading = false; this.result = `${res.value} ${res.unit}`;this.cd.detectChanges();  },
        error: (err) => { this.loading = false; this.errorMessage = err.error?.error || err.error?.message || 'Backend not reachable. Is it running on port 8080?';this.cd.detectChanges();  }
      });

    } else {
      this.quantityService.compare(q1, q2).subscribe({
        next: (res) => { this.loading = false; this.result = res.equal ? '✅ Equal' : '❌ Not Equal';this.cd.detectChanges();  },
        error: (err) => { this.loading = false; this.errorMessage = err.error?.error || err.error?.message || 'Backend not reachable. Is it running on port 8080?';this.cd.detectChanges();  }
      });
    }
  }
}
