import { Component, OnInit } from '@angular/core';
import { ChatSessionService } from './chat.service';

interface ChatSession {
  id: string;
  title: string;
  startedAt: Date;
}

interface GroupedChat {
  date: string;
  chats: ChatSession[];
  expanded: boolean;
  displayedChats: ChatSession[];  // <-- New field
}

interface ChatMessage {
  text: string;
  type: 'user' | 'bot';
  date: Date;
}

interface User {
  id: number;
  name: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  groupedChats: GroupedChat[] = [];
  selectedChat: ChatSession | null = null;

  chatMessages: ChatMessage[] = [];
  currentUser: User = { id: 1, name: 'User' };
  botUser: User = { id: 2, name: 'Bot' };

  constructor(private chatService: ChatSessionService) {}

  ngOnInit(): void {
    this.chatService.getSessions().subscribe(sessions => {
      const grouped = new Map<string, ChatSession[]>();
      sessions.forEach(chat => {
        const dateKey = new Date(chat.startedAt).toDateString();
        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(chat);
      });

      this.groupedChats = Array.from(grouped.entries()).map(([date, chats]) => {
        const sortedChats = chats.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
        return {
          date,
          chats: sortedChats,
          expanded: false,
          displayedChats: sortedChats.slice(0, 5)
        };
      });
    });
  }

  toggleExpand(group: GroupedChat) {
    group.expanded = !group.expanded;
    group.displayedChats = group.expanded ? group.chats : group.chats.slice(0, 5);
  }

  onChatSelect(e: any) {
    this.selectedChat = e.itemData;
    this.chatMessages = [
      { text: 'Hello!', type: 'user', date: new Date() },
      { text: 'Hi, how can I help you?', type: 'bot', date: new Date() }
    ];
  }

  onMessageEntered(e: any) {
    const userMessage: ChatMessage = {
      text: e.text,
      type: 'user',
      date: new Date()
    };
    this.chatMessages.push(userMessage);

    // Simulate bot reply
    setTimeout(() => {
      this.chatMessages.push({
        text: 'Thanks for your message!',
        type: 'bot',
        date: new Date()
      });
    }, 1000);
  }
}
