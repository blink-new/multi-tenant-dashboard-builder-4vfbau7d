import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRange } from '@/types/dashboard'
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns'

interface DateRangeSelectorProps {
  value: DateRange
  onChange: (dateRange: DateRange) => void
}

const presets = [
  { label: 'Last 7 days', value: 'last_7d', days: 7 },
  { label: 'Last 14 days', value: 'last_14d', days: 14 },
  { label: 'Last 30 days', value: 'last_30d', days: 30 },
  { label: 'Last 90 days', value: 'last_90d', days: 90 },
  { label: 'Custom', value: 'custom', days: 0 },
]

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(value.preset || 'last_7d')

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)
    
    if (preset === 'custom') {
      return
    }

    const presetConfig = presets.find(p => p.value === preset)
    if (presetConfig) {
      const newDateRange: DateRange = {
        from: startOfDay(subDays(new Date(), presetConfig.days)),
        to: endOfDay(new Date()),
        preset
      }
      onChange(newDateRange)
    }
  }

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      onChange({
        from: startOfDay(range.from),
        to: endOfDay(range.to),
        preset: 'custom'
      })
      setSelectedPreset('custom')
      setIsOpen(false)
    }
  }

  const formatDateRange = () => {
    if (selectedPreset !== 'custom') {
      const preset = presets.find(p => p.value === selectedPreset)
      return preset?.label || 'Select range'
    }
    
    return `${format(value.from, 'MMM d')} - ${format(value.to, 'MMM d, yyyy')}`
  }

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      
      <Select value={selectedPreset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedPreset === 'custom' && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
              {formatDateRange()}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={value.from}
              selected={{ from: value.from, to: value.to }}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}

      {selectedPreset !== 'custom' && (
        <span className="text-sm text-muted-foreground">
          {formatDateRange()}
        </span>
      )}
    </div>
  )
}