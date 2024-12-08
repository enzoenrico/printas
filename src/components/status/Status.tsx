import { Card, CardHeader } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { CheckCheck, RssIcon, ServerCrash, ZapOffIcon } from 'lucide-react'
import { Loading } from '../loading/Loading'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { useEffect } from 'react'
import { OctoPIConn, PrinterState } from '../../api'

import { useState } from 'react'
import { Badge } from '../ui/badge'

export const Status = ({ props }: { props: OctoPIConn }) => {
  const [serverStatus, setServerStatus] = useState<bool>(false)
  const [printerState, setPrinterState] = useState<PrinterState | null>(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Log initial call
        console.log('Checking printer status...')

        // Get and log raw response
        const state = await props.getPrinterState()
        console.log('Raw printer state:', state)

        if (!state) {
          console.warn('Received undefined state from getPrinterState')
          setPrinterState(null)
          setServerStatus(false)
          return
        }

        setPrinterState(state)
        setServerStatus(true)
        console.log('Updated printer state:', state)
      } catch (error) {
        console.error('Printer state error:', error)
        setServerStatus(false)
        setPrinterState(null)
      }
    }

    console.log('Setting up interval...')
    const interval = setInterval(checkStatus, 10000)
    checkStatus() // Initial check

    return () => clearInterval(interval)
  }, [props])

  return (
    <div className='flex flex-col gap-2 w-full'>
      {/* Top card with the printing information */}
      <Card className='h-20 flex items-center w-full'>
        <CardHeader className='flex flex-row items-center justify-between gap-4 w-full'>
          <Alert variant={'default'} className='cursor-pointer max-w-min '>
            <AlertDescription className='text-xl flex gap-4'>
              <HoverCard>
                <HoverCardTrigger className='text-xl flex gap-4'>
                  {serverStatus ? (
                    <CheckCheck className='text-green-500' />
                  ) : (
                    <ServerCrash className='text-red-500' />
                  )}
                </HoverCardTrigger>
                <HoverCardContent className='text-sm'>
                  {serverStatus ? 'Server is ok!' : 'Server is down!!'}
                </HoverCardContent>
              </HoverCard>
            </AlertDescription>
          </Alert>
          <Alert variant={'default'} className='cursor-pointer max-w-min !mt-0'>
            <AlertDescription className='text-xl flex gap-4'>
              <HoverCard>
                <HoverCardTrigger className='text-xl flex gap-4'>
                  {serverStatus ? (
                    <RssIcon className='text-green-500' />
                  ) : (
                    <ZapOffIcon className='text-red-500' />
                  )}
                  <Loading />
                </HoverCardTrigger>
                <HoverCardContent className='text-sm'>
                  Connectivity: 3ms
                </HoverCardContent>
              </HoverCard>
            </AlertDescription>
          </Alert>

          {/* printer ETA */}
          <Alert
            id='printer-active-stats'
            className='!mt-0'
            variant={'default'}
          >
            <AlertDescription>
              ETA: {printerState?.print_eta} seconds
            </AlertDescription>
          </Alert>

          {/* printer TEMPS */}
          <Alert
            id='printer-active-stats'
            className='!mt-0'
            variant={'default'}
          >
            {/* fix this height */}
            <AlertDescription className='max-h-min'>
              <div className='flex flex-col'>
                <p className='text-sm'> Bed: {printerState?.bed_temperature}</p>
                <p className='text-sm'>
                  {' '}
                  Tool: {printerState?.tool_temperature}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* printer model being printed */}
          <Badge className='w-4/6 h-11' variant={'secondary'}>
            Printing: {printerState?.print_name}
          </Badge>
        </CardHeader>
      </Card>
    </div>
  )
}
