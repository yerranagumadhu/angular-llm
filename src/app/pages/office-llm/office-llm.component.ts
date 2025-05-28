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

  constructor(private officeLlmService: OfficeLlmService) { }

  ngOnInit() {
    const items = this.officeLlmService.getItems();
    this.groupedItems = this.groupByDate(items);
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  groupByDate(items: Item[]): Record<string, Item[]> {
    const grouped: Record<string, Item[]> = {};
    for (const item of items) {
      const dateStr = item.startedAt.toDateString();
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(item);
    }
    return grouped;
  }

  sortByDate = (a: any, b: any) =>
    new Date(b.key).getTime() - new Date(a.key).getTime();

  toggleGroup(date: string) {
    this.expandedGroups[date] = !this.expandedGroups[date];
  }

  isGroupExpanded(date: string): boolean {
    return this.expandedGroups[date] || false;
  }

  getVisibleItems(items: Item[]): Item[] {
    const date = items[0]?.startedAt.toDateString();
    return this.isGroupExpanded(date) ? items : items.slice(0, 5);
  }
}
