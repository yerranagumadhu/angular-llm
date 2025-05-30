import { Component, OnInit } from '@angular/core';
import { OfficeLlmService, Prompt } from './office-llm.service';
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

  // Map your prompt IDs to starter text:
  predefinedPromptMap: Record<string, string> = {
    summarize: `Please summarize the following document in 3–4 bullet points:`,
    questionGen: `Based on the document, generate 5 comprehension questions:`,
    translate: `Translate the entire document into Spanish, preserving technical terms:`
  };

  // Hold the current textbox value:
  promptText: string = '';
  // state for showing the textbox and capturing the name
  showFavoriteNaming = false;
  favoriteName = '';

  // Whenever selection changes, update the promptText:
  // Before you only had `text`
  onPromptChange(id: string | null) {
    
    if (!id) {
      this.promptText = '';
      return;
    }
    const p = this.prompts.find(p => p.id === id);
    this.promptText = p ? p.text : '';
    this.showFavoriteNaming = false;
  }



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

  // new state trackers
  isCopied = false;
  favoritePromptIds = new Set<string>();

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
  prompts: Prompt[] = [];

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


    this.prompts = this.officeLlmService.getPrompts();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // ── NEW: control panel collapsed state ──
  isControlCollapsed = false;

  toggleControl() {
    this.isControlCollapsed = !this.isControlCollapsed;
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



  // Called when user clicks the star/favorites icon


  // copy handler
  copyPrompt() {
    if (!this.promptText) { return; }
    navigator.clipboard.writeText(this.promptText)
      .then(() => {
        this.isCopied = true;
        // revert after 800ms
        setTimeout(() => this.isCopied = false, 800);
      })
      .catch(err => console.error('Copy failed:', err));
  }
  

  // save handler
  savePromptToLibrary() {
    if (!this.promptText) return;
    const newPrompt: Prompt = {
      id: `custom_${Date.now()}`,
      name: this.favoriteName.trim(),    // <- the label the user just entered
      text: this.promptText              // <- the actual prompt content
    };

    this.officeLlmService.savePrompt(newPrompt);
    this.prompts = this.officeLlmService.getPrompts();
    // mark this one as favorite
    this.favoritePromptIds.add(newPrompt.id);
  }

  // helper for template
  isCurrentPromptFavorite(): boolean {
    console.log('Checking selected for:', this.selectedPrompt);
    console.log('Checking favorite for:', this.favoritePromptIds);    
    return this.selectedPrompt ? this.favoritePromptIds.has(this.selectedPrompt) : false;
  }

  // add this helper to look up a Prompt by id
getPromptById(id: string): Prompt | undefined {
  return this.prompts.find(p => p.id === id);
}
  // When user first clicks the star…
 onFavoriteClick() {
  // if this prompt is already favorited, prefill its name
  if ( this.selectedPrompt) {
    const existing = this.getPromptById(this.selectedPrompt);
    this.favoriteName = existing?.name || '';
  } else {
    // new favorite: start blank
    this.favoriteName = '';
  }

  // always show the naming UI
  this.showFavoriteNaming = true;
}

confirmFavoriteName() {
  const name = this.favoriteName.trim();
  if (!name) { return; }

  // build & save new favorite
  const newPrompt: Prompt = {
    id: `custom_${Date.now()}`,
    name,
    text: this.promptText
  };
  this.officeLlmService.savePrompt(newPrompt);

  // re-load prompts from the service
  this.prompts = this.officeLlmService.getPrompts();

  // **select** the newly created prompt so that onFavoriteClick → prefill works
  this.selectedPrompt = newPrompt.id;

  // also mark it in your favorites set
  this.favoritePromptIds.add(newPrompt.id);

  // close the naming UI
  this.showFavoriteNaming = false;
}





  // If they cancel…
  cancelFavoriteNaming() {
    this.showFavoriteNaming = false;
  }

}
