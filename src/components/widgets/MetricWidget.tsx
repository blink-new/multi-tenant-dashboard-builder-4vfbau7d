import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { Widget } from '@/types/dashboard'
import { dataService, MetricData } from '@/services/dataService'

interface MetricWidgetProps {
  widget: Widget
}

// Sample metric data
const sampleMetrics = {
  value: '12,345',
  change: '+12.5%',
  trend: 'up' as const,
  label: 'Total Revenue',
  period: 'vs last month'
}

export function MetricWidget({ widget }: MetricWidgetProps) {
  const [metric, setMetric] = useState<MetricData>(widget.data || sampleMetrics)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Subscribe to real-time data updates
    const handleDataUpdate = (newData: MetricData) => {
      setIsUpdating(true)
      setTimeout(() => {
        setMetric(newData)
        setIsUpdating(false)
      }, 200) // Small delay for visual feedback
    }

    dataService.subscribe(widget.id, handleDataUpdate)

    // Get initial data if not provided
    if (!widget.data) {
      const initialData = dataService.getInitialData('metric', widget.id)
      if (initialData) {
        setMetric(initialData)
      }
    }

    return () => {
      dataService.unsubscribe(widget.id)
    }
  }, [widget.id, widget.data])

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="h-full flex flex-col justify-center space-y-2 relative">
      {isUpdating && (
        <div className="absolute top-2 right-2">
          <RefreshCw className="h-3 w-3 animate-spin text-primary" />
        </div>
      )}
      
      <div className={`text-2xl font-bold text-foreground transition-all duration-200 ${isUpdating ? 'scale-105' : ''}`}>
        {metric.value}
      </div>
      
      <div className="flex items-center space-x-2">
        {getTrendIcon()}
        <span className={`text-sm font-medium ${getTrendColor()}`}>
          {metric.change}
        </span>
        <span className="text-sm text-muted-foreground">
          {metric.period}
        </span>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {metric.label}
      </div>
    </div>
  )
}