import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addDays } from "date-fns";
import { createLeaveRequest, getLeaveTypes } from "../../services/leaveService";

interface LeaveTypeOption {
  int_can: number;
  desig_can: string;
  code: string;
  max_day?: number | null;
}

interface LeaveRequestForm {
  leaveCode: number | ""; // <- will be TS_Codes.int_can
  startDate: Date | null;
  endDate: Date | null;
  reason: string;
  contactNumber: string;
}
const isFriday = (d: Date) => d.getDay() === 5; // PDF: Fridays off

const LeaveRequestScreen: React.FC<{ employeeId?: number | string }> = ({
  employeeId,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<LeaveRequestForm>({
    leaveCode: "",
    startDate: null,
    endDate: null,
    reason: "",
    contactNumber: "",
  });
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [calculatedDays, setCalculatedDays] = useState<number>(0);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setLoading(true);
        // Expecting TS_Codes: [{ int_can, desig_can, code, max_day, ... }]
        const types = await getLeaveTypes(); // array of raw rows you pasted
        setLeaveTypes(Array.isArray(types) ? types : []);
      } catch (err) {
        setError(t("leave.request.fetchError"));
        console.error("Error fetching leave types:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveTypes();
  }, [t]);

  // Calculate working days excluding Fridays (client-side approximation; server does the definitive calc)
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = formData.startDate;
      const end = formData.endDate;

      if (start > end) {
        setCalculatedDays(0);
        return;
      }

      let count = 0;
      let current = new Date(start);
      while (current <= end) {
        if (!isFriday(current)) count++;
        current = addDays(current, 1);
      }
      setCalculatedDays(count);
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof LeaveRequestForm]: value,
    }));
  };

  const handleDateChange = (
    name: keyof LeaveRequestForm,
    date: Date | null
  ) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (
      !formData.leaveCode ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      setError(t("leave.request.validation.required"));
      return;
    }
    if (formData.startDate > formData.endDate) {
      setError(t("leave.request.validation.invalidDateRange"));
      return;
    }

    try {
      setSubmitting(true);

      await createLeaveRequest({
        employeeId: String(employeeId ?? ""),
        // Resolve the selected leave type row to get the code string expected by BE
        leaveType: (leaveTypes.find((lt) => lt.int_can === Number(formData.leaveCode))?.code) || String(formData.leaveCode),
        leaveCode: Number(formData.leaveCode),
        startDate: formData.startDate!.toISOString().split("T")[0],
        endDate: formData.endDate!.toISOString().split("T")[0],
        reason: formData.reason,
        contactNumber: formData.contactNumber,
        days: calculatedDays,
      });

      setSuccess(true);
      setFormData({
        leaveCode: "",
        startDate: null,
        endDate: null,
        reason: "",
        contactNumber: "",
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err?.message || t("leave.request.submitError"));
      console.error("Error submitting leave request:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {error && (
            <Grid>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          {success && (
            <Grid>
              <Alert severity="success">{t("leave.request.success")}</Alert>
            </Grid>
          )}

          <Grid>
            <FormControl fullWidth required>
              <InputLabel id="leave-type-label">
                {t("leave.request.leaveType")}
              </InputLabel>
              <Select
                labelId="leave-type-label"
                name="leaveCode"
                value={formData.leaveCode}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    leaveCode: Number((e.target as any).value),
                  }))
                }
                label={t("leave.request.leaveType")}
              >
                {leaveTypes.map((lt) => (
                  <MenuItem key={lt.int_can} value={lt.int_can}>
                    {lt.code ? `${lt.code} — ${lt.desig_can}` : lt.desig_can}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t("leave.request.startDate")}
                value={formData.startDate}
                onChange={(date) => handleDateChange("startDate", date)}
                minDate={new Date()}
                shouldDisableDate={isFriday}
              />
            </LocalizationProvider>
          </Grid>

          <Grid>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t("leave.request.endDate")}
                value={formData.endDate}
                onChange={(date) => handleDateChange("endDate", date)}
                minDate={formData.startDate || new Date()}
                shouldDisableDate={isFriday}
              />
            </LocalizationProvider>
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label={t("leave.request.contactNumber")}
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              multiline
              rows={4}
              label={t("leave.request.reason")}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>

          <Grid>
            <Divider sx={{ my: 2 }} />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                {t("leave.request.daysRequested")}: {calculatedDays}
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || calculatedDays === 0}
                startIcon={
                  submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {submitting
                  ? t("common.submitting")
                  : t("leave.request.submit")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default LeaveRequestScreen;
