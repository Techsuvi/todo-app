// src/components/PremiumPopup.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const PremiumPopup = ({ user, onUpgrade }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show popup if user exists, is free, and hasn't dismissed
    if (user?.plan !== "premium" && localStorage.getItem("premiumDismissed") !== "true") {
      const timer = setTimeout(() => setOpen(true), 2000); // show after 2s
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleDismiss = () => {
    setOpen(false);
    localStorage.setItem("premiumDismissed", "true");
  };


  return (
    <Dialog open={open} onClose={handleDismiss} maxWidth="sm" fullWidth>
      <DialogTitle>🚀 Upgrade to Premium</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Unlock unlimited tasks, cloud sync, and extra themes!
        </Typography>

        {/* Benefits Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Feature</TableCell>
              <TableCell align="center">Free</TableCell>
              <TableCell align="center">Premium</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { feature: "Task Limit", free: "10", premium: "Unlimited" },
              { feature: "Cloud Sync", free: "❌", premium: "✅" },
              { feature: "Extra Themes", free: "❌", premium: "✅" },
              { feature: "Priority Support", free: "❌", premium: "✅" },
              { feature: "AI Todo Support", free: "❌", premium: "✅" },
              { feature: "Ads Free", free: "❌", premium: "✅" },
            ].map((row) => (
              <TableRow key={row.feature}>
                <TableCell>{row.feature}</TableCell>
                <TableCell align="center">{row.free}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(to right, black, yellow)",
                    color: "black",
                  }}
                >
                  {row.premium}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDismiss}>Maybe Later</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onUpgrade?.();
            setOpen(false);
          }}
        >
          Upgrade
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PremiumPopup;
