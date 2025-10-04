import { lazy } from "react"
import ProtectedPage from "../components/common/ProtectedPage"

// Lazy load components for better performance
const HomePage = lazy(() => import("../pages/HomePage"))
const MediaList = lazy(() => import("../pages/MediaList"))
const GenreList = lazy(() => import("../pages/GenereList"))
const MediaSearch = lazy(() => import("../pages/MediaSearch"))
const MediaDetail = lazy(() => import("../pages/MediaDetail"))
const PersonDetail = lazy(() => import("../pages/PersonDetail"))
const FavoriteList = lazy(() => import("../pages/FavoriteList"))
const ReviewList = lazy(() => import("../pages/ReviewList"))
const PasswordUpdate = lazy(() => import("../pages/PasswordUpdate"))
const ProfileDashboard = lazy(() => import("../pages/ProfileDashboard"))

export const routesGen = {
  home: "/",
  mediaList: (type) => `/${type}`,
  genereList: "/genre",
  mediaSearch: "/search",
  mediaDetail: (type, id) => `/${type}/${id}`,
  person: (id) => `/person/${id}`,
  profileDashboard: "/profile",
  favoriteList: "/favorites",
  reviewList: "/reviews",
  passwordUpdate: "/password-update"
}

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },
  {
    path: "/:mediaType",
    element: <MediaList />
  },
  {
    path: "/genres",
    element: <GenreList />,
    state: "genres"
  },
  {
    path: "/search",
    element: <MediaSearch />,
    state: "search"
  },
  {
    path: "/:mediaType/:mediaId",
    element: <MediaDetail />
  },
  {
    path: "/person/:personId",
    element: <PersonDetail />,
    state: "person.detail"
  },
  {
    path: routesGen.profileDashboard,
    element: (
      <ProtectedPage>
        <ProfileDashboard />
      </ProtectedPage>
    ),
    state: "profile.dashboard"
  },
  {
    path: routesGen.favoriteList,
    element: (
      <ProtectedPage>
        <FavoriteList />
      </ProtectedPage>
    ),
    state: "favorite.list"
  },
  {
    path: "/reviews",
    element: (
      <ProtectedPage>
        <ReviewList />
      </ProtectedPage>
    ),
    state: "reviews"
  },
  {
    path: "/password-update",
    element: (
      <ProtectedPage>
        <PasswordUpdate />
      </ProtectedPage>
    ),
    state: "password.update"
  }
]

export default routes