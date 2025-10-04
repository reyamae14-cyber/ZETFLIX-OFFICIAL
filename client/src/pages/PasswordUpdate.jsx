import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import * as Yup from "yup"

import { LoadingButton } from "@mui/lab"
import { Box, Stack, TextField, InputAdornment, IconButton } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

import userApi from "../api/modules/user.api"

import Container from "../components/common/Container"

import uiConfigs from "../configs/ui.configs"

import { setUser } from "../redux/features/userSlice"
import { setAuthModalOpen } from "../redux/features/authModalSlice"

const PasswordUpdate = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [onRequest, setOnRequest] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required"),
      newPassword: Yup.string()
        .min(8, "newPassword minimum 8 characters")
        .required("newPassword is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "confirmNewPassword not match")
        .min(8, "confirmNewPassword minimum 8 characters")
        .required("confirmNewPassword is required")
    }),
    onSubmit: async values => onUpdate(values)
  })

  const onUpdate = async (values) => {
    if (onRequest) return
    setOnRequest(true)

    const { response, err } = await userApi.passwordUpdate(values)

    setOnRequest(false)

    if (err) toast.error(err.message)
    if (response) {
      form.resetForm()
      navigate("/")
      dispatch(setUser(null))
      dispatch(setAuthModalOpen(true))
      toast.success("Update password success! Please re-login")
    }
  }

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header="update password">
        <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              type={showCurrentPassword ? "text" : "password"}
              placeholder="password"
              name="password"
              fullWidth
              value={form.values.password}
              onChange={form.handleChange}
              color="success"
              error={form.touched.password && form.errors.password !== undefined}
              helperText={form.touched.password && form.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              type={showNewPassword ? "text" : "password"}
              placeholder="new password"
              name="newPassword"
              fullWidth
              value={form.values.newPassword}
              onChange={form.handleChange}
              color="success"
              error={form.touched.newPassword && form.errors.newPassword !== undefined}
              helperText={form.touched.newPassword && form.errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              type={showConfirmPassword ? "text" : "password"}
              placeholder="confirm new password"
              name="confirmNewPassword"
              fullWidth
              value={form.values.confirmNewPassword}
              onChange={form.handleChange}
              color="success"
              error={form.touched.confirmNewPassword && form.errors.confirmNewPassword !== undefined}
              helperText={form.touched.confirmNewPassword && form.errors.confirmNewPassword}
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

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 4 }}
              loading={onRequest}
            >
              update password
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default PasswordUpdate