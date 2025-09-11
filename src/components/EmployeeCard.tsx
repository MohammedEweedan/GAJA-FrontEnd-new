import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import WorkOutline from '@mui/icons-material/WorkOutline';
import LocalAtmOutlined from '@mui/icons-material/LocalAtmOutlined';

// Minimal shape expected from an Employee record
export type MinimalEmployee = {
  ID_EMP?: number;
  NAME: string;
  TITLE?: string | null;
  EMAIL?: string | null;
  PHONE?: string | null;
  STATE?: boolean | null;
  PICTURE_URL?: string | null;
  PS?: string | null; // point of sale id or name (string in your model)
  BASIC_SALARY?: number | null;
  CONTRACT_START?: string | null;
  CONTRACT_END?: string | null;
};

export type EmployeeCardProps<T extends MinimalEmployee = MinimalEmployee> = {
  employee: T;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  /** Compact spacing */
  dense?: boolean;
  /** Optional map of Point-of-Sale id -> label for display */
  posLabelMap?: Map<number, string> | Record<string, string>;
};

const initials = (name?: string | null) =>
  name ? name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase() : '';

const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString() : '—');
const fmtMoney = (n?: number | null) =>
  n == null ? '—' : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export const EmployeeCard = <T extends MinimalEmployee>({
  employee: e,
  onEdit,
  onDelete,
  dense = false,
  posLabelMap,
}: EmployeeCardProps<T>) => {
  const posLabel = React.useMemo(() => {
    if (!e.PS) return undefined;
    if (posLabelMap instanceof Map) {
      const n = Number(e.PS);
      return posLabelMap.get(Number.isNaN(n) ? (e.PS as any) : n) || String(e.PS);
    }
    if (posLabelMap && typeof posLabelMap === 'object') {
      // try both numeric and string keys
      return (posLabelMap as any)[e.PS] || (posLabelMap as any)[String(e.PS)] || String(e.PS);
    }
    return String(e.PS);
  }, [e.PS, posLabelMap]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: dense ? 1.25 : 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        bgcolor: 'background.paper',
        transition: (t) => t.transitions.create(['box-shadow', 'transform'], { duration: t.transitions.duration.shorter }),
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)'
        },
        cursor: 'pointer',
      }}
    >
      {/* Action buttons */}
      <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); onEdit(e); }}>
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={(ev) => { ev.stopPropagation(); onDelete(e); }}>
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Header */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar src={e.PICTURE_URL || undefined} sx={{ width: dense ? 40 : 52, height: dense ? 40 : 52 }}>
          {initials(e.NAME)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant={dense ? 'subtitle1' : 'h6'} fontWeight={800} noWrap>
            {e.NAME}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {e.TITLE || '—'}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.75 }}>
            {e.STATE != null && (
              <Chip size="small" color={e.STATE ? 'success' : 'default'} label={e.STATE ? 'Active' : 'Inactive'} />
            )}
            {e.PS && <Chip size="small" variant="outlined" label={posLabel || e.PS} />}
          </Stack>
        </Box>
      </Stack>

      {/* Details */}
      <Divider sx={{ my: dense ? 1 : 1.5 }} />
      <Stack spacing={0.75}>
        <Row icon={<EmailOutlined fontSize="small" />} value={e.EMAIL} />
        <Row icon={<PhoneOutlined fontSize="small" />} value={e.PHONE} />
        <Row icon={<WorkOutline fontSize="small" />} value={`${fmtDate(e.CONTRACT_START)} → ${fmtDate(e.CONTRACT_END)}`} />
        <Row icon={<LocalAtmOutlined fontSize="small" />} value={fmtMoney(e.BASIC_SALARY)} />
        {/* Optional POS second line */}
        {/* <Row icon={<PlaceOutlined fontSize="small" />} value={posLabel || e.PS} /> */}
      </Stack>
    </Paper>
  );
};

const Row: React.FC<{ icon: React.ReactNode; value?: string | null }> = ({ icon, value }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
    <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
    <Typography variant="body2" fontWeight={600} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {value || '—'}
    </Typography>
  </Stack>
);

export default EmployeeCard;
