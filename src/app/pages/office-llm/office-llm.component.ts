import { Component, OnInit } from '@angular/core';
import { OfficeLlmService } from './office-llm.service';
import { Message, MessageEnteredEvent } from 'devextreme/ui/chat';


interface Item {
  id: string;
  title: string;
  startedAt: Date;
}

interface ChatMessage {
  id?: string | number;
  text: string;
  timestamp: Date;
  author: {
    id: string;
    name: string;
  };
}

@Component({
  selector: 'app-office-llm',
  templateUrl: './office-llm.component.html',
  styleUrls: ['./office-llm.component.scss']
})
export class OfficeLlmComponent implements OnInit {
  isSidebarCollapsed = false;
  expandedGroups: Record<string, boolean> = {};
  groupedItems: Record<string, Item[]> = {};
  selectedItemTitle: string = '';  // Track the selected item's title


  messages: Message[] = [
    {
      id: 1,
      text: 'Hi! How can I help you today?',
      timestamp: new Date(),
      author: {
        id: 'bot',
        name: 'Assistant'
      }
    }
  ];

  currentUser = {
    id: 'user',
    name: 'You'
  };

  localization: any;

  constructor(private officeLlmService: OfficeLlmService) { }

  // ── NEW: dropdown + uploader data sources ──
  audiences = [
    { id: 'all', text: 'All Users' },
    { id: 'internal', text: 'Internal Only' },
    { id: 'external', text: 'External Partners' },
  ];
  docTypes = [
    { id: 'report', text: 'Report' },
    { id: 'guide', text: 'User Guide' },
    { id: 'spec', text: 'Specification' },
  ];
  prompts = [
    { id: 'summarize', text: 'Summarize Document' },
    { id: 'questionGen', text: 'Generate Questions' },
    { id: 'translate', text: 'Translate to Spanish' },
  ];

  // ── NEW: selected values ──
  selectedAudience: string | null = null;
  selectedDocType: string | null = null;
  selectedPrompt: string | null = null;

  // ── NEW: file upload handler ──
  onFileUploaded(e: any) {
    const file = e.component._files?.[0];
    if (file) {
      console.log('Uploaded:', file.name);
      // TODO: read/send file contents as needed
    }
  }


  ngOnInit() {
    const items = this.officeLlmService.getItems();
    this.groupedItems = this.groupByTimeFrame(items);


    // Load localization (for example, 'en' for English)
    this.localization = this.officeLlmService.getLocalization('en');
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  groupOrder = ['Today', 'Yesterday', 'Past 7 Days', 'Past 30 Days', 'Older'];

  toggleGroup(label: string) {
    this.expandedGroups[label] = !this.expandedGroups[label];
  }

  isGroupExpanded(label: string): boolean {
    return this.expandedGroups[label] || false;
  }

  getVisibleItems(items: Item[], groupName: string): Item[] {
    return this.isGroupExpanded(groupName) ? items : items.slice(0, 5);
  }

  groupByTimeFrame(items: Item[]): Record<string, Item[]> {
    const now = new Date();
    const grouped: Record<string, Item[]> = {
      'Today': [],
      'Yesterday': [],
      'Past 7 Days': [],
      'Past 30 Days': [],
      'Older': []
    };

    for (const item of items) {
      const itemDate = new Date(item.startedAt);
      const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.floor((today.getTime() - itemDay.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) grouped['Today'].push(item);
      else if (diffDays === 1) grouped['Yesterday'].push(item);
      else if (diffDays <= 7) grouped['Past 7 Days'].push(item);
      else if (diffDays <= 30) grouped['Past 30 Days'].push(item);
      else grouped['Older'].push(item);
    }

    return grouped;
  }

  onMessageEntered(e: MessageEnteredEvent): void {
    if (e.message && e.message.text) {
      this.messages = [...this.messages, {
        ...e.message,
        id: Date.now(), // provide ID since DevExtreme may not
        timestamp: new Date() // ensure timestamp is set
      }];
    }
  }

  startNewSession() {
    this.messages = [
      {
        id: 1,
        text: 'New chat started. How can I help?',
        timestamp: new Date(),
        author: { id: 'bot', name: 'Assistant' }
      }
    ];
  }

  // Handle session click and update the title
  onSessionClick(item: Item) {
    this.selectedItemTitle = item.title;  // Set the title of the clicked session
    this.messages = [
      {
        id: 1,
        text: `Session started: ${item.title}`,
        timestamp: new Date(),
        author: { id: 'bot', name: 'Assistant' }
      }
    ];
  }
}
