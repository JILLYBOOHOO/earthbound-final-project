import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = false;

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }
  }

  isDarkMode() {
    return this.darkTheme;
  }

  toggleTheme() {
    if (this.darkTheme) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode() {
    this.darkTheme = true;
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }

  private disableDarkMode() {
    this.darkTheme = false;
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
}
