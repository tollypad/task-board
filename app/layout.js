import './globals.css'

export const metadata = {
  title: 'Task Board - Kanban Task Management',
  description: 'A simple, intuitive Kanban-style task management board. Organize your work with drag-and-drop ease.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
