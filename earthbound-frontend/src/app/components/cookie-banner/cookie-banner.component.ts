import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.css']
})
export class CookieBannerComponent implements OnInit {
  accepted: boolean = false;

  ngOnInit() {
    this.accepted = !!localStorage.getItem('cookies-accepted');
  }

  accept() {
    localStorage.setItem('cookies-accepted', 'true');
    this.accepted = true;
  }
}
