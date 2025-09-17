import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getLeaveBalance } from "../../services/leaveService";
import { format } from "date-fns";

type HistoryRow = {
  int_con?: number;
  id?: number | string;
  id_can?: number | string;
  code?: string;
  date_depart?: string;
  date_end?: string;
  nbr_jour?: number;
  state?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  status?: string;
};

interface LeaveBalanceResponse {
  entitlement: number;
  used: number;
  remaining: number;
  leaveHistory: HistoryRow[];
}

const LeaveBalanceScreen: React.FC<{ employeeId?: number | string }> = ({
  employeeId,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [balance, setBalance] = useState<LeaveBalanceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        setLoading(true);
        const data = await getLeaveBalance(String(employeeId ?? ""));
        setBalance(data);
      } catch (err) {
        setError(t("leave.balance.fetchError"));
        console.error("Error fetching leave balance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveBalance();
  }, [t, employeeId]);

  const mapRow = (r: HistoryRow) => ({
    id: r.int_con ?? r.id,
    type: String(r.code ?? r.id_can ?? ""),
    startDate: r.startDate ?? r.date_depart ?? "",
    endDate: r.endDate ?? r.date_end ?? "",
    days: r.days ?? r.nbr_jour ?? 0,
    status: String(r.status ?? r.state ?? "").toLowerCase(),
  });

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

  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Entitlement */}
        <Grid container>
          <Card sx={{ bgcolor: theme.palette.primary.light, color: "white" }}>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                {balance?.entitlement ?? 0}
              </Typography>
              <Typography variant="h6">
                {t("leave.balance.totalLeaves")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Used */}
        <Grid container>
          <Card sx={{ bgcolor: theme.palette.secondary.light, color: "white" }}>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                {balance?.used ?? 0}
              </Typography>
              <Typography variant="h6">
                {t("leave.balance.usedLeaves")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Remaining */}
        <Grid container>
          <Card sx={{ bgcolor: theme.palette.success.light, color: "white" }}>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                {balance?.remaining ?? 0}
              </Typography>
              <Typography variant="h6">
                {t("leave.balance.remainingLeaves")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* History */}
        <Grid container>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t("leave.balance.leaveHistory")}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("leave.balance.type")}</TableCell>
                      <TableCell>{t("leave.balance.period")}</TableCell>
                      <TableCell align="right">
                        {t("leave.balance.days")}
                      </TableCell>
                      <TableCell>{t("leave.balance.status")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {balance?.leaveHistory?.length ? (
                      balance.leaveHistory.map(mapRow).map((leave) => (
                        <TableRow key={String(leave.id)}>
                          <TableCell>{leave.type}</TableCell>
                          <TableCell>
                            {leave.startDate
                              ? format(new Date(leave.startDate), "MMM d, yyyy")
                              : "-"}{" "}
                            -{" "}
                            {leave.endDate
                              ? format(new Date(leave.endDate), "MMM d, yyyy")
                              : "-"}
                          </TableCell>
                          <TableCell align="right">{leave.days}</TableCell>
                          <TableCell>
                            <Box
                              component="span"
                              sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor:
                                  leave.status === "approved"
                                    ? theme.palette.success.light + 60
                                    : leave.status === "pending"
                                      ? theme.palette.warning.light + 60
                                      : theme.palette.error.light + 60,
                                color:
                                  leave.status === "approved"
                                    ? theme.palette.success.dark
                                    : leave.status === "pending"
                                      ? theme.palette.warning.dark
                                      : theme.palette.error.dark,
                              }}
                            >
                              {t(`leave.status.${leave.status || "pending"}`)}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="textSecondary">
                            {t("leave.status.noRequests")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              /* navigate to request screen */
            }}
          >
            {t("leave.actions.requestLeave")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeaveBalanceScreen;
