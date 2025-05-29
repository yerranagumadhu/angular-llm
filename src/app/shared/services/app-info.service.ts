import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
  constructor() {}

  public get title() {
    return 'Cooperate communication LLM App';
  }

  public get currentYear() {
    return new Date().getFullYear();
  }
}
