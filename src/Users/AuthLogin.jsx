import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import AnimateButton from '../ui-component/extended/AnimateButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import Logo from '../ui-component/Logo';

function AuthLogin({ ...others }) {
  // --- keep funcs & state exactly as you had ---
  const [is_not_found, setis_not_found] = useState('');
  const history = useNavigate();
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  async function SignIn(email, password) {
    try {
      const res = await axios.post(
        'http://localhost:9000/api/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: email,
            ps: res.data.user.ps,
            Cuser: res.data.user.id_user,
            roles: res.data.user.Action_user,
            name_user: res.data.user.name_user,
          })
        );
        history('/home');
      } else {
        setis_not_found('Login failed: Token is missing!');
      }
    } catch (e) {
      console.log('testtttttttttttttttt', e);
      setis_not_found('Login or Password is wrong. Please try again!');
    }
  }

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', bgcolor: (t) => t.palette.background.default }}>
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: (t) => t.shadows[8],
            bgcolor: (t) => t.palette.background.paper,
          }}
        >
          {/* Header / Logo */}
          <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 2 }}>
            {/* Use your existing Logo component */}
            <Logo />
            <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue to GAJA ERP
            </Typography>
          </Stack>

          {/* Form */}
          <Formik
            onSubmit={(values, actions) => {
              setTimeout(() => {
                SignIn(values.email, values.password);
                actions.setSubmitting(false);
              }, 500);
            }}
            initialValues={{ email: '', password: '' }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required'),
            })}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <Box component="form" noValidate onSubmit={handleSubmit} {...others}>
                <Stack spacing={2.5}>
                  <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                    <InputLabel htmlFor="outlined-adornment-email-login">Email address</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Email address"
                      startAdornment={
                        <InputAdornment position="start">
                          <EmailOutlined fontSize="small" />
                        </InputAdornment>
                      }
                    />
                    {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                  </FormControl>

                  <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                    <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password-login"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <LockOutlined fontSize="small" />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                    {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                  </FormControl>

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <FormControlLabel
                      control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} color="primary" />}
                      label="Remember me"
                    />
                    <Link component="button" type="button" underline="hover" sx={{ fontSize: 14 }}
                      onClick={() => console.log('Forgot Password clicked')}
                    >
                      Forgot password?
                    </Link>
                  </Stack>

                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {isSubmitting ? 'Signing in…' : 'Sign in'}
                    </Button>
                  </AnimateButton>
                </Stack>
              </Box>
            )}
          </Formik>

          <Divider sx={{ my: 3 }} />

          {/* Helper text / notices */}
          <Stack spacing={1} textAlign="center">
            <Typography variant="body2" color="error.main" sx={{ minHeight: 20 }}>
              {is_not_found}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              We'll never share your email and password with anyone else.
            </Typography>
          </Stack>
        </Paper>

        {/* footer */}
        <Stack spacing={0.25} alignItems="center" sx={{ mt: 3 }}>
          <Typography variant="caption" color="text.secondary">This Portal was created by IT Dept.</Typography>
          <Typography variant="caption" color="text.secondary">
            ©2025 Copyright: <Link href="https://gaja.ly/" target="_blank" rel="noopener">gaja.ly</Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default AuthLogin;
