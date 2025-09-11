import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box, IconButton, Tooltip, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Divider, Typography, Select, MenuItem, FormControl, InputLabel, Switch,
  FormControlLabel, Avatar, Stack, Stepper, Step, StepLabel, Paper, 
  Alert, Snackbar, useMediaQuery, useTheme, ToggleButtonGroup, ToggleButton, CircularProgress,
  Chip, LinearProgress, List, ListItem, ListItemAvatar, ListItemText
} from '@mui/material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { EmployeeCard } from '../../components/EmployeeCard';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import AddIcon from '@mui/icons-material/Add';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import ApartmentIcon from '@mui/icons-material/Apartment';
import * as XLSX from 'xlsx';
import axios from 'axios';

export type Employee = {
  ID_EMP?: number;
  NAME: string;
  TITLE?: string | null;
  EMAIL?: string | null;
  PHONE?: string | null;
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
  PS?: string | null;
  
  // Additional fields from the model
  COMMENT?: string | null;
  EMPLOYER_REF?: string | null;
  BANK?: number | null;
  INVESTMENT?: string | null;
  FINANCE_NUM?: string | null;
  TYPE_OF_INSURANCE?: string | null;
  NUM_OF_INSURANCE?: string | null;
  ACCOUNT_NUMBER?: string | null;
  PICTURE?: any | null;
  NUM_CIN?: string | null;
  ISSUING_AUTH?: string | null;
  FAM_BOOK_NUM?: string | null;
  FAM_BOOK_ISSUING_AUTH?: string | null;
  PASSPORT_NUM?: string | null;
  PASSPORT_ISSUING_AUTH?: string | null;
  ANNUAL_LEAVE_BAL?: number | null;
  DRIVER_LIC_NUM?: string | null;
  NAME_ENGLISH?: string | null;
  SCIENTIFIC_CERT?: string | null;
  NUM_NATIONAL?: string | null;
  RENEWABLE_CONTRACT?: string | null;
  ATTACHED_NUMBER?: string | null;
  JOB_AIM?: string | null;
  JOB_DESCRIPTION?: string | null;
  JO_RELATION?: string | null;
  REQUEST_DEGREE?: string | null;
  PREFERRED_LANG?: string | null;
  MEDICAL_COMMENT?: string | null;
  OUTFIT_NUM?: string | null;
  FOOTWEAR_NUM?: string | null;
  FOOD?: number | null;
  FUEL?: number | null;
  COMMUNICATION?: number | null;
  num_kid?: string | null;
  T_START?: string | null;
  T_END?: string | null;
  GOLD_COMM?: string | null;
  DIAMOND_COMM?: number | null;
  FOOD_ALLOWANCE?: number | null;
  GOLD_COMM_VALUE?: number | null;
  DIAMOND_COMM_TYPE?: string | null;
  COST_CENTER?: string | null;
  CREATED_AT?: string | null;
  UPDATED_AT?: string | null;
};

const emptyEmployee: Employee = {
  NAME: '',
  TITLE: '',
  EMAIL: '',
  PHONE: '',
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
  PS: '',
  IS_FOREINGHT: false,
  FINGERPRINT_NEEDED: false,
  
  // Initialize additional fields
  COMMENT: '',
  EMPLOYER_REF: '',
  BANK: null,
  INVESTMENT: '',
  FINANCE_NUM: '',
  TYPE_OF_INSURANCE: '',
  NUM_OF_INSURANCE: '',
  ACCOUNT_NUMBER: '',
  PICTURE: null,
  NUM_CIN: '',
  ISSUING_AUTH: '',
  FAM_BOOK_NUM: '',
  FAM_BOOK_ISSUING_AUTH: '',
  PASSPORT_NUM: '',
  PASSPORT_ISSUING_AUTH: '',
  ANNUAL_LEAVE_BAL: null,
  DRIVER_LIC_NUM: '',
  NAME_ENGLISH: '',
  SCIENTIFIC_CERT: '',
  NUM_NATIONAL: '',
  RENEWABLE_CONTRACT: '',
  ATTACHED_NUMBER: '',
  JOB_AIM: '',
  JOB_DESCRIPTION: '',
  JO_RELATION: '',
  REQUEST_DEGREE: '',
  PREFERRED_LANG: '',
  MEDICAL_COMMENT: '',
  OUTFIT_NUM: '',
  FOOTWEAR_NUM: '',
  FOOD: null,
  FUEL: null,
  COMMUNICATION: null,
  num_kid: '',
  T_START: '',
  T_END: '',
  GOLD_COMM: '',
  DIAMOND_COMM: null,
  FOOD_ALLOWANCE: null,
  GOLD_COMM_VALUE: null,
  DIAMOND_COMM_TYPE: '',
  PICTURE_URL: '',
};

const steps = [
  'Basic Information',
  'Employment Details',
  'Personal Information',
  'Identification',
  'Financial Information',
  'Additional Details',
  'Compensation',
  'Other Information'
];

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

// ===== Helpers for premium feel =====
const initials = (name?: string | null) => (name ? name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase() : '');
const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString() : '—');
const currency = (n?: number | null) => (n == null ? '—' : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n));

// ===== Org chart helpers (DESIGN ONLY, no logic change to CRUD) =====
function buildHierarchy(employees: Employee[]) {
  const byId = new Map<number, Employee>();
  employees.forEach((e) => { if (e.ID_EMP != null) byId.set(e.ID_EMP, e); });
  const children = new Map<number | 'root', Employee[]>();
  children.set('root', []);
  employees.forEach((e) => {
    const mgrId = e.JO_RELATION ? Number(e.JO_RELATION) : undefined;
    if (mgrId && byId.has(mgrId)) {
      const arr = children.get(mgrId) || [];
      arr.push(e);
      children.set(mgrId, arr);
    } else {
      const arr = children.get('root') || [];
      arr.push(e);
      children.set('root', arr);
    }
  });
  return { byId, children };
}

const OrgCard: React.FC<{ e: Employee; posName?: string }> = ({ e, posName }) => (
  <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', minWidth: 220 }}>
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Avatar src={e.PICTURE_URL || undefined}>{initials(e.NAME)}</Avatar>
      <Box>
        <Typography fontWeight={700} lineHeight={1.2}>{e.NAME}</Typography>
        <Typography variant="body2" color="text.secondary">{e.TITLE || '—'}</Typography>
        {posName && <Chip size="small" sx={{ mt: 0.75 }} label={posName} />}
      </Box>
    </Stack>
  </Paper>
);

const OrgBranch: React.FC<{ id: number | 'root'; data: ReturnType<typeof buildHierarchy>; posNameById: Map<number, string> }>
= ({ id, data, posNameById }) => {
  const kids = data.children.get(id) || [];
  if (kids.length === 0) return null;
  return (
    <Stack alignItems="center" spacing={3} sx={{ position: 'relative' }}>
      {id !== 'root' && (<Box sx={{ width: 2, bgcolor: 'divider', height: 16 }} />)}
      <Stack direction="row" spacing={3} alignItems="flex-start">
        {kids.map((e) => (
          <Stack key={e.ID_EMP} alignItems="center" spacing={2}>
            <OrgCard e={e} posName={e.PS ? posNameById.get(Number(e.PS)) : undefined} />
            <Box sx={{ width: 2, bgcolor: 'divider', height: (data.children.get(e.ID_EMP!) || []).length ? 16 : 0 }} />
            <OrgBranch id={e.ID_EMP!} data={data} posNameById={posNameById} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

const OrgChart: React.FC<{ employees: Employee[]; posNameById: Map<number, string> }> = ({ employees, posNameById }) => {
  const data = buildHierarchy(employees);
  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
      <OrgBranch id={'root'} data={data} posNameById={posNameById} />
    </Box>
  );
};

// ===== Main Component =====
const Employees = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [pointsOfSale, setPointsOfSale] = useState<Array<{ Id_point: number; name_point: string }>>([]);

  // NEW: top-level navigation tabs (design-only)
  const [tab, setTab] = useState(0); // 0 Directory, 1 Profile, 2 Org, 3 Calendar
  const [selected, setSelected] = useState<Employee | null>(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<Employee>(emptyEmployee);
  const [step, setStep] = useState(0);
  const [errorsState, setErrors] = useState<Record<string, string>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Snackbar state for success/error messages
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning'; }>({ open: false, message: '', severity: 'info' });
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'info') => setSnackbar({ open: true, message, severity });

  // POS name map for chips & org chart
  const posNameById = useMemo(() => {
    const m = new Map<number, string>();
    pointsOfSale.forEach((p) => m.set(p.Id_point, p.name_point));
    return m;
  }, [pointsOfSale]);

  // ======= ORIGINAL: Fetch points of sale (unchanged) =======
  const fetchPointsOfSale = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/ps/all`, { headers: { Authorization: `Bearer ${token}` } });
      setPointsOfSale(response.data);
    } catch (error) {
      console.error('Error fetching points of sale:', error);
      showSnackbar('Failed to fetch points of sale', 'error');
    }
  }, []);

  useEffect(() => { fetchPointsOfSale(); }, [fetchPointsOfSale]);

  // ======= ORIGINAL: Fetch employees (unchanged logic) =======
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (stateFilter !== 'all') params.state = stateFilter === 'active' ? 'true' : 'false';
      if (pointsOfSale && pointsOfSale.length > 0) {
        // NOTE: preserving original behavior: sends ALL POS ids
        params.PS = pointsOfSale.map(pos => pos.Id_point).join(',');
      }

      const res = await api.get('/employees', { params, paramsSerializer: { indexes: null } });
      const employeesData = Array.isArray(res.data) ? res.data : res.data.data || [];
      setData(employeesData);
    } catch (err: any) {
      console.error('Employees fetch failed:', err);
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [search, stateFilter, pointsOfSale]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // ======= ORIGINAL: Dialog & CRUD (unchanged) =======
  const resetDialog = () => {
    setOpen(false);
    setIsEdit(false);
    setForm(emptyEmployee);
    setErrors({});
    setStep(0);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const openAdd = () => { setForm(emptyEmployee); setIsEdit(false); setOpen(true); };
  const openEdit = (row: Employee) => { setForm({ ...row }); setIsEdit(true); setOpen(true); setStep(0); setPhotoFile(null); setPhotoPreview(row.PICTURE_URL || null); };

  const validate = (currentStep = step) => {
    const e: Record<string, string> = {};
    if (currentStep === 0) {
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

  const handleSave = async () => {
    if (!validate(step)) return;
    try {
      setLoading(true);
      const employeeData = { ...form };
      const numberFields = ['BANK', 'NUM_OF_CHILDREN', 'ANNUAL_LEAVE_BAL', 'FOOD', 'FUEL', 'COMMUNICATION', 'DIAMOND_COMM', 'FOOD_ALLOWANCE', 'GOLD_COMM_VALUE', 'BASIC_SALARY'] as const;
      numberFields.forEach((field) => { if ((employeeData as any)[field] === '') (employeeData as any)[field] = null; });

      if (isEdit && form.ID_EMP) {
        await api.put(`/employees/${form.ID_EMP}`, employeeData);
        setSnackbar({ open: true, message: 'Employee updated successfully', severity: 'success' });
      } else {
        await api.post('/employees', employeeData);
        setSnackbar({ open: true, message: 'Employee created successfully', severity: 'success' });
      }
      fetchEmployees();
      resetDialog();
    } catch (err: any) {
      console.error('Error saving employee:', err);
      setSnackbar({ open: true, message: `Error ${isEdit ? 'updating' : 'creating'} employee: ${err.response?.data?.message || err.message}`, severity: 'error' });
    } finally {
      setLoading(false);
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
    if (data.length === 0) { showSnackbar('No data to export', 'info'); return; }
    const headers = ['ID', 'Name', 'Title', 'Email', 'Phone', 'Cost Center', 'Active', 'Salary', 'Contract Start', 'Contract End'];
    const rows = data.map((e) => [ e.ID_EMP, e.NAME, e.TITLE || '', e.EMAIL || '', e.PHONE || '', e.PS || '', e.STATE ? 'Yes' : 'No', e.BASIC_SALARY ?? '', e.CONTRACT_START || '', e.CONTRACT_END || '' ]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'employees');
    XLSX.writeFile(workbook, 'employees.xlsx');
    showSnackbar('Export completed!', 'success');
  };

  // Handle drag end event for reordering (unchanged)
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setData((items) => {
        const oldIndex = items.findIndex(item => item.ID_EMP?.toString() === active.id);
        const newIndex = items.findIndex(item => item.ID_EMP?.toString() === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  // Filter employees (unchanged logic)
  const filteredEmployees = useMemo(() => {
    return data.filter(employee => {
      const matchesSearch = !search || 
        employee.NAME?.toLowerCase().includes(search.toLowerCase()) ||
        employee.EMAIL?.toLowerCase().includes(search.toLowerCase()) ||
        employee.PHONE?.includes(search) ||
        employee.TITLE?.toLowerCase().includes(search.toLowerCase());
      const matchesState = stateFilter === 'all' || (stateFilter === 'active' && employee.STATE) || (stateFilter === 'inactive' && !employee.STATE);
      return matchesSearch && matchesState;
    });
  }, [data, search, stateFilter]);
  
  // Responsive layout
  const getGridColumns = () => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(auto-fill, minmax(350px, 1fr))';
  };

  const setField = (k: keyof Employee, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const onPhotoChange = (f: File | null) => { setPhotoFile(f); setPhotoPreview(f ? URL.createObjectURL(f) : null); };

  // ======= UI Renderers (upgraded visuals) =======
  const DirectoryGrid = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: getGridColumns(), gap: 2, p: 1, width: '100%' }}>
      {filteredEmployees.map(employee => (
        <Box key={employee.ID_EMP} onClick={() => { setSelected(employee); setTab(1); }}>
          <EmployeeCard 
            employee={employee} 
            onEdit={(e: Employee) => { openEdit(e); }}
            onDelete={handleDelete}
          />
        </Box>
      ))}
    </Box>
  );

  const DirectoryList = () => (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <SortableContext items={filteredEmployees.map(emp => emp.ID_EMP?.toString() || '')} strategy={verticalListSortingStrategy}>
        <Box sx={{ width: '100%', p: 1 }}>
          {filteredEmployees.map(employee => (
            <Box key={employee.ID_EMP} onClick={() => { setSelected(employee); setTab(1); }}>
              <EmployeeCard employee={employee} onEdit={openEdit} onDelete={handleDelete} />
            </Box>
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );

  const EmptyState = () => (
    <Paper elevation={0} sx={{ p: { xs: 3, sm: 6 }, textAlign: 'center', bgcolor: 'background.paper', border: '2px dashed', borderColor: 'divider', borderRadius: 2, m: 1 }}>
      <PersonAddIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: 'action.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>No employees found</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '400px', mx: 'auto' }}>
        {search || stateFilter !== 'all' || pointsOfSale ? 'Try adjusting your search filters or add a new employee.' : 'Get started by adding your first employee to the system.'}
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ borderRadius: 3, px: 3, py: 1 }}>Add First Employee</Button>
    </Paper>
  );


  const Row: React.FC<{ icon: React.ReactNode; label: string; value?: string | null }> = ({ icon, label, value }) => (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
      <Typography variant="body2" sx={{ minWidth: 110, color: 'text.secondary' }}>{label}</Typography>
      <Typography variant="body2" fontWeight={600}>{value || '—'}</Typography>
    </Stack>
  );

  // Profile view (read-only summary card look)
  const ProfileView = (
    <Box sx={{ p: 2 }}>
      {selected ? (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
            <Avatar src={selected.PICTURE_URL || undefined} sx={{ width: 96, height: 96 }}>{initials(selected.NAME)}</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={900}>{selected.NAME}</Typography>
              <Typography color="text.secondary">{selected.TITLE || '—'}</Typography>
              <Stack direction="row" spacing={1} mt={1}>
                {!!selected.STATE && <Chip color="success" size="small" label="Active" />}
                {selected.PS && <Chip size="small" label={posNameById.get(Number(selected.PS)) || selected.PS} />}
              </Stack>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => openEdit(selected)}>Edit</Button>
              <Button color="error" onClick={() => handleDelete(selected)}>Delete</Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1 }}>
              <Typography fontWeight={700} gutterBottom>Contact</Typography>
              <Stack spacing={1.25}>
                <Row icon={<EmailIcon fontSize="small" />} label="Email" value={selected.EMAIL} />
                <Row icon={<PhoneIcon fontSize="small" />} label="Phone" value={selected.PHONE} />
              </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, flex: 1 }}>
              <Typography fontWeight={700} gutterBottom>Employment</Typography>
              <Stack spacing={1.25}>
                <Row icon={<WorkOutlineIcon fontSize="small" />} label="Contract" value={`${fmtDate(selected.CONTRACT_START)} → ${fmtDate(selected.CONTRACT_END)}`} />
                <Row icon={<LocalAtmIcon fontSize="small" />} label="Basic Salary" value={currency(selected.BASIC_SALARY)} />
                <Row icon={<BadgeIcon fontSize="small" />} label="Employee ID" value={String(selected.ID_EMP ?? '—')} />
              </Stack>
            </Paper>
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 3 }}>
            <Typography fontWeight={700} gutterBottom>Notes</Typography>
            <Typography variant="body2" whiteSpace="pre-wrap">{selected.COMMENT || '—'}</Typography>
          </Paper>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
          <Typography>Select an employee from Directory to view the profile.</Typography>
        </Paper>
      )}
    </Box>
  );

  // Calendar view (dates list)
  const CalendarView = (
    <Box sx={{ p: 2 }}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography fontWeight={700}>People Calendar</Typography>
        <Typography variant="body2" color="text.secondary">Key dates: contracts and birthdays.</Typography>
      </Paper>
      <List sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        {filteredEmployees.flatMap((e) => {
          const items: { k: string; label: string; date?: string | null }[] = [
            { k: 'cs', label: `${e.NAME} – Contract Start`, date: e.CONTRACT_START },
            { k: 'ce', label: `${e.NAME} – Contract End`, date: e.CONTRACT_END },
            { k: 'bd', label: `${e.NAME} – Birthday`, date: e.DATE_OF_BIRTH },
          ];
          return items.filter((i) => !!i.date).map((i) => ({ ...i, id: `${e.ID_EMP}-${i.k}` }));
        }).sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
        .map((i) => (
          <Box key={i.id} component="li">
            <ListItem>
              <ListItemAvatar><Avatar><CalendarMonthIcon /></Avatar></ListItemAvatar>
              <ListItemText primary={i.label} secondary={fmtDate(i.date)} />
            </ListItem>
            <Divider component="div" />
          </Box>
        ))}
      </List>
    </Box>
  );

  // ===== JSX =====
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Premium Top App Bar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(8px)' }}>
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight={900} sx={{ mr: 2 }}>HR Workspace</Typography>

          {/* Search */}
          <Paper sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: 2, minWidth: 240, flex: 1 }} variant="outlined">
            <TextField
              variant="standard"
              placeholder="Search employees…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchEmployees()}
              fullWidth
              InputProps={{ disableUnderline: true }}
            />
          </Paper>

          {/* Filters (unchanged state + behavior) */}
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="state-label">Status</InputLabel>
            <Select labelId="state-label" label="Status" value={stateFilter} onChange={(e) => setStateFilter(e.target.value as any)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          {/* Preserve original header POS control binding to form.PS (no logic change) */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="point-of-sale-label">Point of Sale</InputLabel>
            <Select labelId="point-of-sale-label" label="Point of Sale" value={form.PS || ''} onChange={(e) => setField('PS', e.target.value as string)}>
              <MenuItem value=""><em>Select a Point of Sale</em></MenuItem>
              {pointsOfSale.map((pos) => (
                <MenuItem key={pos.Id_point} value={pos.Id_point.toString()}>{pos.name_point}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Actions (unchanged) */}
          <Tooltip title="Refresh"><IconButton onClick={fetchEmployees}><RefreshIcon /></IconButton></Tooltip>
          <Tooltip title="Export"><IconButton onClick={handleExportExcel}><ImportExportIcon /></IconButton></Tooltip>
          <Button variant="contained" color="primary" onClick={openAdd} startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>New</Button>
        </Toolbar>

        {/* Secondary nav: tabs + view mode */}
        <Toolbar sx={{ borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant={isMobile ? 'scrollable' : 'standard'}>
            <Tab icon={<GridViewIcon />} iconPosition="start" label="Directory" />
            <Tab icon={<BadgeIcon />} iconPosition="start" label="Profile" />
            <Tab icon={<ApartmentIcon />} iconPosition="start" label="Org Chart" />
            <Tab icon={<CalendarMonthIcon />} iconPosition="start" label="Calendar" />
          </Tabs>
          <Box sx={{ flex: 1 }} />
          {!isMobile && (
            <ToggleButtonGroup value={viewMode} exclusive onChange={(_, m) => m && setViewMode(m)} size="small">
              <ToggleButton value="list"><ViewListIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="grid"><GridViewIcon fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>
          )}
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Loading & error banners */}
        {loading && <LinearProgress />}
        {!loading && error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

        {!loading && !error && (
          <>
            {tab === 0 && (
              filteredEmployees.length === 0 ? (
                <EmptyState />
              ) : (
                <Box sx={{ width: '100%', overflow: 'auto' }}>
                  {viewMode === 'list' ? <DirectoryList /> : <DirectoryGrid />}
                </Box>
              )
            )}

            {tab === 1 && ProfileView}

            {tab === 2 && (
              <Box sx={{ p: 2 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                  <Typography fontWeight={700}>Organization Chart</Typography>
                  <Typography variant="body2" color="text.secondary">Built from the <code>JO_RELATION</code> manager field.</Typography>
                </Paper>
                <OrgChart employees={data} posNameById={posNameById} />
              </Box>
            )}

            {tab === 3 && CalendarView}
          </>
        )}
      </Box>

      {/* ORIGINAL Dialog (all fields unchanged) */}
      <Dialog open={open} onClose={resetDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={step} sx={{ mb: 4 }}>
              {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
            </Stepper>
            {renderStepContent(step)}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={step === 0 ? resetDialog : () => setStep(step - 1)}>{step === 0 ? 'Cancel' : 'Back'}</Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {step < steps.length - 1 ? (
            <Button onClick={() => validate(step) && setStep(step + 1)} variant="contained">Next</Button>
          ) : (
            <Button onClick={handleSave} variant="contained" color="primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications (unchanged) */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );

  // ======= step content (copied from original) =======
  function renderStepContent(step: number) {
    switch (step) {
      case 0:
        return (<>
          <TextField margin="normal" required fullWidth label="Name" name="NAME" value={form.NAME} onChange={(e) => setField('NAME', e.target.value)} error={!!errorsState.NAME} helperText={errorsState.NAME} />
          <TextField margin="normal" fullWidth label="Name in English" name="NAME_ENGLISH" value={form.NAME_ENGLISH || ''} onChange={(e) => setField('NAME_ENGLISH', e.target.value)} />
          <TextField margin="normal" fullWidth label="Email" name="EMAIL" type="email" value={form.EMAIL || ''} onChange={(e) => setField('EMAIL', e.target.value)} error={!!errorsState.EMAIL} helperText={errorsState.EMAIL} />
          <TextField margin="normal" fullWidth label="Phone" name="PHONE" value={form.PHONE || ''} onChange={(e) => setField('PHONE', e.target.value)} />
          <FormControl fullWidth margin="normal"><InputLabel>Gender</InputLabel><Select name="GENDER" value={form.GENDER || ''} onChange={(e) => setField('GENDER', e.target.value)} label="Gender"><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem></Select></FormControl>
        </>);
      case 1:
        return (<>
          <FormControl fullWidth margin="normal"><InputLabel>Point of Sale</InputLabel><Select name="PS" value={form.PS || ''} onChange={(e) => setField('PS', e.target.value)} label="Point of Sale">{pointsOfSale.map((pos) => (<MenuItem key={pos.Id_point} value={pos.Id_point}>{pos.name_point}</MenuItem>))}</Select></FormControl>
          <TextField margin="normal" fullWidth label="Job Title" name="TITLE" value={form.TITLE || ''} onChange={(e) => setField('TITLE', e.target.value)} />
          <TextField margin="normal" fullWidth label="Type of Recruitment" name="TYPE_OF_RECRUITMENT" value={form.TYPE_OF_RECRUITMENT || ''} onChange={(e) => setField('TYPE_OF_RECRUITMENT', e.target.value)} />
          <TextField margin="normal" fullWidth label="Contract Start Date" name="CONTRACT_START" type="date" InputLabelProps={{ shrink: true }} value={form.CONTRACT_START || ''} onChange={(e) => setField('CONTRACT_START', e.target.value)} />
          <TextField margin="normal" fullWidth label="Contract End Date" name="CONTRACT_END" type="date" InputLabelProps={{ shrink: true }} value={form.CONTRACT_END || ''} onChange={(e) => setField('CONTRACT_END', e.target.value)} />
        </>);
      case 2:
        return (<>
          <TextField margin="normal" fullWidth label="Date of Birth" name="DATE_OF_BIRTH" type="date" InputLabelProps={{ shrink: true }} value={form.DATE_OF_BIRTH || ''} onChange={(e) => setField('DATE_OF_BIRTH', e.target.value)} />
          <TextField margin="normal" fullWidth label="Place of Birth" name="PLACE_OF_BIRTH" value={form.PLACE_OF_BIRTH || ''} onChange={(e) => setField('PLACE_OF_BIRTH', e.target.value)} />
          <TextField margin="normal" fullWidth label="Nationality" name="NATIONALITY" value={form.NATIONALITY || ''} onChange={(e) => setField('NATIONALITY', e.target.value)} />
          <FormControl fullWidth margin="normal"><InputLabel>Marital Status</InputLabel><Select name="MARITAL_STATUS" value={form.MARITAL_STATUS || ''} onChange={(e) => setField('MARITAL_STATUS', e.target.value)} label="Marital Status"><MenuItem value="Single">Single</MenuItem><MenuItem value="Married">Married</MenuItem><MenuItem value="Divorced">Divorced</MenuItem><MenuItem value="Widowed">Widowed</MenuItem></Select></FormControl>
          <TextField margin="normal" fullWidth label="Number of Children" name="NUM_OF_CHILDREN" type="number" value={form.NUM_OF_CHILDREN || ''} onChange={(e) => setField('NUM_OF_CHILDREN', e.target.value === '' ? null : Number(e.target.value))} />
          <TextField margin="normal" fullWidth label="Blood Type" name="BLOOD_TYPE" value={form.BLOOD_TYPE || ''} onChange={(e) => setField('BLOOD_TYPE', e.target.value)} />
        </>);
      case 3:
        return (<>
          <TextField margin="normal" fullWidth label="National ID (CIN)" name="NUM_CIN" value={form.NUM_CIN || ''} onChange={(e) => setField('NUM_CIN', e.target.value)} />
          <TextField margin="normal" fullWidth label="Issuing Authority (CIN)" name="ISSUING_AUTH" value={form.ISSUING_AUTH || ''} onChange={(e) => setField('ISSUING_AUTH', e.target.value)} />
          <TextField margin="normal" fullWidth label="Passport Number" name="PASSPORT_NUM" value={form.PASSPORT_NUM || ''} onChange={(e) => setField('PASSPORT_NUM', e.target.value)} />
          <TextField margin="normal" fullWidth label="Passport Issuing Authority" name="PASSPORT_ISSUING_AUTH" value={form.PASSPORT_ISSUING_AUTH || ''} onChange={(e) => setField('PASSPORT_ISSUING_AUTH', e.target.value)} />
          <TextField margin="normal" fullWidth label="Driver's License Number" name="DRIVER_LIC_NUM" value={form.DRIVER_LIC_NUM || ''} onChange={(e) => setField('DRIVER_LIC_NUM', e.target.value)} />
          <TextField margin="normal" fullWidth label="National Number" name="NUM_NATIONAL" value={form.NUM_NATIONAL || ''} onChange={(e) => setField('NUM_NATIONAL', e.target.value)} />
        </>);
      case 4:
        return (<>
          <TextField margin="normal" fullWidth label="Bank Account Number" name="ACCOUNT_NUMBER" value={form.ACCOUNT_NUMBER || ''} onChange={(e) => setField('ACCOUNT_NUMBER', e.target.value)} />
          <TextField margin="normal" fullWidth label="Bank" name="BANK" type="number" value={form.BANK || ''} onChange={(e) => setField('BANK', e.target.value === '' ? null : Number(e.target.value))} />
          <TextField margin="normal" fullWidth label="Finance Number" name="FINANCE_NUM" value={form.FINANCE_NUM || ''} onChange={(e) => setField('FINANCE_NUM', e.target.value)} />
          <TextField margin="normal" fullWidth label="Type of Insurance" name="TYPE_OF_INSURANCE" value={form.TYPE_OF_INSURANCE || ''} onChange={(e) => setField('TYPE_OF_INSURANCE', e.target.value)} />
          <TextField margin="normal" fullWidth label="Insurance Number" name="NUM_OF_INSURANCE" value={form.NUM_OF_INSURANCE || ''} onChange={(e) => setField('NUM_OF_INSURANCE', e.target.value)} />
        </>);
      case 5:
        return (<>
          <TextField margin="normal" fullWidth label="Basic Salary" name="BASIC_SALARY" type="number" value={form.BASIC_SALARY || ''} onChange={(e) => setField('BASIC_SALARY', e.target.value === '' ? null : Number(e.target.value))} />
          <TextField margin="normal" fullWidth label="Food Allowance" name="FOOD_ALLOWANCE" type="number" value={form.FOOD_ALLOWANCE || ''} onChange={(e) => setField('FOOD_ALLOWANCE', e.target.value === '' ? null : Number(e.target.value))} />
          <TextField margin="normal" fullWidth label="Fuel Allowance" name="FUEL" type="number" value={form.FUEL || ''} onChange={(e) => setField('FUEL', e.target.value === '' ? null : Number(e.target.value))} />
          <TextField margin="normal" fullWidth label="Communication Allowance" name="COMMUNICATION" type="number" value={form.COMMUNICATION || ''} onChange={(e) => setField('COMMUNICATION', e.target.value === '' ? null : Number(e.target.value))} />
        </>);
      case 6:
        return (<>
          <TextField margin="normal" fullWidth label="Address" name="ADDRESS" multiline rows={3} value={form.ADDRESS || ''} onChange={(e) => setField('ADDRESS', e.target.value)} />
          <TextField margin="normal" fullWidth label="Comments" name="COMMENT" multiline rows={3} value={form.COMMENT || ''} onChange={(e) => setField('COMMENT', e.target.value)} />
          <TextField margin="normal" fullWidth label="Medical Comments" name="MEDICAL_COMMENT" multiline rows={3} value={form.MEDICAL_COMMENT || ''} onChange={(e) => setField('MEDICAL_COMMENT', e.target.value)} />
          <FormControlLabel control={<Switch checked={form.STATE || false} onChange={(e) => setForm({ ...form, STATE: e.target.checked })} name="STATE" color="primary" />} label={form.STATE ? 'Active' : 'Inactive'} />
          <FormControlLabel control={<Switch checked={form.IS_FOREINGHT || false} onChange={(e) => setForm({ ...form, IS_FOREINGHT: e.target.checked })} name="IS_FOREINGHT" color="primary" />} label="Is Foreigner" />
          <FormControlLabel control={<Switch checked={form.FINGERPRINT_NEEDED || false} onChange={(e) => setForm({ ...form, FINGERPRINT_NEEDED: e.target.checked })} name="FINGERPRINT_NEEDED" color="primary" />} label="Fingerprint Required" />
        </>);
      case 7:
        return (<>
          <TextField margin="normal" fullWidth label="Job Description" name="JOB_DESCRIPTION" multiline rows={3} value={form.JOB_DESCRIPTION || ''} onChange={(e) => setField('JOB_DESCRIPTION', e.target.value)} />
          <TextField margin="normal" fullWidth label="Preferred Language" name="PREFERRED_LANG" value={form.PREFERRED_LANG || ''} onChange={(e) => setField('PREFERRED_LANG', e.target.value)} />
          <TextField margin="normal" fullWidth label="Outfit Number" name="OUTFIT_NUM" value={form.OUTFIT_NUM || ''} onChange={(e) => setField('OUTFIT_NUM', e.target.value)} />
          <TextField margin="normal" fullWidth label="Footwear Number" name="FOOTWEAR_NUM" value={form.FOOTWEAR_NUM || ''} onChange={(e) => setField('FOOTWEAR_NUM', e.target.value)} />
        </>);
      default:
        return <div>Step {step + 1}</div>;
    }
  }
};

export default Employees;
