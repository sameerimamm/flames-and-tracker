export type Category = 'Work' | 'Personal' | 'Study' | 'Shopping' | 'Health';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  category: Category;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string; // ISO string
  completedAt?: string;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortOption =
  | 'date-added-desc'
  | 'date-added-asc'
  | 'due-date-asc'
  | 'priority-desc'
  | 'title-asc';
