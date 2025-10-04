import { useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import * as Yup from "yup"

import { LoadingButton } from "@mui/lab"
import { Alert, Box, Button, Stack, TextField, InputAdornment, IconButton } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

import userApi from "../../api/modules/user.api"

import { setAuthModalOpen } from "../../redux/features/authModalSlice"
import { setUser } from "../../redux/features/userSlice"

const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch()

  const [isLoginRequest, setIsLoginRequest] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const signinForm = useFormik({
    initialValues: {
      password: "",
      username: "",
      displayName: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("username is required"),
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
      displayName: Yup.string()
        .min(8, "displayName minimum 8 characters")
        .required("displayName is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "confirmPassword not match")
        .min(8, "confirmPassword minimum 8 characters")
        .required("confirmPassword is required")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined)
      setIsLoginRequest(true)
      const { response, err } = await userApi.signup(values)
      setIsLoginRequest(false)

      if (response) {
        signinForm.resetForm()
        dispatch(setUser(response))
        dispatch(setAuthModalOpen(false))
        
        // Personalized welcome greeting for new users
        const hour = new Date().getHours()
        let greeting = "Good Evening"
        if (hour < 12) greeting = "Good Morning"
        else if (hour < 17) greeting = "Good Afternoon"
        
        const welcomeMessage = `${greeting}, ${response.displayName}! 🎉 Welcome to your new movie adventure! Get ready to discover amazing films and shows! 🎬✨`
        
        toast.success(welcomeMessage, {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
        })
      }

      if (err) setErrorMessage(err.message)
    }
  })

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="text"
          placeholder="username"
          name="username"
          fullWidth
          value={signinForm.values.username}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.username && signinForm.errors.username !== undefined}
          helperText={signinForm.touched.username && signinForm.errors.username}
        />
        <TextField
          type="text"
          placeholder="display name"
          name="displayName"
          fullWidth
          value={signinForm.values.displayName}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.displayName && signinForm.errors.displayName !== undefined}
          helperText={signinForm.touched.displayName && signinForm.errors.displayName}
        />
        <TextField
          type={showPassword ? "text" : "password"}
          placeholder="password"
          name="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.password && signinForm.errors.password !== undefined}
          helperText={signinForm.touched.password && signinForm.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          type={showConfirmPassword ? "text" : "password"}
          placeholder="confirm password"
          name="confirmPassword"
          fullWidth
          value={signinForm.values.confirmPassword}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.confirmPassword && signinForm.errors.confirmPassword !== undefined}
          helperText={signinForm.touched.confirmPassword && signinForm.errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ mt: 4 }}
        loading={isLoginRequest}
      >
        sign up
      </LoadingButton>

      <Button
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => switchAuthState()}
      >
        sign in
      </Button>

      {
        errorMessage && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" variant="outlined" >{errorMessage}</Alert>
          </Box>
        )
      }
    </Box>
  )
}

export default SignupForm