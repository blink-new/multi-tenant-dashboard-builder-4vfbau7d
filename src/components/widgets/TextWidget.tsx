import { ScrollArea } from '@/components/ui/scroll-area'
import { Widget } from '@/types/dashboard'

interface TextWidgetProps {
  widget: Widget
}

export function TextWidget({ widget }: TextWidgetProps) {
  const content = widget.data?.content || `
# Welcome to your Dashboard

This is a **text widget** where you can add:

- Notes and documentation
- Important announcements
- Links and references
- Any markdown content

You can customize this content through the widget configuration.
  `.trim()

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h3 key={index} className="text-lg font-bold mb-2">{line.slice(2)}</h3>
        }
        if (line.startsWith('## ')) {
          return <h4 key={index} className="text-base font-semibold mb-2">{line.slice(3)}</h4>
        }
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 text-sm text-muted-foreground">
              {line.slice(2)}
            </li>
          )
        }
        if (line.includes('**') && line.split('**').length === 3) {
          const parts = line.split('**')
          return (
            <p key={index} className="text-sm mb-2">
              {parts[0]}
              <strong>{parts[1]}</strong>
              {parts[2]}
            </p>
          )
        }
        if (line.trim() === '') {
          return <br key={index} />
        }
        return <p key={index} className="text-sm mb-2">{line}</p>
      })
  }

  return (
    <ScrollArea className="h-full">
      <div className="prose prose-sm max-w-none">
        {renderContent(content)}
      </div>
    </ScrollArea>
  )
}