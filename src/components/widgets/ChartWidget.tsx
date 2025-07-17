import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { RefreshCw } from 'lucide-react'
import { Widget } from '@/types/dashboard'
import { dataService, ChartDataPoint } from '@/services/dataService'

interface ChartWidgetProps {
  widget: Widget
}

// Sample data for demonstration
const sampleData = [
  { name: 'Jan', value: 400, revenue: 2400 },
  { name: 'Feb', value: 300, revenue: 1398 },
  { name: 'Mar', value: 200, revenue: 9800 },
  { name: 'Apr', value: 278, revenue: 3908 },
  { name: 'May', value: 189, revenue: 4800 },
  { name: 'Jun', value: 239, revenue: 3800 },
]

const pieData = [
  { name: 'Desktop', value: 45, color: '#2563EB' },
  { name: 'Mobile', value: 35, color: '#F59E0B' },
  { name: 'Tablet', value: 20, color: '#10B981' },
]

export function ChartWidget({ widget }: ChartWidgetProps) {
  const [data, setData] = useState<ChartDataPoint[]>(sampleData)
  const [isUpdating, setIsUpdating] = useState(false)
  const subtype = widget.config?.subtype || 'line'

  useEffect(() => {
    // Subscribe to real-time data updates
    const handleDataUpdate = (newData: ChartDataPoint[]) => {
      setIsUpdating(true)
      setTimeout(() => {
        setData(newData)
        setIsUpdating(false)
      }, 300) // Small delay for visual feedback
    }

    dataService.subscribe(widget.id, handleDataUpdate)

    // Get initial data
    const initialData = dataService.getInitialData('chart', widget.id)
    if (initialData) {
      setData(initialData)
    }

    return () => {
      dataService.unsubscribe(widget.id)
    }
  }, [widget.id])

  const renderChart = () => {
    switch (subtype) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Chart type not supported
          </div>
        )
    }
  }

  return (
    <div className="h-full relative">
      {isUpdating && (
        <div className="absolute top-2 right-2 z-10">
          <RefreshCw className="h-3 w-3 animate-spin text-primary" />
        </div>
      )}
      <div className={`h-full transition-all duration-300 ${isUpdating ? 'opacity-70' : ''}`}>
        {renderChart()}
      </div>
    </div>
  )
}