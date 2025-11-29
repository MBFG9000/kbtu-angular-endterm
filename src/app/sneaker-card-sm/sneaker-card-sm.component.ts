import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Sneaker } from '../shared/models/sneakers.model';

@Component({
  standalone: true,
  selector: 'app-sneaker-card-sm',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './sneaker-card-sm.component.html',
  styleUrl: './sneaker-card-sm.component.css'
})

export class SneakerCardSmComponent {
  @Input() sneaker!: Sneaker;
}
