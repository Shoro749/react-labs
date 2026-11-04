import { useState } from 'react'

function ProfileCard({ name, group, technologies }) {
  const [likes, setLikes] = useState(0)

  return (
    <article className="profile-card">
      <h1>Про мене</h1>
      <p>
        <strong>Ім’я:</strong> {name}
      </p>
      <p>
        <strong>Група:</strong> {group}
      </p>
      <h2>Технології, які я хочу опанувати</h2>
      <ul>
        {technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <button type="button" onClick={() => setLikes((count) => count + 1)}>
        Подобається: {likes}
      </button>
    </article>
  )
}

export default ProfileCard
