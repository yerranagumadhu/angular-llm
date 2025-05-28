// office-llm.component.ts
import { Component, OnInit } from '@angular/core';
import { OfficeLlmService } from './office-llm.service';

interface Item {
  id: string;
  title: string;
  startedAt: Date;
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

  constructor(private officeLlmService: OfficeLlmService) {}

  ngOnInit() {
    const items = this.officeLlmService.getItems();
    this.groupedItems = this.groupByTimeFrame(items);
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
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

    startNewSession() {
  console.log('New session started!');
  // You can add logic here to reset form, route to a chat, etc.
}

}