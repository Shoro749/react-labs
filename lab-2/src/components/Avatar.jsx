export default function Avatar({ person, size = 64 }) {
  return (
      <img
          src={person.photo}
          width={size}
          height={size}
          className="avatar" />
  )
}
