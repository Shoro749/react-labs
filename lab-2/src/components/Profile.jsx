import Avatar from './Avatar'

export default function Profile({ person }) {
  return (
    <article className="profile">
      <Avatar person={person} size={120} />
      <h2>{person.name}</h2>
      <p>{person.role}</p>
    </article>
  )
}
