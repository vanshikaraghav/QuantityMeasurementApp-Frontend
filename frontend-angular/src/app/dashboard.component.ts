import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.services';

type MeasureType = 'length' | 'weight' | 'temperature' | 'volume';
type UnitMap = Record<string, number | string>;

interface UnitSet {
  units: UnitMap;
  convert: (value: number, from: string, to: string) => number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  currentType: MeasureType = 'length';
  currentAction = 'comparison';
  comparisonFromValue = 1;
  comparisonFromUnit = 'Meter';
  comparisonToUnit = 'Kilometer';
  comparisonToValue = '1000';

  conversionInput = 1;
  conversionFromUnit = 'Meter';
  conversionToUnit = 'Kilometer';
  conversionResult = '1000';

  arithValue1 = 1;
  arithUnit1 = 'Meter';
  arithValue2 = 1;
  arithUnit2 = 'Kilometer';
  arithOperator = '+';
  arithResultUnit = 'Meter';
  arithResult = '1';

  history: string[] = [];

  readonly types: { key: MeasureType; label: string; icon: string }[] = [
    { key: 'length', label: 'Length', icon: 'L' },
    { key: 'weight', label: 'Weight', icon: 'W' },
    { key: 'temperature', label: 'Temperature', icon: 'T' },
    { key: 'volume', label: 'Volume', icon: 'V' }
  ];

  readonly actions = [
    { key: 'comparison', label: 'Comparison' },
    { key: 'conversion', label: 'Conversion' },
    { key: 'arithmetic', label: 'Arithmetic' },
    { key: 'history', label: 'History' }
  ];

  readonly unitSets: Record<MeasureType, UnitSet> = {
    length: {
      units: {
        Kilometer: 1000,
        Meter: 1,
        Centimeter: 0.01,
        Millimeter: 0.001,
        Mile: 1609.34,
        Yard: 0.9144,
        Foot: 0.3048,
        Inch: 0.0254
      },
      convert: (value: number, from: string, to: string) => {
        const units = this.unitSets.length.units as Record<string, number>;
        return value * (units[from] / units[to]);
      }
    },
    weight: {
      units: {
        Kilogram: 1,
        Gram: 0.001,
        Pound: 0.453592,
        Ounce: 0.0283495
      },
      convert: (value: number, from: string, to: string) => {
        const units = this.unitSets.weight.units as Record<string, number>;
        return value * (units[from] / units[to]);
      }
    },
    temperature: {
      units: {
        Celsius: 'C',
        Fahrenheit: 'F',
        Kelvin: 'K'
      },
      convert: (value: number, from: string, to: string) => {
        let celsius: number;
        if (from === 'Celsius') celsius = value;
        else if (from === 'Fahrenheit') celsius = (value - 32) * (5 / 9);
        else celsius = value - 273.15;

        if (to === 'Celsius') return celsius;
        if (to === 'Fahrenheit') return celsius * (9 / 5) + 32;
        return celsius + 273.15;
      }
    },
    volume: {
      units: {
        Liter: 1,
        Milliliter: 0.001,
        Gallon: 3.78541,
        CubicMeter: 1000
      },
      convert: (value: number, from: string, to: string) => {
        const units = this.unitSets.volume.units as Record<string, number>;
        return value * (units[from] / units[to]);
      }
    }
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.initializeDefaults();
    this.history = this.loadHistory();
    this.refreshAll(false);
  }

  get userName() {
    const user = this.authService.getCurrentUser();
    return user?.name || '';
  }

  get userEmail() {
    return this.authService.getCurrentUser()?.email || 'guest';
  }

  private get historyStorageKey() {
    return `qmaHistory_${this.userEmail}`;
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  get unitNames() {
    return Object.keys(this.unitSets[this.currentType].units);
  }

  initializeDefaults() {
    const names = this.unitNames;
    this.comparisonFromUnit = names[0];
    this.comparisonToUnit = names[1] || names[0];
    this.conversionFromUnit = names[0];
    this.conversionToUnit = names[1] || names[0];
    this.arithUnit1 = names[0];
    this.arithUnit2 = names[1] || names[0];
    this.arithResultUnit = names[1] || names[0];
  }

  selectType(type: MeasureType) {
    this.currentType = type;
    this.initializeDefaults();
    this.refreshAll(false);
  }

  selectAction(action: string) {
    this.currentAction = action;
    if (action === 'history') {
      this.history = this.loadHistory();
    }
  }

  updateComparison() {
    const value = Number(this.comparisonFromValue || 0);
    const converted = this.convertValue(value, this.comparisonFromUnit, this.comparisonToUnit);
    this.comparisonToValue = this.formatNumber(converted);
    this.addHistoryEntry(`Comparison: ${this.formatNumber(value)} ${this.comparisonFromUnit} = ${this.comparisonToValue} ${this.comparisonToUnit}`);
  }

  updateConversion() {
    const value = Number(this.conversionInput || 0);
    const converted = this.convertValue(value, this.conversionFromUnit, this.conversionToUnit);
    this.conversionResult = this.formatNumber(converted);
    this.addHistoryEntry(`Conversion: ${this.formatNumber(value)} ${this.conversionFromUnit} -> ${this.conversionResult} ${this.conversionToUnit}`);
  }

  updateArithmetic() {
    const v1 = Number(this.arithValue1 || 0);
    const v2 = Number(this.arithValue2 || 0);
    const unit1 = this.arithUnit1;
    const unit2 = this.arithUnit2;
    const targetUnit = this.arithResultUnit;
    const operator = this.arithOperator;

    const first = this.convertValue(v1, unit1, targetUnit);
    const second = this.convertValue(v2, unit2, targetUnit);
    let result: number;

    switch (operator) {
      case '+':
        result = first + second;
        break;
      case '-':
        result = first - second;
        break;
      case '*':
        result = first * second;
        break;
      case '/':
        result = second !== 0 ? first / second : 0;
        break;
      default:
        result = 0;
    }

    this.arithResult = this.formatNumber(result);
    this.addHistoryEntry(`Arithmetic: ${this.formatNumber(v1)} ${unit1} ${operator} ${this.formatNumber(v2)} ${unit2} = ${this.arithResult} ${targetUnit}`);
  }

  convertValue(value: number, from: string, to: string) {
    return this.unitSets[this.currentType].convert(value, from, to);
  }

  formatNumber(value: number) {
    if (!Number.isFinite(value)) {
      return '0';
    }
    return Number(value.toFixed(6)).toString();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  goToAuth() {
    this.router.navigate(['/auth']);
  }

  private addHistoryEntry(entry: string) {
    if (!this.isLoggedIn) {
      return;
    }

    const currentHistory = this.loadHistory();
    if (currentHistory[0] === entry) {
      return;
    }

    currentHistory.unshift(entry);
    const trimmed = currentHistory.slice(0, 50);
    localStorage.setItem(this.historyStorageKey, JSON.stringify(trimmed));
    this.history = trimmed;
  }

  private loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.historyStorageKey) || '[]');
    } catch {
      return [];
    }
  }

  private refreshAll(shouldRecord = false) {
    const previousHistory = this.history;
    this.updateComparison();
    this.updateConversion();
    this.updateArithmetic();

    if (!shouldRecord) {
      this.history = previousHistory;
      localStorage.setItem(this.historyStorageKey, JSON.stringify(previousHistory));
    }
  }
}
