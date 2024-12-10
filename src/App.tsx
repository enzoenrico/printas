import { useEffect, useState, useRef } from 'react'

import { TabsContent } from '@radix-ui/react-tabs'
import { Tabs } from './components/ui/tabs'
import { Card, CardContent, CardHeader } from './components/ui/card'
import Preview from './components/preview/Preview'

import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Button } from './components/ui/button'

import { OctoPIConn } from './api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from './components/ui/alert-dialog'
import { Status } from './components/status/Status'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger
} from './components/ui/accordion'
import { AccordionItem } from '@radix-ui/react-accordion'
import { Group } from 'three'
import { exportModel } from './lib/utils'

function App () {
  const [userInput, setUserInput] = useState<string | null>(null)
  const [modelText, setModelText] = useState<string>('')

  const [peopleInput, setPeopleInput] = useState<string>('')
  const [areaInput, setAreaInput] = useState<string>('')
  const [people, setPeople] = useState<string[]>([])

  const customGroupRef = useRef<Group>(null)

  const connection = new OctoPIConn(
    'kStmkMm2alHNREUwsZPqUiiFgfgwWeDb8FVeMcSRHxQ'
  )

  const handleModelText = () => {
    if (userInput != '') {
      setModelText(userInput)
      return
    }
  }

  const handlePeopleText = () => {
    // add limit to only 2 / 4 names (depends on size)
    if (peopleInput != '') {
      people.push(peopleInput)
      setPeople(people)
      setPeopleInput('')
      return
    }
  }

  useEffect(() => {
    window.addEventListener('keypress', e => {
      if (e.key == 'Enter') {
        handleModelText()
      }
    })
  })

  const handleConn = () => {
    connection.getFiles().then(r => {
      console.log('[+]Fetching files...')
      console.log(r)
    })
  }

  const handleDownload = async () => {
    console.log('starting download')
    if (!customGroupRef) return
    const blob = await exportModel(customGroupRef.current)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'model.glb'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* main app div */}

      <div className='bg-[#000528] w-screen h-screen flex items-center justify-around  text-white text-5xl p-5 gap-4'>
        {/* visualizer here */}
        <div className='w-1/5 h-full border-2 border-white rounded-xl '>
          <Preview
            model='trophy'
            spinZ
            grid={false}
            color='#000528'
            cam_position={[0, -15, 5]}
            // groupRef={customGroupRef}
          />
        </div>

        {/* printing details here */}
        <div div className='w-4/5 h-full pt-0'>
          <Tabs defaultValue='details' className='w-full  h-full flex flex-col'>
            <TabsContent
              value='details'
              className='p-4 border-2 border-white h-full rounded-md bg-zinc-800 
    transition-all duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=inactive]:translate-x-4
    data-[state=active]:opacity-100 data-[state=active]:translate-x-0'
            >
              {/* details on print time, material, etc */}
              <div className='h-full flex flex-col'>
                <Status props={connection} />
                <Card className='flex-1 '>
                  {/* left portion in the smaller div */}
                  <div className='flex items-center justify-between h-full w-full p-2'>
                    <div className='flex flex-col items-center  w-full h-full '>
                      <div className='w-full p-4'>
                        <Label htmlFor='custom-text'>Custom text</Label>
                        <div className='flex gap-2'>
                          <Input
                            value={userInput}
                            className='w-3/4'
                            id='custom-text'
                            onChange={e => setUserInput(e.target.value)}
                          />
                          <Button type='submit' onClick={handleModelText}>
                            Add
                          </Button>

                          <Button
                            type='submit'
                            variant={
                              modelText != '' ? 'destructive' : 'outline'
                            }
                            onClick={() => {
                              setModelText('')
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>

                      <div className='w-full p-4 flex flex-col gap-4'>
                        {/* <Label htmlFor='icon'>Icon</Label> */}
                        {/* COMBOBOX */}
                        {/* <IconSelect /> */}

                        <div className='flex flex-col gap-4'>
                          <Label htmlFor='people'> People / Area </Label>
                          <div div className='flex gap-2'>
                            <Input
                              className='w-3/4'
                              id='custom-text'
                              placeholder='Name'
                              onChange={e => setPeopleInput(e.target.value)}
                            />
                            <Input
                              className='w-3/4'
                              placeholder='Area'
                              id='custom-text'
                              onChange={e => setAreaInput(e.target.value)}
                            />
                            <Button type='submit' onClick={handlePeopleText}>
                              Add
                            </Button>

                            <Button
                              type='submit'
                              variant={
                                peopleInput != '' ? 'destructive' : 'outline'
                              }
                              onClick={() => {
                                setPeopleInput('')
                                setPeople([])
                              }}
                            >
                              Clear
                            </Button>
                          </div>

                          <Accordion collapsible type='multiple'>
                            <AccordionItem value='item-1'>
                              <AccordionTrigger className='text-xl'>
                                People involved
                              </AccordionTrigger>
                              <AccordionContent>
                                {people.map(person => (
                                  <div
                                    id='added_people'
                                    className='flex flex-col gap-2'
                                  >
                                    <div className='flex flex-col border border-white p-2 rounded-lg'>
                                      <p className='font-semibold text-2xl'>
                                        {person}
                                      </p>
                                      <p className='font-light text-gray-500 text-xl'>
                                        {areaInput}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        {/* Button Operations */}
                        <Label htmlFor='export'>Download</Label>
                        <Button type='button' onClick={handleDownload}>
                          Download model (.glb)
                        </Button>
                        <Label htmlFor='export'>Print</Label>
                        <AlertDialog>
                          <AlertDialogTrigger className='w-full'>
                            <Button type='button' className='w-full'>
                              Print the models
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will send the current customized model to
                              your plant's 3D printer, along with all the parts
                              for building the trophy
                            </AlertDialogDescription>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>
                              <Button
                                type='button'
                                onClick={handleConn}
                                className='bg-transparent hover:bg-transparent'
                              >
                                Confirm
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className='rounded-xl w-1/2 h-full '>
                      <Preview
                        model='base'
                        displayText={modelText}
                        people={people}
                        className='border'
                        groupRef={customGroupRef}
                        cam_position={[5, 3, 3]}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* </CardContent> */}
            <TabsContent
              value='printing'
              className='p-4 border-2 border-white border-t-0 h-full rounded-b-md bg-slate-100
    transition-all duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=inactive]:translate-x-4
    data-[state=active]:opacity-100 data-[state=active]:translate-x-0'
            >
              {/* actually go print it */}
              <Card>
                <CardHeader className='text-4xl'>Printing info</CardHeader>
                <CardContent>
                  <p className='text-xl'>Printing Printing</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default App
