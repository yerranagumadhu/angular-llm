import { Injectable } from '@angular/core';

interface Item {
  id: string;
  title: string;
  startedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OfficeLlmService {
  private rawItems: Item[] = [
    { id: '1', title: 'Help with React', startedAt: new Date('2025-05-23') },
    { id: '2', title: 'Angular Tutorial', startedAt: new Date('2025-05-23') },
    { id: '3', title: 'SQL Query Help', startedAt: new Date('2025-05-22') },
    { id: '4', title: 'API Integration', startedAt: new Date('2025-05-21') },
    { id: '5', title: 'Weekly Sync Meeting Notes', startedAt: new Date('2025-05-23') },
    { id: '6', title: 'Project Phoenix Updates', startedAt: new Date('2025-05-23') },
    { id: '7', title: 'Brainstorming Session: Q3 Initiatives', startedAt: new Date('2025-05-22') },
    { id: '8', title: 'Feedback on Design Mockups', startedAt: new Date('2025-05-21') },
    { id: '9', title: 'Quick Question about the Report', startedAt: new Date('2025-05-23') },
    { id: '10', title: 'Weekend Plans & Photos', startedAt: new Date('2024-05-23') },
    { id: '11', title: 'Issue with Login Flow', startedAt: new Date('2024-04-22') },
    { id: '12', title: 'New Employee Onboarding Checklist', startedAt: new Date('2025-05-21') },
    { id: '13', title: 'Team Lunch Coordination', startedAt: new Date('2025-05-23') },
    { id: '14', title: 'Tech Stack Discussion', startedAt: new Date('2025-02-23') },
    { id: '15', title: 'Urgent: Server Downtime', startedAt: new Date('2025-05-22') },
    { id: '16', title: 'Marketing Campaign Review', startedAt: new Date('2023-05-21') },
    { id: '17', title: 'DevOps Automation Ideas', startedAt: new Date('2023-05-23') },
    { id: '18', title: 'Angular Tutorial', startedAt: new Date('2025-05-23') },
    { id: '19', title: 'HR Policy Clarification', startedAt: new Date('2025-01-01') },
    { id: '20', title: 'Latest Industry News', startedAt: new Date('2019-12-29') },
    { id: '21', title: 'Code Review for Feature X', startedAt: new Date('2025-05-23') },
    { id: '22', title: 'Travel Arrangements for Conference', startedAt: new Date('2025-05-23') },
    { id: '23', title: 'Customer Support Escalation', startedAt: new Date('2025-05-22') },
    { id: '24', title: 'Product Roadmap Discussion', startedAt: new Date('2025-05-21') }
  ];

  getItems(): Item[] {
    return this.rawItems;
  }
}
