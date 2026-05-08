import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="layout">
      <header class="header">
        <h1>sandwich_keeper</h1>
        <nav class="nav">
          <a routerLink="/order">Order</a>
          <a routerLink="/sandwich_maker">Sandwich Maker</a>
        </nav>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .layout {
        padding: 24px;
        font-family:
          system-ui,
          -apple-system,
          Segoe UI,
          Roboto,
          sans-serif;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      .nav {
        display: flex;
        gap: 12px;
      }
      .header a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
      }
    `,
  ],
})
export class AppComponent {}
