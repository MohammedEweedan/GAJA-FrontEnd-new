import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import {} from "@mui/icons-material";
import { format } from "date-fns";
import { getLeaveRequests, getLeaveTypes } from "../../services/leaveService";

type Order = "asc" | "desc";

type ApiRow = {
  int_con?: number | string;
  id?: number | string;
  id_can?: number | string;
  code?: string;
  date_depart?: string;
  date_end?: string;
  nbr_jour?: number;
  state?: string;
  date_creation?: string;
  submittedDate?: string;
  comments?: string;
  COMMENT?: string;
  Cause?: string;
};

type LeaveRequest = {
  id: string | number;
  type: string; // mapped like 'EL - Emergency Leave'
  startDate: string;
  endDate: string;
  days: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  submittedDate: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
};

const LeaveStatusScreen: React.FC<{ employeeId?: number | string }> = ({
  employeeId,
}) => {
  const { t } = useTranslation();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypeMap, setLeaveTypeMap] = useState<Record<string, { code: string; name: string }>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        const [types, data]: [any[], ApiRow[]] = await Promise.all([
          getLeaveTypes(),
          getLeaveRequests(String(employeeId ?? "")),
        ]);

        // Build map { int_can: { code, name } }
        const typeMap: Record<string, { code: string; name: string }> = {};
        (Array.isArray(types) ? types : []).forEach((t: any) => {
          if (t && (t.int_can != null)) {
            typeMap[String(t.int_can)] = { code: String(t.code || ''), name: String(t.desig_can || '') };
          }
        });
        setLeaveTypeMap(typeMap);

        // 'data' is already normalized by the service: { id, type, startDate, endDate, days, status, submittedDate, comments, idCan }
        const normalized: LeaveRequest[] = (Array.isArray(data) ? data : []).map((item: any) => {
          const idCan = item.idCan != null ? String(item.idCan) : undefined;
          const m = idCan ? typeMap[idCan] : undefined;
          const enhancedType = m ? `${m.code} - ${m.name}` : String(item.type ?? "");
          return {
            id: item.id,
            type: enhancedType,
            startDate: item.startDate,
            endDate: item.endDate,
            days: item.days,
            status: item.status as LeaveRequest["status"],
            submittedDate: item.submittedDate,
            comments: item.comments,
          } as LeaveRequest;
        });
        setLeaveRequests(normalized);
      } catch (err) {
        setError(t("leave.status.fetchError"));
        console.error("Error fetching leave requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [t, employeeId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "cancelled":
        return "default";
      default:
        return "warning";
    }
  };

  // Pending (requested time off) only
  const requested = leaveRequests.filter((r) => r.status === "pending");

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
    <Card>
      <CardHeader title={t("leave.status.title")} />
      <CardContent>
        {/* Requested time off */}
        <Box>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("leave.status.type")}</TableCell>
                  <TableCell>{t("leave.status.period")}</TableCell>
                  <TableCell align="right">{t("leave.status.days")}</TableCell>
                  <TableCell>{t("leave.status.submitted")}</TableCell>
                  <TableCell>{t("leave.status.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requested.length ? (
                  requested.map((request) => (
                    <TableRow key={`req-${String(request.id)}`} hover>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        {request.startDate
                          ? format(new Date(request.startDate), "MMM d, yyyy")
                          : "-"}
                        {" "}-{" "}
                        {request.endDate
                          ? format(new Date(request.endDate), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell align="right">{request.days}</TableCell>
                      <TableCell>
                        {request.submittedDate
                          ? format(new Date(request.submittedDate), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`leave.status.${request.status}`)}
                          color={getStatusColor(request.status)}
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() => console.log("Cancel request:", request.id)}
                        >
                          {t("common.cancel")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t("leave.status.noPending", "No pending requests")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LeaveStatusScreen;
