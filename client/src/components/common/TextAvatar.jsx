import { Avatar } from "@mui/material"

const TextAvatar = ({ text, src }) => {
  const stringToColor = (str) => {
    let hash = 0
    let i

    for (i = 0; i < str.length; i += 1) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = "#"

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }

    return color
  }

  return (
    <Avatar
      key={src || 'default'} // Force re-render when src changes
      src={src}
      sx={{
        backgroundColor: stringToColor(text),
        width: { xs: 28, sm: 40 },
        height: { xs: 28, sm: 40 },
        fontSize: { xs: "0.875rem", sm: "1rem" }
      }}
      imgProps={{
        onError: (e) => {
          // Hide broken image and show fallback text
          e.target.style.display = 'none'
        }
      }}
      children={`${text.toUpperCase().split(" ")[0][0]}`}
    />
  )
}

export default TextAvatar