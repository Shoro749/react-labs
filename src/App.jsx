import ProfileCard from './components/ProfileCard'
import './index.css'

function App() {
  return (
    <ProfileCard
      name="Ващенко Роман"
      group="КН-311"
      technologies={['React', 'JavaScript', 'Node.js']}
    />
  )
}

export default App
