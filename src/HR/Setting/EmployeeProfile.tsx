import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import {
  Box, IconButton, Tooltip, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Divider, Typography, Select, MenuItem, FormControl, InputLabel, Switch,
  FormControlLabel, Chip, Avatar, Stack, Stepper, Step, StepLabel, Paper, 
  Alert, Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import * as XLSX from 'xlsx';
import axios from 'axios';

export type Employee = {
  ID_EMP?: number;
  NAME: string;
  TITLE?: string | null;
  EMAIL?: string | null;
  PHONE?: string | null;
  COST_CENTER?: string | null;
  STATE?: boolean | null;
  CONTRACT_START?: string | null;
  CONTRACT_END?: string | null;
  BASIC_SALARY?: number | null;
  NATIONALITY?: string | null;
  MARITAL_STATUS?: string | null;
  DEGREE?: string | null;
  TYPE_OF_RECRUITMENT?: string | null;
  ADDRESS?: string | null;
  DATE_OF_BIRTH?: string | null;
  GENDER?: string | null;
  NUM_OF_CHILDREN?: number | null;
  PLACE_OF_BIRTH?: string | null;
  BLOOD_TYPE?: string | null;
  IS_FOREINGHT?: boolean | null;
  FINGERPRINT_NEEDED?: boolean | null;
  PICTURE_URL?: string | null;
};

const emptyEmployee: Employee = {
  NAME: '',
  TITLE: '',
  EMAIL: '',
  PHONE: '',
  COST_CENTER: '',
  STATE: true,
  CONTRACT_START: '',
  CONTRACT_END: '',
  BASIC_SALARY: null,
  NATIONALITY: '',
  MARITAL_STATUS: '',
  DEGREE: '',
  TYPE_OF_RECRUITMENT: '',
  ADDRESS: '',
  DATE_OF_BIRTH: '',
  GENDER: '',
  NUM_OF_CHILDREN: null,
  PLACE_OF_BIRTH: '',
  BLOOD_TYPE: '',
  IS_FOREINGHT: false,
  FINGERPRINT_NEEDED: false,
};

const steps = ['Basic Info', 'HR & Contract', 'Personal'];

const BASE_URL = ('http://localhost:9000').replace(/\/+$/, '');
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

const Employees = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [costCenter, setCostCenter] = useState('');

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<Employee>(emptyEmployee);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Snackbar state for success/error messages
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (stateFilter !== 'all') params.state = stateFilter;
      if (costCenter) params.cost_center = costCenter;

      const res = await api.get('/employees', { params });
      
      // Handle both direct array and data wrapper response formats
      const employeesData = Array.isArray(res.data) ? res.data : res.data.data || [];
      setData(employeesData);
      
    } catch (err: any) {
      console.error('Employees fetch failed:', err);
      
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
        return;
      }
      
      const errorMessage = err?.response?.data?.message || 'Error loading employees';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
      
    } finally {
      setLoading(false);
    }
  }, [search, stateFilter, costCenter, navigate]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const resetDialog = () => {
    setOpen(false);
    setIsEdit(false);
    setForm(emptyEmployee);
    setErrors({});
    setStep(0);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const openAdd = () => {
    setForm(emptyEmployee);
    setIsEdit(false);
    setOpen(true);
  };

  const openEdit = (row: Employee) => {
    setForm({ ...row });
    setIsEdit(true);
    setOpen(true);
    setStep(0);
    setPhotoFile(null);
    setPhotoPreview(row.PICTURE_URL || null);
  };

  const validate = (currentStep = step) => {
    const e: Record<string, string> = {};
    if (currentStep === 0) {
      // if (!form.NAME?.trim()) e.NAME = 'Name is required';
      if (form.EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.EMAIL)) e.EMAIL = 'Invalid email';
    } else if (currentStep === 1) {
      if (form.BASIC_SALARY !== undefined && form.BASIC_SALARY !== null) {
        if (Number.isNaN(Number(form.BASIC_SALARY))) e.BASIC_SALARY = 'Salary must be a number';
      }
    } else if (currentStep === 2) {
      if (form.NUM_OF_CHILDREN !== undefined && form.NUM_OF_CHILDREN !== null) {
        if (Number.isNaN(Number(form.NUM_OF_CHILDREN))) e.NUM_OF_CHILDREN = 'Must be a number';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const payload: Employee = { ...form };

  const handleNext = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSave = async () => {
  const payload: Employee = { ...form };
  console.log('TEST payload:', payload); // Debug log
    if (!validate(0) || !validate(1) || !validate(2)) return;

    try {
      const payload: Employee = { ...form };
      
      // Normalize empty strings to null
      Object.keys(payload).forEach(key => {
        if (typeof payload[key as keyof Employee] === 'string' && payload[key as keyof Employee] === '') {
          (payload as any)[key] = null;
        }
      });

      if (isEdit && form.ID_EMP) {
        await api.put(`/employees/${form.ID_EMP}`, payload, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        showSnackbar('Employee updated successfully!', 'success');
      } else {
        await api.post('/employees', form, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        showSnackbar('Employee created successfully!', 'success');
      }

      await fetchEmployees();
      resetDialog();
      
    } catch (err: any) {
      console.error('Save failed:', err);
      console.error('Response data:', err?.response?.data);
      console.error('Request payload was:', payload);
      
      const errorMessage = err?.response?.data?.message || 'Failed to save employee';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = async (row: Employee) => {
    if (!row.ID_EMP) return;
    if (!window.confirm(`Delete employee "${row.NAME}"?`)) return;
    
    try {
      await api.delete(`/employees/${row.ID_EMP}`);
      showSnackbar('Employee deleted successfully!', 'success');
      await fetchEmployees();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Delete failed';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleExportExcel = () => {
    if (data.length === 0) {
      showSnackbar('No data to export', 'info');
      return;
    }
    
    const headers = [
      'ID', 'Name', 'Title', 'Email', 'Phone', 'Cost Center', 'Active', 'Salary', 'Contract Start', 'Contract End',
    ];
    const rows = data.map((e) => [
      e.ID_EMP, e.NAME, e.TITLE || '', e.EMAIL || '', e.PHONE || '', e.COST_CENTER || '',
      e.STATE ? 'Yes' : 'No', e.BASIC_SALARY ?? '', e.CONTRACT_START || '', e.CONTRACT_END || '',
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'employees');
    XLSX.writeFile(workbook, 'employees.xlsx');
    showSnackbar('Export completed!', 'success');
  };

  const columns = useMemo<MRT_ColumnDef<Employee>[]>(() => [
    {
      accessorKey: 'PICTURE_URL',
      header: '',
      size: 50,
      Cell: ({ row }) => <Avatar src={row.original.PICTURE_URL || undefined} alt={row.original.NAME} />,
      enableColumnActions: false,
      enableSorting: false,
    },
    { accessorKey: 'ID_EMP', header: 'ID', size: 70 },
    { accessorKey: 'NAME', header: 'Name', size: 220 },
    { accessorKey: 'TITLE', header: 'Title', size: 160 },
    { accessorKey: 'EMAIL', header: 'Email', size: 220 },
    { accessorKey: 'PHONE', header: 'Phone', size: 140 },
    { accessorKey: 'COST_CENTER', header: 'Cost Center', size: 120 },
    {
      accessorKey: 'STATE',
      header: 'Status',
      size: 90,
      Cell: ({ cell }) =>
        cell.getValue<boolean | null>() ? (
          <Chip label="Active" color="success" size="small" />
        ) : (
          <Chip label="Inactive" color="default" size="small" />
        ),
    },
    {
      header: 'Actions',
      id: 'actions',
      size: 110,
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => openEdit(row.original)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row.original)} size="small">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data,
    state: { isLoading: loading },
    enableDensityToggle: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 25 },
      density: 'compact',
    },
    // Custom no data message
    muiTableBodyProps: {
      sx: {
        '& .MuiTableRow-root:only-child .MuiTableCell-root': {
          textAlign: 'center',
          color: 'text.secondary',
          fontStyle: 'italic',
        },
      },
    },
  });

  const setField = (k: keyof Employee, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const onPhotoChange = (f: File | null) => {
    setPhotoFile(f);
    setPhotoPreview(f ? URL.createObjectURL(f) : null);
  };

  // Custom empty state component
  const EmptyState = () => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 6, 
        textAlign: 'center', 
        bgcolor: 'grey.50', 
        border: '2px dashed',
        borderColor: 'grey.300',
        borderRadius: 2
      }}
    >
      <PersonAddIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No employees found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {search || stateFilter !== 'all' || costCenter 
          ? "Try adjusting your search filters or add a new employee."
          : "Get started by adding your first employee to the system."
        }
      </Typography>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />}
        onClick={openAdd}
        sx={{ borderRadius: 3 }}
      >
        Add First Employee
      </Button>
    </Paper>
  );

  return (
    <Box p={0.5}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Employees
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Search name/email/phone/title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchEmployees()}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              label="State"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value as any)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Cost Center"
            value={costCenter}
            onChange={(e) => setCostCenter(e.target.value)}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={fetchEmployees}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ImportExportIcon />}
            onClick={handleExportExcel}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', px: 2 }}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', px: 2 }}
          >
            New Employee
          </Button>
        </Stack>
      </Box>

      {/* Show custom empty state when no data and not loading */}
      {!loading && data.length === 0 && !error ? (
        <EmptyState />
      ) : (
        <MaterialReactTable table={table} />
      )}

      <Dialog open={open} onClose={resetDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEdit ? 'Edit Employee' : 'New Employee'}
          <Divider sx={{ mt: 1 }} />
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {step === 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Name *" value={form.NAME} onChange={(e) => setField('NAME', e.target.value)}
                error={!!errors.NAME} helperText={errors.NAME} />
              <TextField label="Title" value={form.TITLE || ''} onChange={(e) => setField('TITLE', e.target.value)} />
              <TextField label="Email" value={form.EMAIL || ''} onChange={(e) => setField('EMAIL', e.target.value)}
                error={!!errors.EMAIL} helperText={errors.EMAIL} />
              <TextField label="Phone" value={form.PHONE || ''} onChange={(e) => setField('PHONE', e.target.value)} />
              <TextField label="Cost Center" value={form.COST_CENTER || ''} onChange={(e) => setField('COST_CENTER', e.target.value)} />
              <FormControlLabel control={<Switch checked={!!form.STATE} onChange={(e) => setField('STATE', e.target.checked)} />} label="Active" />
              <Box sx={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Avatar src={photoPreview || form.PICTURE_URL || undefined} sx={{ width: 64, height: 64 }} />
                <Button component="label" variant="outlined" disabled>
                  {photoFile ? 'Change Photo' : 'Upload Photo'}
                  <input hidden type="file" accept="image/*" onChange={(e) => onPhotoChange(e.target.files?.[0] || null)} />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  (Photo upload temporarily disabled)
                </Typography>
                {photoFile && <Button color="secondary" onClick={() => onPhotoChange(null)}>Remove</Button>}
              </Box>
            </Box>
          )}

          {step === 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Contract Start" type="date" InputLabelProps={{ shrink: true }}
                value={form.CONTRACT_START || ''} onChange={(e) => setField('CONTRACT_START', e.target.value)} />
              <TextField label="Contract End" type="date" InputLabelProps={{ shrink: true }}
                value={form.CONTRACT_END || ''} onChange={(e) => setField('CONTRACT_END', e.target.value)} />
              <TextField label="Basic Salary" type="number" value={form.BASIC_SALARY ?? ''}
                onChange={(e) => setField('BASIC_SALARY', e.target.value === '' ? null : Number(e.target.value))}
                error={!!errors.BASIC_SALARY} helperText={errors.BASIC_SALARY} />
              <TextField label="Type of Recruitment" value={form.TYPE_OF_RECRUITMENT || ''} onChange={(e) => setField('TYPE_OF_RECRUITMENT', e.target.value)} />
              <FormControlLabel control={<Switch checked={!!form.FINGERPRINT_NEEDED}
                onChange={(e) => setField('FINGERPRINT_NEEDED', e.target.checked)} />} label="Fingerprint Needed" />
              <TextField label="Address" value={form.ADDRESS || ''} onChange={(e) => setField('ADDRESS', e.target.value)} />
            </Box>
          )}

          {step === 2 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Nationality" value={form.NATIONALITY || ''} onChange={(e) => setField('NATIONALITY', e.target.value)} />
              <FormControl>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select labelId="gender-label" label="Gender" value={form.GENDER || ''} onChange={(e) => setField('GENDER', e.target.value)}>
                  <MenuItem value="">—</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Date of Birth" type="date" InputLabelProps={{ shrink: true }}
                value={form.DATE_OF_BIRTH || ''} onChange={(e) => setField('DATE_OF_BIRTH', e.target.value)} />
              <TextField label="Marital Status" value={form.MARITAL_STATUS || ''} onChange={(e) => setField('MARITAL_STATUS', e.target.value)} />
              <TextField label="Children" type="number" value={form.NUM_OF_CHILDREN ?? ''}
                onChange={(e) => setField('NUM_OF_CHILDREN', e.target.value === '' ? null : Number(e.target.value))}
                error={!!errors.NUM_OF_CHILDREN} helperText={errors.NUM_OF_CHILDREN} />
              <TextField label="Place of Birth" value={form.PLACE_OF_BIRTH || ''} onChange={(e) => setField('PLACE_OF_BIRTH', e.target.value)} />
              <TextField label="Blood Type" value={form.BLOOD_TYPE || ''} onChange={(e) => setField('BLOOD_TYPE', e.target.value)} />
              <FormControlLabel control={<Switch checked={!!form.IS_FOREINGHT} onChange={(e) => setField('IS_FOREINGHT', e.target.checked)} />} label="Is Foreigner" />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={resetDialog} color="secondary">Cancel</Button>
          {step > 0 && <Button onClick={handleBack}>Back</Button>}
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained">Next</Button>
          ) : (
            <Button onClick={handleSave} variant="contained" color="primary">
              {isEdit ? 'Save Changes' : 'Create Employee'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Employees;