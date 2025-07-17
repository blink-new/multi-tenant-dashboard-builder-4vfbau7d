import { useState } from 'react'
import { Plus, Save, Settings, Star, StarOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dashboard } from '@/types/dashboard'

interface DashboardManagerProps {
  dashboards: Dashboard[]
  currentDashboard: Dashboard | null
  onDashboardSelect: (dashboard: Dashboard) => void
  onDashboardSave: (name: string) => void
  onDashboardCreate: () => void
  onSetDefault: (dashboardId: string) => void
}

export function DashboardManager({
  dashboards,
  currentDashboard,
  onDashboardSelect,
  onDashboardSave,
  onDashboardCreate,
  onSetDefault
}: DashboardManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newDashboardName, setNewDashboardName] = useState('')
  const [isSaveOpen, setIsSaveOpen] = useState(false)
  const [saveName, setSaveName] = useState(currentDashboard?.name || '')

  const handleCreate = () => {
    if (newDashboardName.trim()) {
      onDashboardCreate()
      setNewDashboardName('')
      setIsCreateOpen(false)
    }
  }

  const handleSave = () => {
    if (saveName.trim()) {
      onDashboardSave(saveName)
      setIsSaveOpen(false)
    }
  }

  const defaultDashboard = dashboards.find(d => d.isDefault)

  return (
    <div className="flex items-center space-x-2">
      {/* Dashboard Selector */}
      <Select
        value={currentDashboard?.id || ''}
        onValueChange={(value) => {
          const dashboard = dashboards.find(d => d.id === value)
          if (dashboard) onDashboardSelect(dashboard)
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select dashboard" />
        </SelectTrigger>
        <SelectContent>
          {dashboards.map((dashboard) => (
            <SelectItem key={dashboard.id} value={dashboard.id}>
              <div className="flex items-center space-x-2">
                <span>{dashboard.name}</span>
                {dashboard.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Save Current Dashboard */}
      <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Dashboard Name</label>
              <Input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Enter dashboard name"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSaveOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Dashboard</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create New Dashboard */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Dashboard Name</label>
              <Input
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                placeholder="Enter dashboard name"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Dashboard</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set as Default */}
      {currentDashboard && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSetDefault(currentDashboard.id)}
          className="text-muted-foreground hover:text-foreground"
        >
          {currentDashboard.isDefault ? (
            <Star className="h-4 w-4 fill-current text-yellow-500" />
          ) : (
            <StarOff className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Dashboard Info */}
      {defaultDashboard && (
        <div className="text-xs text-muted-foreground">
          Default: {defaultDashboard.name}
        </div>
      )}
    </div>
  )
}