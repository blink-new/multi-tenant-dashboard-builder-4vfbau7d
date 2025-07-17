export interface DateRange {
  from: Date
  to: Date
  preset?: string
}

export interface Position {
  x: number
  y: number
  width: number
  height: number
}

export interface WidgetConfig {
  subtype?: string
  [key: string]: any
}

export interface Widget {
  id: string
  type: 'chart' | 'metric' | 'table' | 'text'
  title: string
  position: Position
  config: WidgetConfig
  data?: any
  dateRange?: DateRange
}

export interface Dashboard {
  id: string
  name: string
  userId: string
  tenantId: string
  widgets: Widget[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: string
  name: string
  userId: string
}