import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { getApiBaseUrl } from './runtime-config';

@Component({
  selector: 'app-root',
  imports: [JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly apiBaseUrl = getApiBaseUrl();
  protected users: unknown[] = [];
  protected error = '';
  protected isLoading = false;

  protected async loadUsers(): Promise<void> {
    this.isLoading = true;
    this.error = '';

    try {
      this.users = await firstValueFrom(this.http.get<unknown[]>(`${this.apiBaseUrl}/users`));
    } catch {
      this.error = 'Could not load users from the API.';
    } finally {
      this.isLoading = false;
    }
  }
}
