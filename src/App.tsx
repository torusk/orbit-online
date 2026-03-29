import Header from './components/Header'
import MintForm from './components/MintForm'

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-6 py-16 sm:py-24">
        <div className="w-full max-w-lg">
          <MintForm />
        </div>
      </main>
    </div>
  )
}
