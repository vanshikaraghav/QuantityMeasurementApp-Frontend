import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { QuantityService } from '../../services/quantity.service';
import { QuantityMeasurementEntity } from '../../models/quantity.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class HistoryComponent implements OnInit {
  history: QuantityMeasurementEntity[] = [];
  loading = false;
  errorMessage = '';

  constructor(private router: Router, private quantityService: QuantityService, private cd: ChangeDetectorRef) {}
  ngOnInit() { this.loadHistory(); }

  loadHistory() {
    this.loading = true;
    this.errorMessage = '';
    this.quantityService.getAll().subscribe({
      next: (data) => { this.loading = false; this.history = data.reverse(); this.cd.detectChanges(); },
      error: () => { this.loading = false; this.errorMessage = 'Failed to load history.'; this.cd.detectChanges(); }
    });
  }

  deleteEntry(id: number) {
    this.quantityService.delete(id).subscribe({
      next: () => { this.history = this.history.filter(h => h.id !== id); this.cd.detectChanges(); },
      error: () => { this.errorMessage = 'Failed to delete.'; this.cd.detectChanges(); }
    });
  }

  clearAll() {
    if (!confirm('Delete all history?')) return;
    const ids = this.history.map(h => h.id);
    let done = 0;
    ids.forEach(id => this.quantityService.delete(id).subscribe({
      next: () => { if (++done === ids.length) this.history = []; this.cd.detectChanges(); }
    }));
  }
}
