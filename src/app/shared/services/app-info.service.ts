import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
  constructor() {}

  public get title() {
    return 'Llm Chat App v1';
  }

  public get currentYear() {
    return new Date().getFullYear();
  }
}
