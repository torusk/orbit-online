import Header from './components/Header'
import MintForm from './components/MintForm'

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <MintForm />
      </main>
    </div>
  )
}
