import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RefreshCw } from 'lucide-react'
import { Widget } from '@/types/dashboard'
import { dataService, TableRow } from '@/services/dataService'

interface TableWidgetProps {
  widget: Widget
}

// Sample table data
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', revenue: '$1,234' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', revenue: '$2,456' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', revenue: '$3,789' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Pending', revenue: '$987' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Active', revenue: '$5,432' },
]

export function TableWidget({ widget }: TableWidgetProps) {
  const [data, setData] = useState<TableRow[]>(widget.data || sampleData)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Subscribe to real-time data updates
    const handleDataUpdate = (newData: TableRow[]) => {
      setIsUpdating(true)
      setTimeout(() => {
        setData(newData)
        setIsUpdating(false)
      }, 400) // Small delay for visual feedback
    }

    dataService.subscribe(widget.id, handleDataUpdate)

    // Get initial data
    const initialData = dataService.getInitialData('table', widget.id)
    if (initialData) {
      setData(initialData)
    }

    return () => {
      dataService.unsubscribe(widget.id)
    }
  }, [widget.id])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-50'
      case 'inactive':
        return 'text-red-600 bg-red-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="h-full relative">
      {isUpdating && (
        <div className="absolute top-2 right-2 z-10">
          <RefreshCw className="h-3 w-3 animate-spin text-primary" />
        </div>
      )}
      <ScrollArea className={`h-full transition-all duration-400 ${isUpdating ? 'opacity-70' : ''}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Email</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row: any) => (
              <TableRow key={row.id}>
                <TableCell className="text-xs font-medium">{row.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{row.email}</TableCell>
                <TableCell className="text-xs">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-right font-medium">{row.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}