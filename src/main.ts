import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  
  window.addEventListener('load', () => {
    const loader: HTMLElement | null = document.querySelector(".loading");
    if (loader) {
      loader.classList.add("loader-hidden");
      loader.addEventListener('transitionend', () => {
        if (document.body && loader.parentNode) {
          document.body.removeChild(loader);
        }
      });
    }
  });
