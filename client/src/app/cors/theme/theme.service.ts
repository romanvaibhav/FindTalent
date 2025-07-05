import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly THEME_KEY = 'theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    document.documentElement.classList.toggle('dark'); // Toggle dark mode class

    const isDarkMode = document.documentElement.classList.contains('dark');
    localStorage.setItem(this.THEME_KEY, isDarkMode ? 'dark' : 'light'); // Save theme
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }}
