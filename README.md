# Task Board

Modern Kanban-style task management with drag-and-drop, beautiful UI, and optional MongoDB persistence.

**Live Demo:** https://task-board-lemon-nine.vercel.app  
**GitHub:** https://github.com/tollypad/task-board

## Features

- **Drag & Drop** - Move tasks between columns smoothly
- **Four Columns** - To Do, In Progress, Review, Done (customize)
- **Task Management** - Create, edit, delete with priorities & due dates
- **Two Storage Modes:**
  -  Local Storage (offline-first, works instantly)
  -  MongoDB (optional cloud sync with one env variable)
- **Responsive** - Looks great on all devices
- **Modern UI** - Gradients, animations, polished interactions

## Quick Start

```bash
git clone https://github.com/tollypad/task-board.git
cd task-board
npm install
npm run dev
```

Open http://localhost:3002

## Using MongoDB (Optional)

Tasks save to localStorage by default. To add cloud persistence:

### 1. Create MongoDB Atlas Account (Free)

- Go to mongodb.com/cloud/atlas
- Sign up
- Create a cluster
- Create database user
- Copy connection string

### 2. Add Environment Variable

Create `.env.local` in project root:

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOURPASSWORD@cluster.mongodb.net/task-board?retryWrites=true&w=majority
```

**Important:** `.env.local` is in `.gitignore` - never commit your real credentials.

### 3. Restart Dev Server

```bash
npm run dev
```

Header now shows "✓ MongoDB" when connected.

## How to Use

1. Click **Add Task** to create a task
2. **Drag** tasks between columns
3. **Hover** to edit or delete
4. Set priority (Low/Medium/High)
5. Add due dates
6. Menu button for reset/clear options

## Customizing

### Add/Remove Columns

Edit `lib/tasks.js`:

```javascript
export const COLUMNS = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  DONE: 'done',
}

export const COLUMN_TITLES = {
  [COLUMNS.BACKLOG]: '📚 Backlog',
  [COLUMNS.TODO]: '📋 To Do',
  // ... add your columns
}

export const COLUMN_ORDER = [
  COLUMNS.BACKLOG,
  COLUMNS.TODO,
  // ... in order you want
]
```

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Your color
    600: '#0284c7',  // Hover shade
  },
}
```

### Change Default Tasks

Edit `lib/tasks.js` DEFAULT_TASKS array.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Framer Motion
- Lucide React
- MongoDB (optional)

## Data Structure

Tasks stored as:

```javascript
{
  id: 'task-123456',
  title: 'Task title',
  description: 'Details',
  column: 'in-progress',
  priority: 'high',
  dueDate: '2026-02-28',
  createdAt: '2026-02-23T10:30:00Z',
}
```

Always saved to localStorage. Also saved to MongoDB if configured.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import at vercel.com
3. Add `MONGODB_URI` in Environment Variables (if using)
4. Deploy

### Netlify

```bash
npm run build
# Deploy the .next folder
```

### Self-Hosted

```bash
npm run build
npm run start
```

Server runs on port 3002. Change with:

```bash
PORT=3000 npm run start
```

## API Routes

```
GET    /api/tasks         Fetch all tasks
POST   /api/tasks         Create task
PUT    /api/tasks/[id]    Update task
DELETE /api/tasks/[id]    Delete task
```

## How Persistence Works

1. User makes change
2. Saved to localStorage (instant)
3. Sent to API (if available)
4. MongoDB saves (if connected)

Result: Works offline, syncs to cloud when ready.

## Extend It

- [ ] Multi-user collaboration
- [ ] Real-time updates
- [ ] Subtasks
- [ ] Comments
- [ ] Labels/tags
- [ ] Calendar view
- [ ] Dark mode
- [ ] Time tracking
- [ ] Notifications
- [ ] Mobile app

## FAQ

**Q: Why does it work without MongoDB?**  
A: Everything syncs to localStorage first. MongoDB is optional for cloud backup.

**Q: Where are tasks stored?**  
A: localStorage key `task-board-tasks` (always) + MongoDB (if configured).

**Q: Can I use this without MongoDB?**  
A: Yes! App works perfectly offline with localStorage alone.

## License

Use freely for portfolio, learning, or commercial projects. No attribution needed.

---

Built by Jon Bowen - Production-quality task manager you can customize and deploy anywhere.
