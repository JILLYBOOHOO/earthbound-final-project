import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) { }

  searchByActivity(activity: string) {
    this.router.navigate(['/shop'], { queryParams: { activity: activity } });
  }
}
