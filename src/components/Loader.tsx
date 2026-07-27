// Loader.tsx
export default function Loader({ minDisplayTime = 2500 }: { minDisplayTime?: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
    </div>
  )
}