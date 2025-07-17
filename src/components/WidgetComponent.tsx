import { useState, useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, X, Settings, Calendar, Move } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Widget } from '@/types/dashboard'
import { ChartWidget } from './widgets/ChartWidget'
import { MetricWidget } from './widgets/MetricWidget'
import { TableWidget } from './widgets/TableWidget'
import { TextWidget } from './widgets/TextWidget'

interface WidgetComponentProps {
  widget: Widget
  onUpdate: (widgetId: string, updates: Partial<Widget>) => void
  onDelete: (widgetId: string) => void
  isEditing: boolean
}

export function WidgetComponent({ widget, onUpdate, onDelete, isEditing }: WidgetComponentProps) {
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: widget.id,
    disabled: !isEditing || isResizing,
  })

  const style = {
    position: 'absolute' as const,
    left: widget.position.x,
    top: widget.position.y,
    width: widget.position.width,
    height: widget.position.height,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 1000 : 1,
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = widget.position.width
    const startHeight = widget.position.height

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      
      const newWidth = Math.max(200, startWidth + deltaX)
      const newHeight = Math.max(120, startHeight + deltaY)
      
      onUpdate(widget.id, {
        position: {
          ...widget.position,
          width: newWidth,
          height: newHeight
        }
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'chart':
        return <ChartWidget widget={widget} />
      case 'metric':
        return <MetricWidget widget={widget} />
      case 'table':
        return <TableWidget widget={widget} />
      case 'text':
        return <TextWidget widget={widget} />
      default:
        return <div className="p-4 text-center text-muted-foreground">Unknown widget type</div>
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={`group ${isDragging ? 'opacity-50' : ''} ${isResizing ? 'select-none' : ''}`}>
      <Card className={`h-full ${isEditing ? 'ring-2 ring-primary/20' : ''} ${isDragging ? 'shadow-lg' : ''} relative`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {isEditing && (
                  <Move 
                    className="h-3 w-3 text-muted-foreground cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                    {...attributes}
                    {...listeners}
                  />
                )}
                <CardTitle className="text-sm font-medium">
                  {widget.title}
                </CardTitle>
              </div>
              {widget.dateRange && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  Custom Range
                </Badge>
              )}
            </div>
            
            {isEditing && (
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsConfiguring(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(widget.id)}
                      className="text-destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 h-[calc(100%-60px)]">
          {renderWidgetContent()}
        </CardContent>

        {/* Resize Handle */}
        {isEditing && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={handleResizeStart}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary/60 rounded-sm" />
            <div className="absolute bottom-0.5 right-2 w-1 h-1 bg-primary/40 rounded-sm" />
            <div className="absolute bottom-2 right-0.5 w-1 h-1 bg-primary/40 rounded-sm" />
          </div>
        )}
      </Card>
    </div>
  )
}