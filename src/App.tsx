import Header from './components/Header'
import MintForm from './components/MintForm'

export default function App() {
  return (
    <div className="min-h-screen bg-white sm:bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md sm:bg-white sm:border sm:border-gray-200 sm:rounded-2xl sm:shadow-sm sm:p-8">
          <MintForm />
        </div>
      </main>
    </div>
  )
}
