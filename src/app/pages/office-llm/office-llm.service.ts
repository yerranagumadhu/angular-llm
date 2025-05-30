import { Injectable } from '@angular/core';

interface Item {
  id: string;
  title: string;
  startedAt: Date;
}

// after:
export interface Prompt {
  id: string;
  name: string;  // label for the dropdown
  text: string;  // the actual prompt content
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
    { id: '24', title: 'Product Roadmap Discussion', startedAt: new Date('2025-05-21') },
    // Auto-generated from 25 to 100
    ...Array.from({ length: 76 }, (_, i) => {
      const id = (25 + i).toString();
      const dayOffset = Math.floor(Math.random() * 180); // past 6 months
      const startedAt = new Date();
      startedAt.setDate(startedAt.getDate() - dayOffset);
      const categories = ['Update', 'Sync', 'Briefing', 'Review', 'Feedback', 'Fix', 'Planning'];
      const topics = ['Marketing', 'Security', 'DevOps', 'API', 'UI', 'Database', 'Testing'];

      return {
        id,
        title: `${categories[i % categories.length]}: ${topics[i % topics.length]}`,
        startedAt
      };
    })
  ];

  // -------- Prompts management --------
  private STORAGE_KEY = 'officeLlm.prompts';
  private builtInPrompts: Prompt[] = [
  {
    id: 'summarize',
    name: 'Summarize Document',
    text: 'Please summarize the following document in 3–4 bullet points:'
  },
  {
    id: 'questionGen',
    name: 'Generate Questions',
    text: 'Based on the document, generate 5 comprehension questions:'
  },
  {
    id: 'translate',
    name: 'Translate to Spanish',
    text: 'Translate the entire document into Spanish, preserving technical terms:'
  }
];

  private prompts: Prompt[] = [];

  constructor() {

    // ← clear only our prompts key on every load
    localStorage.removeItem(this.STORAGE_KEY);
// load or initialize prompts
const stored = localStorage.getItem(this.STORAGE_KEY);
if (stored) {
  try {
    const customRaw: Array<{id: string; text: string}> = JSON.parse(stored);
    const custom: Prompt[] = customRaw.map(r => ({
      id: r.id,
      name: r.text,   // default the “name” to the text if you didn’t store a separate name
      text: r.text
    }));
    this.prompts = [...this.builtInPrompts, ...custom];
  } catch {
    this.prompts = [...this.builtInPrompts];
  }
} else {
  this.prompts = [...this.builtInPrompts];
}
    console.log('Loaded prompts:', this.prompts);
  }

  // Items API
  getItems(): Item[] {
    return this.rawItems;
  }

  // Prompts API
  getPrompts(): Prompt[] {
    return [...this.prompts];
  }

  savePrompt(newPrompt: Prompt): void {
    // add to memory
    this.prompts.push(newPrompt);
    // persist only custom prompts
    const custom = this.prompts.filter(p => !this.builtInPrompts.find(b => b.id === p.id));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(custom));
  }

  // after savePrompt…
updatePrompt(updated: Prompt): void {
  const idx = this.prompts.findIndex(p => p.id === updated.id);
  if (idx >= 0) {
    this.prompts[idx] = updated;
    // re-persist your custom ones
    const custom = this.prompts.filter(p =>
      !this.builtInPrompts.some(b => b.id === p.id)
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(custom));
  }
}

}
