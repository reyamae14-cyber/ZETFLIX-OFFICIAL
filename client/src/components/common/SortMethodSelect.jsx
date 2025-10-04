import { Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material"

const sortMethods = [
  "Original Title Asc",
  "Original Title Desc",
  "Popularity Asc",
  "Popularity Desc",
  "Revenue Asc",
  "Revenue Desc",
  "Release Date Asc",
  "Release Date Desc",
  "Title Asc",
  "Title Desc",
  "Vote Count Asc",
  "Vote Count Desc",
]

const SortMethodSelect = ({ sortMethod, setSortMethod }) => {
  const handleChange = (event) => {
    setSortMethod(event.target.value)
  }

  return (
    <FormControl sx={{ width: { xs: "46%", sm: "40%", md: "23%", lg: "20%" } }}>
      <InputLabel id="select-sort-method-label">Select sort method</InputLabel>
      <Select
        labelId="select-sort-method-label"
        id="select-sort-methods"
        value={sortMethod}
        onChange={handleChange}
        input={<OutlinedInput id="select-single-chip" label="Select-sort-method" />}
        renderValue={(selected) => (
          <Chip key={selected} label={sortMethods[selected]} />
        )}
      >
        {
          sortMethods.map((method, index) => (
            <MenuItem key={index} value={index}>
              {method}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )
}

export default SortMethodSelect
