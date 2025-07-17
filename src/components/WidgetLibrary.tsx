import { BarChart3, LineChart, PieChart, Hash, FileText, Table } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface WidgetLibraryProps {
  onWidgetSelect: (type: string, subtype: string) => void
}

const widgetCategories = [
  {
    title: 'Charts',
    widgets: [
      {
        type: 'chart',
        subtype: 'line',
        name: 'Line Chart',
        description: 'Show trends over time',
        icon: LineChart,
        color: 'bg-blue-50 text-blue-600'
      },
      {
        type: 'chart',
        subtype: 'bar',
        name: 'Bar Chart',
        description: 'Compare values across categories',
        icon: BarChart3,
        color: 'bg-green-50 text-green-600'
      },
      {
        type: 'chart',
        subtype: 'pie',
        name: 'Pie Chart',
        description: 'Show proportions and percentages',
        icon: PieChart,
        color: 'bg-purple-50 text-purple-600'
      }
    ]
  },
  {
    title: 'Metrics',
    widgets: [
      {
        type: 'metric',
        subtype: 'single',
        name: 'Single Metric',
        description: 'Display key performance indicators',
        icon: Hash,
        color: 'bg-orange-50 text-orange-600'
      }
    ]
  },
  {
    title: 'Data',
    widgets: [
      {
        type: 'table',
        subtype: 'data',
        name: 'Data Table',
        description: 'Display structured data in rows',
        icon: Table,
        color: 'bg-indigo-50 text-indigo-600'
      }
    ]
  },
  {
    title: 'Content',
    widgets: [
      {
        type: 'text',
        subtype: 'markdown',
        name: 'Text Widget',
        description: 'Add notes, documentation, or content',
        icon: FileText,
        color: 'bg-gray-50 text-gray-600'
      }
    ]
  }
]

export function WidgetLibrary({ onWidgetSelect }: WidgetLibraryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Widget Library</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop widgets to build your dashboard
        </p>
      </div>

      {widgetCategories.map((category) => (
        <div key={category.title}>
          <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
            {category.title}
          </h4>
          
          <div className="space-y-2">
            {category.widgets.map((widget) => {
              const IconComponent = widget.icon
              
              return (
                <Card 
                  key={`${widget.type}-${widget.subtype}`}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onWidgetSelect(widget.type, widget.subtype)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${widget.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-foreground">
                          {widget.name}
                        </h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {widget.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Tip:</strong> Click to add widgets to your dashboard</p>
          <p>🎯 Each widget can have its own date range</p>
          <p>⚡ Real-time data updates automatically</p>
        </div>
      </div>
    </div>
  )
}