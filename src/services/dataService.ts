// Mock data service for generating real-time dashboard data
export interface MetricData {
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  label: string
  period: string
}

export interface ChartDataPoint {
  name: string
  value: number
  revenue?: number
}

export interface TableRow {
  id: number
  name: string
  email: string
  status: string
  revenue: string
}

class DataService {
  private intervalId: number | null = null
  private subscribers: Map<string, (data: any) => void> = new Map()

  // Generate random metric data
  generateMetricData(baseValue: number = 1000): MetricData {
    const variation = (Math.random() - 0.5) * 0.3 // ±15% variation
    const value = Math.round(baseValue * (1 + variation))
    const change = Math.round((variation * 100) * 10) / 10
    
    return {
      value: value > 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`,
      change: `${change > 0 ? '+' : ''}${change}%`,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      label: 'Real-time Value',
      period: 'vs last update'
    }
  }

  // Generate random chart data
  generateChartData(): ChartDataPoint[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => ({
      name: month,
      value: Math.round(200 + Math.random() * 300),
      revenue: Math.round(2000 + Math.random() * 8000)
    }))
  }

  // Generate random table data
  generateTableData(): TableRow[] {
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson']
    const statuses = ['Active', 'Inactive', 'Pending']
    
    return names.map((name, index) => ({
      id: index + 1,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      revenue: `$${Math.round(1000 + Math.random() * 5000)}`
    }))
  }

  // Subscribe to real-time data updates
  subscribe(widgetId: string, callback: (data: any) => void) {
    this.subscribers.set(widgetId, callback)
    
    // Start the interval if this is the first subscriber
    if (this.subscribers.size === 1) {
      this.startDataRefresh()
    }
  }

  // Unsubscribe from data updates
  unsubscribe(widgetId: string) {
    this.subscribers.delete(widgetId)
    
    // Stop the interval if no more subscribers
    if (this.subscribers.size === 0) {
      this.stopDataRefresh()
    }
  }

  // Start the data refresh interval
  private startDataRefresh() {
    this.intervalId = window.setInterval(() => {
      this.subscribers.forEach((callback, widgetId) => {
        // Generate different data based on widget type
        if (widgetId.includes('metric')) {
          callback(this.generateMetricData())
        } else if (widgetId.includes('chart')) {
          callback(this.generateChartData())
        } else if (widgetId.includes('table')) {
          callback(this.generateTableData())
        }
      })
    }, 5000) // Update every 5 seconds
  }

  // Stop the data refresh interval
  private stopDataRefresh() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  // Get initial data for a widget
  getInitialData(widgetType: string, widgetId: string): any {
    switch (widgetType) {
      case 'metric':
        return this.generateMetricData()
      case 'chart':
        return this.generateChartData()
      case 'table':
        return this.generateTableData()
      default:
        return null
    }
  }
}

export const dataService = new DataService()