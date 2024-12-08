import { useState } from 'react'
import {
  AlertCircle,
  Archive,
  ArchiveX,
  Bookmark,
  Calendar,
  ChevronRight,
  Clock,
  Cloud,
  Code,
  Database,
  File,
  FileText,
  Flag,
  Folder,
  Github,
  Heart,
  Home,
  Image,
  Link,
  Mail,
  Map,
  Music,
  Package,
  Settings,
  Star
} from 'lucide-react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
const icons = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'calendar', label: 'Calendar', icon: Calendar },
  { value: 'settings', label: 'Settings', icon: Settings },
  { value: 'archive', label: 'Archive', icon: Archive },
  { value: 'bookmark', label: 'Bookmark', icon: Bookmark },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'database', label: 'Database', icon: Database },
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'file', label: 'File', icon: File },
  { value: 'heart', label: 'Heart', icon: Heart }
]

export function IconSelect () {
  const [open, setOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string>('')

  // Find the selected icon component
  const SelectedIcon = icons.find(i => i.value === selectedIcon)?.icon

  return (
    <div className='flex items-center gap-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-[200px] justify-between'
          >
            <div className='flex items-center gap-2'>
              {SelectedIcon && <SelectedIcon className='h-4 w-4' />}
              {selectedIcon
                ? icons.find(icon => icon.value === selectedIcon)?.label
                : 'Select icon...'}
            </div>
            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandInput placeholder='Search icons...' />
            <CommandList>
              <CommandEmpty>No icon found.</CommandEmpty>
              <CommandGroup>
                {icons.map(icon => (
                  <CommandItem
                    key={icon.value}
                    value={icon.value}
                    onSelect={currentValue => {
                      setSelectedIcon(
                        currentValue === selectedIcon ? '' : currentValue
                      )
                      setOpen(false)
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <icon.icon className='h-4 w-4' />
                      {icon.label}
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedIcon === icon.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
