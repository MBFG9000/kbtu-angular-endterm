import { Component } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  heroHighlights = [
    { label: 'Simulcasts this week', value: '24 shows' },
    { label: 'Average score', value: '8.6 / 10' },
    { label: 'Watchlists synced', value: '92K+' }
  ];

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
   
}
