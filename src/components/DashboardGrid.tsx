import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { Widget } from '@/types/dashboard'
import { WidgetComponent } from './WidgetComponent'

interface DashboardGridProps {
  widgets: Widget[]
  onWidgetUpdate: (widgetId: string, updates: Partial<Widget>) => void
  onWidgetDelete: (widgetId: string) => void
  isEditing: boolean
}

export function DashboardGrid({ widgets, onWidgetUpdate, onWidgetDelete, isEditing }: DashboardGridProps) {
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const widget = widgets.find(w => w.id === event.active.id)
    setActiveWidget(widget || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    
    if (delta.x !== 0 || delta.y !== 0) {
      const widget = widgets.find(w => w.id === active.id)
      if (widget) {
        const gridSize = 20 // 20px grid
        const newX = Math.max(0, Math.round((widget.position.x + delta.x) / gridSize) * gridSize)
        const newY = Math.max(0, Math.round((widget.position.y + delta.y) / gridSize) * gridSize)
        
        onWidgetUpdate(widget.id, {
          position: {
            ...widget.position,
            x: newX,
            y: newY
          }
        })
      }
    }
    
    setActiveWidget(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative w-full h-full bg-background/50 rounded-lg border-2 border-dashed border-border/50 overflow-hidden">
        <div 
          className="relative w-full h-full"
          style={{
            backgroundImage: isEditing ? 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)' : 'none',
            backgroundSize: isEditing ? '20px 20px' : 'auto'
          }}
        >
          {widgets.map((widget) => (
            <WidgetComponent
              key={widget.id}
              widget={widget}
              onUpdate={onWidgetUpdate}
              onDelete={onWidgetDelete}
              isEditing={isEditing}
            />
          ))}
        </div>
      </div>
      
      <DragOverlay>
        {activeWidget ? (
          <div className="opacity-50">
            <WidgetComponent
              widget={activeWidget}
              onUpdate={() => {}}
              onDelete={() => {}}
              isEditing={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}