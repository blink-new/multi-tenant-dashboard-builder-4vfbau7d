import { useState, useEffect, useCallback } from 'react'
import { Edit3, Eye, RefreshCw, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DateRangeSelector } from '@/components/DateRangeSelector'
import { WidgetLibrary } from '@/components/WidgetLibrary'
import { DashboardGrid } from '@/components/DashboardGrid'
import { DashboardManager } from '@/components/DashboardManager'
import { blink } from '@/blink/client'
import { Dashboard, Widget, DateRange, Tenant } from '@/types/dashboard'
import { subDays, startOfDay, endOfDay } from 'date-fns'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [globalDateRange, setGlobalDateRange] = useState<DateRange>({
    from: startOfDay(subDays(new Date(), 7)),
    to: endOfDay(new Date()),
    preset: 'last_7d'
  })

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Load tenant and dashboards when user is authenticated
  useEffect(() => {
    if (user) {
      loadTenantAndDashboards()
    }
  }, [user, loadTenantAndDashboards])

  const loadTenantAndDashboards = useCallback(async () => {
    try {
      // Create or get tenant for user
      const tenant: Tenant = {
        id: `tenant_${user.id}`,
        name: user.email?.split('@')[0] || 'My Organization',
        userId: user.id
      }
      setCurrentTenant(tenant)

      // Load dashboards from localStorage first, then create default if none exist
      const storageKey = `dashboards_${user.id}`
      const savedDashboards = localStorage.getItem(storageKey)
      
      let loadedDashboards: Dashboard[] = []
      
      if (savedDashboards) {
        loadedDashboards = JSON.parse(savedDashboards)
      } else {
        // Create default dashboard with sample data
        loadedDashboards = [
          {
            id: 'dashboard_1',
            name: 'Sales Overview',
            userId: user.id,
            tenantId: tenant.id,
            isDefault: true,
            widgets: [
              {
                id: 'widget_1',
                type: 'metric',
                title: 'Total Revenue',
                position: { x: 20, y: 20, width: 280, height: 160 },
                config: { subtype: 'single' },
                data: {
                  value: '$45,231',
                  change: '+12.5%',
                  trend: 'up',
                  label: 'Total Revenue',
                  period: 'vs last month'
                }
              },
              {
                id: 'widget_2',
                type: 'chart',
                title: 'Monthly Sales',
                position: { x: 320, y: 20, width: 400, height: 300 },
                config: { subtype: 'line' }
              },
              {
                id: 'widget_3',
                type: 'metric',
                title: 'New Customers',
                position: { x: 20, y: 200, width: 280, height: 160 },
                config: { subtype: 'single' },
                data: {
                  value: '1,234',
                  change: '+8.2%',
                  trend: 'up',
                  label: 'New Customers',
                  period: 'this month'
                }
              },
              {
                id: 'widget_4',
                type: 'table',
                title: 'Recent Orders',
                position: { x: 740, y: 20, width: 360, height: 300 },
                config: { subtype: 'data' }
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        
        // Save default dashboard to localStorage
        localStorage.setItem(storageKey, JSON.stringify(loadedDashboards))
      }

      setDashboards(loadedDashboards)
      const defaultDashboard = loadedDashboards.find(d => d.isDefault) || loadedDashboards[0]
      setCurrentDashboard(defaultDashboard)
    } catch (error) {
      console.error('Failed to load tenant and dashboards:', error)
    }
  }, [user])

  const handleWidgetAdd = (type: string, subtype: string) => {
    if (!currentDashboard || !user) return

    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      type: type as any,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position: {
        x: 20,
        y: 20,
        width: type === 'metric' ? 280 : 400,
        height: type === 'metric' ? 160 : 300
      },
      config: { subtype }
    }

    const updatedDashboard = {
      ...currentDashboard,
      widgets: [...currentDashboard.widgets, newWidget],
      updatedAt: new Date().toISOString()
    }

    setCurrentDashboard(updatedDashboard)
    const newDashboards = dashboards.map(d => d.id === updatedDashboard.id ? updatedDashboard : d)
    setDashboards(newDashboards)
    
    // Save to localStorage
    const storageKey = `dashboards_${user.id}`
    localStorage.setItem(storageKey, JSON.stringify(newDashboards))
  }

  const handleWidgetUpdate = (widgetId: string, updates: Partial<Widget>) => {
    if (!currentDashboard || !user) return

    const updatedDashboard = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.map(w => 
        w.id === widgetId ? { ...w, ...updates } : w
      ),
      updatedAt: new Date().toISOString()
    }

    setCurrentDashboard(updatedDashboard)
    const newDashboards = dashboards.map(d => d.id === updatedDashboard.id ? updatedDashboard : d)
    setDashboards(newDashboards)
    
    // Save to localStorage
    const storageKey = `dashboards_${user.id}`
    localStorage.setItem(storageKey, JSON.stringify(newDashboards))
  }

  const handleWidgetDelete = (widgetId: string) => {
    if (!currentDashboard || !user) return

    const updatedDashboard = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.filter(w => w.id !== widgetId),
      updatedAt: new Date().toISOString()
    }

    setCurrentDashboard(updatedDashboard)
    const newDashboards = dashboards.map(d => d.id === updatedDashboard.id ? updatedDashboard : d)
    setDashboards(newDashboards)
    
    // Save to localStorage
    const storageKey = `dashboards_${user.id}`
    localStorage.setItem(storageKey, JSON.stringify(newDashboards))
  }

  const handleDashboardSave = (name: string) => {
    if (!currentDashboard || !user) return

    const updatedDashboard = {
      ...currentDashboard,
      name,
      updatedAt: new Date().toISOString()
    }

    setCurrentDashboard(updatedDashboard)
    const newDashboards = dashboards.map(d => d.id === updatedDashboard.id ? updatedDashboard : d)
    setDashboards(newDashboards)
    
    // Save to localStorage
    const storageKey = `dashboards_${user.id}`
    localStorage.setItem(storageKey, JSON.stringify(newDashboards))
  }

  const handleDashboardCreate = () => {
    if (!user || !currentTenant) return

    const newDashboard: Dashboard = {
      id: `dashboard_${Date.now()}`,
      name: 'New Dashboard',
      userId: user.id,
      tenantId: currentTenant.id,
      widgets: [],
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const newDashboards = [...dashboards, newDashboard]
    setDashboards(newDashboards)
    setCurrentDashboard(newDashboard)
    setIsEditing(true)
    
    // Save to localStorage
    const storageKey = `dashboards_${user.id}`
    localStorage.setItem(storageKey, JSON.stringify(newDashboards))
  }

  const handleSetDefault = (dashboardId: string) => {
    if (!user) return
    
    const newDashboards = dashboards.map(d => ({
      ...d,
      isDefault: d.id === dashboardId
    }))
    
    setDashboards(newDashboards)

    if (currentDashboard?.id === dashboardId) {
      setCurrentDashboard(prev => prev ? { ...prev, isDefault: true } : null)
    }
    
    // Save to localStorage
    const storageKey = `dashboards_${user.id}`
    localStorage.setItem(storageKey, JSON.stringify(newDashboards))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span>Dashboard Builder</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Please sign in to access your multi-tenant dashboard
            </p>
            <Button onClick={() => blink.auth.login()}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Dashboard Builder</h1>
            </div>
            {currentTenant && (
              <Badge variant="outline" className="text-xs">
                {currentTenant.name}
              </Badge>
            )}
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <DateRangeSelector
              value={globalDateRange}
              onChange={setGlobalDateRange}
            />
            
            <Separator orientation="vertical" className="h-6" />
            
            <DashboardManager
              dashboards={dashboards}
              currentDashboard={currentDashboard}
              onDashboardSelect={setCurrentDashboard}
              onDashboardSave={handleDashboardSave}
              onDashboardCreate={handleDashboardCreate}
              onSetDefault={handleSetDefault}
            />

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => blink.auth.logout()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Widget Library Sidebar */}
        {isEditing && (
          <div className="w-80 border-r bg-card p-4">
            <WidgetLibrary onWidgetSelect={handleWidgetAdd} />
          </div>
        )}

        {/* Dashboard Canvas */}
        <div className="flex-1 p-6">
          {currentDashboard ? (
            <div className="h-full">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{currentDashboard.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentDashboard.widgets.length} widgets • Last updated {new Date(currentDashboard.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                {currentDashboard.isDefault && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Default Dashboard
                  </Badge>
                )}
              </div>

              <div className="h-[calc(100%-80px)]">
                <DashboardGrid
                  widgets={currentDashboard.widgets}
                  onWidgetUpdate={handleWidgetUpdate}
                  onWidgetDelete={handleWidgetDelete}
                  isEditing={isEditing}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Dashboard Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Create a new dashboard or select an existing one to get started
                </p>
                <Button onClick={handleDashboardCreate}>
                  Create Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App