import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  #document = inject(DOCUMENT);
  #storageKey = 'theme-preference';
  
  isDarkMode = signal(this.#getInitialTheme());

	constructor() {
		if (this.isDarkMode())
			this.#document.body.classList.add('dark');
	}

  toggleTheme(): void {
    this.isDarkMode.update(isDarkMode => {
      const newValue = !isDarkMode;
			if (newValue) {
				localStorage.setItem(this.#storageKey, 'dark');
				this.#document.body.classList.add('dark');
			} else {
				localStorage.setItem(this.#storageKey, 'light');
				this.#document.body.classList.remove('dark');
			}
      return newValue;
    });
  }

  #getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem(this.#storageKey);
    if (savedTheme)
      return savedTheme === 'dark';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}