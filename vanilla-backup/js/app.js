/**
 * TaskFlow — Modern To-Do & Task Manager
 * Full-featured Vanilla JavaScript Application
 */

(function () {
  'use strict';

  // ==========================================
  // Storage Keys & Default State
  // ==========================================
  const STORAGE_KEY = 'taskflow_tasks_v1';
  const THEME_KEY = 'taskflow_theme';

  const defaultTasks = [
    {
      id: 'task-1',
      title: 'Review quarterly project architecture',
      notes: 'Check distributed tracing and caching layer design notes.',
      category: 'Work',
      priority: 'high',
      dueDate: getRelativeDateString(1),
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'task-2',
      title: 'Weekly grocery restock',
      notes: 'Almond milk, avocados, sourdough bread, organic eggs, ground coffee.',
      category: 'Shopping',
      priority: 'medium',
      dueDate: getRelativeDateString(0),
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'task-3',
      title: 'Read 25 pages of System Design & Architecture',
      notes: 'Focus on consensus algorithms and Paxos vs Raft.',
      category: 'Study',
      priority: 'low',
      dueDate: getRelativeDateString(3),
      completed: true,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
      id: 'task-4',
      title: 'Morning 5km run & hydration',
      notes: 'Stretch for 10 minutes afterwards.',
      category: 'Health',
      priority: 'medium',
      dueDate: getRelativeDateString(-1), // Example past date
      completed: true,
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
    }
  ];

  // ==========================================
  // Application State
  // ==========================================
  let tasks = loadTasks();
  let currentFilter = 'all'; // 'all' | 'active' | 'completed'
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'date-added-desc';

  // ==========================================
  // DOM Elements
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentDateDisplay = document.getElementById('currentDateDisplay');

  // Stats
  const progressPercentage = document.getElementById('progressPercentage');
  const progressBarFill = document.getElementById('progressBarFill');
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statCompleted = document.getElementById('statCompleted');

  // Form Elements
  const taskForm = document.getElementById('taskForm');
  const taskTitleInput = document.getElementById('taskTitleInput');
  const taskCategorySelect = document.getElementById('taskCategorySelect');
  const taskPrioritySelect = document.getElementById('taskPrioritySelect');
  const taskDueDateInput = document.getElementById('taskDueDateInput');
  const toggleNotesBtn = document.getElementById('toggleNotesBtn');
  const formNotesContainer = document.getElementById('formNotesContainer');
  const taskNotesInput = document.getElementById('taskNotesInput');

  // Toolbar
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const statusTabs = document.querySelectorAll('.status-tab');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortSelect = document.getElementById('sortSelect');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  // Task List & Empty State
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const emptyStateTitle = document.getElementById('emptyStateTitle');
  const emptyStateSubtitle = document.getElementById('emptyStateSubtitle');

  // Edit Modal
  const editModal = document.getElementById('editModal');
  const editTaskForm = document.getElementById('editTaskForm');
  const editTaskId = document.getElementById('editTaskId');
  const editTaskTitle = document.getElementById('editTaskTitle');
  const editTaskNotes = document.getElementById('editTaskNotes');
  const editTaskCategory = document.getElementById('editTaskCategory');
  const editTaskPriority = document.getElementById('editTaskPriority');
  const editTaskDueDate = document.getElementById('editTaskDueDate');
  const closeEditModalBtn = document.getElementById('closeEditModalBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  // Shortcuts Modal & Import/Export
  const shortcutsBtn = document.getElementById('shortcutsBtn');
  const shortcutsModal = document.getElementById('shortcutsModal');
  const closeShortcutsBtn = document.getElementById('closeShortcutsBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importFileInput = document.getElementById('importFileInput');
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================
  // Initialization
  // ==========================================
  function init() {
    initTheme();
    renderCurrentDate();
    setupEventListeners();
    renderTasks();
  }

  // ==========================================
  // Helper Functions: Dates & Storage
  // ==========================================
  function getRelativeDateString(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  }

  function renderCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    currentDateDisplay.textContent = now.toLocaleDateString('en-US', options);
  }

  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    // Return sample tasks on first launch
    return defaultTasks;
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
      showToast('Storage error: unable to save task changes', 'error');
    }
  }

  // ==========================================
  // Theme Management
  // ==========================================
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      document.body.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  function toggleTheme() {
    const current = document.body.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    showToast(`Switched to ${nextTheme} mode`, 'info');
  }

  // ==========================================
  // Filter & Sorting Pipeline
  // ==========================================
  function getFilteredAndSortedTasks() {
    let result = tasks.filter(task => {
      // Status filter
      if (currentFilter === 'active' && task.completed) return false;
      if (currentFilter === 'completed' && !task.completed) return false;

      // Category filter
      if (currentCategory !== 'all' && task.category !== currentCategory) return false;

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = task.title.toLowerCase().includes(query);
        const notesMatch = task.notes ? task.notes.toLowerCase().includes(query) : false;
        if (!titleMatch && !notesMatch) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (currentSort) {
        case 'date-added-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'due-date-asc': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        case 'priority-desc': {
          const weights = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'date-added-desc':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }

  // ==========================================
  // Rendering
  // ==========================================
  function renderTasks() {
    updateStats();

    const filtered = getFilteredAndSortedTasks();
    taskList.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      if (tasks.length === 0) {
        emptyStateTitle.textContent = 'All caught up!';
        emptyStateSubtitle.textContent = 'You have no tasks left. Add a new task above.';
      } else if (searchQuery.trim() !== '') {
        emptyStateTitle.textContent = 'No matching tasks';
        emptyStateSubtitle.textContent = `No tasks matched "${searchQuery}".`;
      } else if (currentFilter === 'completed') {
        emptyStateTitle.textContent = 'No completed tasks yet';
        emptyStateSubtitle.textContent = 'Mark tasks as done to see them listed here.';
      } else {
        emptyStateTitle.textContent = 'No tasks in this view';
        emptyStateSubtitle.textContent = 'Try choosing a different category or status.';
      }
    } else {
      emptyState.style.display = 'none';

      filtered.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
      });
    }
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    statTotal.textContent = total;
    statActive.textContent = active;
    statCompleted.textContent = completed;

    progressPercentage.textContent = `${percentage}%`;
    progressBarFill.style.width = `${percentage}%`;
  }

  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    // Checkbox container
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';
    checkboxContainer.setAttribute('role', 'checkbox');
    checkboxContainer.setAttribute('aria-checked', task.completed ? 'true' : 'false');
    checkboxContainer.setAttribute('tabindex', '0');
    checkboxContainer.setAttribute('title', task.completed ? 'Mark incomplete' : 'Mark complete');

    const customCheckbox = document.createElement('div');
    customCheckbox.className = 'custom-checkbox';
    customCheckbox.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    checkboxContainer.appendChild(customCheckbox);

    checkboxContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleTaskCompletion(task.id);
    });

    checkboxContainer.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleTaskCompletion(task.id);
      }
    });

    // Content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';

    // Title
    const titleRow = document.createElement('div');
    titleRow.className = 'task-title-row';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = task.title;
    titleRow.appendChild(titleSpan);

    contentDiv.appendChild(titleRow);

    // Notes if present
    if (task.notes && task.notes.trim() !== '') {
      const notesP = document.createElement('p');
      notesP.className = 'task-notes';
      notesP.textContent = task.notes;
      contentDiv.appendChild(notesP);
    }

    // Meta badges: Category, Priority, Due Date
    const metaDiv = document.createElement('div');
    metaDiv.className = 'task-meta';

    // Category badge
    if (task.category) {
      const catBadge = document.createElement('span');
      catBadge.className = `badge badge-cat-${task.category.toLowerCase()}`;
      catBadge.textContent = task.category;
      metaDiv.appendChild(catBadge);
    }

    // Priority badge
    if (task.priority) {
      const prioBadge = document.createElement('span');
      prioBadge.className = `badge badge-priority-${task.priority}`;
      prioBadge.textContent = task.priority;
      metaDiv.appendChild(prioBadge);
    }

    // Due date badge
    if (task.dueDate) {
      const dueBadge = document.createElement('span');
      const dueInfo = formatDueDate(task.dueDate, task.completed);
      dueBadge.className = `badge badge-due ${dueInfo.className}`;
      dueBadge.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${dueInfo.text}</span>
      `;
      metaDiv.appendChild(dueBadge);
    }

    contentDiv.appendChild(metaDiv);

    // Action buttons (Edit & Delete)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.setAttribute('title', 'Edit');
    editBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;
    editBtn.addEventListener('click', () => openEditModal(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.setAttribute('title', 'Delete');
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(checkboxContainer);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    return li;
  }

  function formatDueDate(dueDateStr, isCompleted) {
    if (!dueDateStr) return { text: '', className: '' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dueDateStr.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));

    if (!isCompleted && diffDays < 0) {
      return { text: `Overdue (${dueDateStr})`, className: 'overdue' };
    }
    if (diffDays === 0) {
      return { text: 'Due Today', className: 'today' };
    }
    if (diffDays === 1) {
      return { text: 'Due Tomorrow', className: '' };
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      text: `Due ${monthNames[month - 1]} ${day}`,
      className: ''
    };
  }

  // ==========================================
  // Task Actions (CRUD)
  // ==========================================
  function addTask(title, category, priority, dueDate, notes) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: trimmedTitle,
      category: category || 'Personal',
      priority: priority || 'medium',
      dueDate: dueDate || '',
      notes: (notes || '').trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    showToast('Task added successfully', 'success');
  }

  function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();
    renderTasks();

    if (task.completed) {
      showToast('Task completed! 🎉', 'success');
    }
  }

  function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    saveTasks();
    renderTasks();

    showToast('Task deleted', 'info');
  }

  function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      showToast('No completed tasks to clear', 'info');
      return;
    }

    if (!confirm(`Are you sure you want to clear ${completedCount} completed task(s)?`)) {
      return;
    }

    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    showToast(`Cleared ${completedCount} completed task(s)`, 'info');
  }

  // ==========================================
  // Edit Modal Handling
  // ==========================================
  function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editTaskId.value = task.id;
    editTaskTitle.value = task.title;
    editTaskNotes.value = task.notes || '';
    editTaskCategory.value = task.category || 'Personal';
    editTaskPriority.value = task.priority || 'medium';
    editTaskDueDate.value = task.dueDate || '';

    editModal.classList.add('open');
    editModal.setAttribute('aria-hidden', 'false');
    editTaskTitle.focus();
  }

  function closeEditModal() {
    editModal.classList.remove('open');
    editModal.setAttribute('aria-hidden', 'true');
    editTaskForm.reset();
  }

  function saveEditedTask(e) {
    e.preventDefault();
    const id = editTaskId.value;
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newTitle = editTaskTitle.value.trim();
    if (!newTitle) return;

    task.title = newTitle;
    task.notes = editTaskNotes.value.trim();
    task.category = editTaskCategory.value;
    task.priority = editTaskPriority.value;
    task.dueDate = editTaskDueDate.value;

    saveTasks();
    renderTasks();
    closeEditModal();
    showToast('Task updated', 'success');
  }

  // ==========================================
  // Shortcuts Modal
  // ==========================================
  function openShortcutsModal() {
    shortcutsModal.classList.add('open');
    shortcutsModal.setAttribute('aria-hidden', 'false');
  }

  function closeShortcutsModal() {
    shortcutsModal.classList.remove('open');
    shortcutsModal.setAttribute('aria-hidden', 'true');
  }

  // ==========================================
  // Import & Export
  // ==========================================
  function exportTasks() {
    const jsonStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Tasks exported to JSON file', 'info');
  }

  function importTasks(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);
        if (!Array.isArray(importedData)) {
          throw new Error('Imported data must be an array of tasks.');
        }

        // Validate basic schema
        const validatedTasks = importedData.map(item => ({
          id: item.id || 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          title: String(item.title || 'Untitled task'),
          notes: String(item.notes || ''),
          category: item.category || 'Personal',
          priority: ['low', 'medium', 'high', 'urgent'].includes(item.priority) ? item.priority : 'medium',
          dueDate: item.dueDate || '',
          completed: Boolean(item.completed),
          createdAt: item.createdAt || new Date().toISOString()
        }));

        tasks = validatedTasks;
        saveTasks();
        renderTasks();
        showToast(`Successfully imported ${validatedTasks.length} tasks!`, 'success');
      } catch (err) {
        console.error('Failed to parse import file', err);
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
  }

  // ==========================================
  // Toast Notifications
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, 2800);
  }

  // ==========================================
  // Event Listeners Setup
  // ==========================================
  function setupEventListeners() {
    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Form submission (Add task)
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = taskTitleInput.value;
      const category = taskCategorySelect.value;
      const priority = taskPrioritySelect.value;
      const dueDate = taskDueDateInput.value;
      const notes = taskNotesInput.value;

      addTask(title, category, priority, dueDate, notes);

      // Reset form
      taskTitleInput.value = '';
      taskNotesInput.value = '';
      taskDueDateInput.value = '';
      formNotesContainer.style.display = 'none';
      toggleNotesBtn.classList.remove('active');
    });

    // Toggle notes expandable container in form
    toggleNotesBtn.addEventListener('click', () => {
      const isVisible = formNotesContainer.style.display !== 'none';
      formNotesContainer.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        taskNotesInput.focus();
      }
    });

    // Search Input & Clear
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
      renderTasks();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderTasks();
      searchInput.focus();
    });

    // Status tabs (All, Active, Completed)
    statusTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        statusTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderTasks();
      });
    });

    // Category filter
    categoryFilter.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      renderTasks();
    });

    // Sort select
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderTasks();
    });

    // Clear completed button
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Edit modal events
    editTaskForm.addEventListener('submit', saveEditedTask);
    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) closeEditModal();
    });

    // Shortcuts modal events
    shortcutsBtn.addEventListener('click', openShortcutsModal);
    closeShortcutsBtn.addEventListener('click', closeShortcutsModal);
    shortcutsModal.addEventListener('click', (e) => {
      if (e.target === shortcutsModal) closeShortcutsModal();
    });

    // Export & Import
    exportBtn.addEventListener('click', exportTasks);
    importFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importTasks(e.target.files[0]);
        importFileInput.value = ''; // reset so same file can be selected again
      }
    });

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

      if (e.key === 'Escape') {
        if (editModal.classList.contains('open')) closeEditModal();
        if (shortcutsModal.classList.contains('open')) closeShortcutsModal();
        return;
      }

      if (!isTyping) {
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          taskTitleInput.focus();
        } else if (e.key === '/') {
          e.preventDefault();
          searchInput.focus();
        } else if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          toggleTheme();
        }
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
