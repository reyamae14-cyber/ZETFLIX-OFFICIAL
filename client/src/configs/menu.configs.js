import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined"
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined"
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined"
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined"
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined"
import { routesGen } from "../routes/routes"

const main = [
  {
    display: "home",
    path: "/",
    icon: <HomeOutlinedIcon />,
    state: "home"
  },
  {
    display: "movies",
    path: "/movie",
    icon: <SlideshowOutlinedIcon />,
    state: "movie"
  },
  {
    display: "tv series",
    path: "/tv",
    icon: <LiveTvOutlinedIcon />,
    state: "tv"
  },
  {
    display: "genres",
    path: "/genres",
    icon: <TheaterComedyIcon />,
    state: "genre"
  },
  {
    display: "search",
    path: "/search",
    icon: <SearchOutlinedIcon />,
    state: "search"
  }
]

const user = [
  {
    display: "dashboard",
    path: routesGen.profileDashboard,
    icon: <DashboardOutlinedIcon />,
    state: "profile.dashboard"
  },
  {
    display: "favorites",
    path: routesGen.favoriteList,
    icon: <FavoriteBorderOutlinedIcon />,
    state: "favorite.list"
  },
  {
    display: "reviews",
    path: routesGen.reviewList,
    icon: <RateReviewOutlinedIcon />,
    state: "review.list"
  },
  {
    display: "password update",
    path: routesGen.passwordUpdate,
    icon: <LockResetOutlinedIcon />,
    state: "password.update"
  }
]

const menuConfigs = { main, user }

export default menuConfigs