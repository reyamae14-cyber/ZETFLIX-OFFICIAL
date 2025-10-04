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

const SigninForm = ({ switchAuthState }) => {
  const dispatch = useDispatch()

  const [isLoginRequest, setIsLoginRequest] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [showPassword, setShowPassword] = useState(false)

  const signinForm = useFormik({
    initialValues: {
      password: "",
      username: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("username is required"),
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined)
      setIsLoginRequest(true)
      const { response, err } = await userApi.signin(values)
      setIsLoginRequest(false)

      if (response) {
        signinForm.resetForm()
        dispatch(setUser(response))
        dispatch(setAuthModalOpen(false))
        
        // Dispatch login success event for greeting management
        window.dispatchEvent(new CustomEvent('loginSuccess', { 
          detail: response 
        }))
        
        // Show appropriate greeting - WelcomeGreeting dialog will handle first-time vs returning user logic
        if (response.shouldShowFirstTimeGreeting || (response.isFirstLogin && response.hoursSinceCreation <= 24)) {
          // First-time greeting will be handled by WelcomeGreeting dialog in App.jsx
          console.log('First-time user login - WelcomeGreeting dialog will show')
        } else {
          // Show returning user greeting as toast
          const hour = new Date().getHours()
          let timeGreeting = "Good Evening"
          if (hour < 12) timeGreeting = "Good Morning"
          else if (hour < 17) timeGreeting = "Good Afternoon"
          
          const greetingTemplates = [
            `${timeGreeting}, ${response.displayName}. Welcome back! Enjoy watching on ZETFLIX.`,
            `Welcome back, ${response.displayName}. It's great to see you again. Your watchlist is ready.`,
            `Hello again, ${response.displayName}. We've missed you. Settle in and enjoy what's new on ZETFLIX.`
          ]
          
          // Use a random selection for returning users
          const randomIndex = Math.floor(Math.random() * greetingTemplates.length)
          const welcomeMessage = greetingTemplates[randomIndex]
          
          toast.success(welcomeMessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
          })
        }
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
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ mt: 4 }}
        loading={isLoginRequest}
      >
        sign in
      </LoadingButton>

      <Button
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => switchAuthState()}
      >
        sign up
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

export default SigninForm