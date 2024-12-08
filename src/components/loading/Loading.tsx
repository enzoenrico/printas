export const Loading = () => {
  return (
    <div className='flex gap-2 items-center'>
      <div className='w-1 h-3 rounded-full bg-white animate-pulse' />
      <div className='w-1 h-3 rounded-full bg-white animate-pulse [animation-delay:200ms]' />
      <div className='w-1 h-3 rounded-full bg-white animate-pulse [animation-delay:400ms]' />
    </div>
  )
}
