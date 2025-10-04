import { Box, Button, Stack, MenuItem, FormControl, Select, ButtonGroup } from "@mui/material"

import tmdbConfigs from "../../api/configs/tmdb.configs"

const CategoryToggle = ({ mediaType, currCategory, onCategoryChange }) => {
  const movieCategory = ["Popular", "Top Rated", "Now Playing", "Upcoming"]
  const tvCategory = ["Popular", "Top Rated", "On the Air", "Airing Today"]

  const handleSelectChange = (event) => {
    onCategoryChange(event.target.value)
  }

  const categories = mediaType === tmdbConfigs.mediaType.movie ? movieCategory : tvCategory

  return (
    <Box>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <FormControl fullWidth>
          <Select
            variant="standard"
            id="category-select"
            value={currCategory}
            onChange={handleSelectChange}
            fullWidth
          >
            {
              categories?.map((cate, index) => (
                <MenuItem key={index} value={index}>{cate}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Box>
      <Stack sx={{ display: { xs: "none", sm: "block" } }} direction="row" spacing={2}>
        <ButtonGroup>
          {
            categories?.map((cate, index) => (
              <Button
                key={index}
                size="large"
                variant={currCategory === index ? "contained" : "text"}
                sx={{
                  color: currCategory === index ? "primary.contrastText" : "text.primary"
                }}
                onClick={() => onCategoryChange(index)}
              >
                {cate}
              </Button>
            ))
          }
        </ButtonGroup>
      </Stack>
    </Box>
  )
}

export default CategoryToggle
