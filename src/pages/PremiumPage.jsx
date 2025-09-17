// src/pages/PremiumPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import { getUser } from "../services/user"; // mock function to get subscription status
import { useTheme } from "../context/ThemeContext";

// Reusable component for displaying a plan card
const PlanCard = ({ plan, isHighlighted, onUpgrade, theme }) => (
  <Card
    sx={{
      flex: 1,
      borderRadius: 3,
      boxShadow: isHighlighted ? 6 : 3,
      border: isHighlighted ? `2px solid ${theme}` : "none",
      position: "relative",
    }}
  >
    {isHighlighted && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: theme,
          color: "white",
          p: 0.5,
          px: 2,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      >
        <Typography variant="body2">Best Value</Typography>
      </Box>
    )}
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={1}>
        {plan.name}
      </Typography>
      <Typography variant="h4" sx={{ color: theme }} color="primary" fontWeight="bold" mb={1}>
        ₹{plan.price}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Valid for {plan.duration}
      </Typography>
      <Divider />
      <Stack mt={2} spacing={1}>
        {plan.features.map((f, idx) => (
          <Typography key={idx} variant="body2">
            ✔ {f}
          </Typography>
        ))}
      </Stack>
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        sx={{ backgroundColor: theme, "&:hover": { backgroundColor: theme } }}
        fullWidth
        onClick={() => onUpgrade(plan)}
        size="large"
      >
        Upgrade
      </Button>
    </CardActions>
  </Card>
);

const PremiumPage = () => {
  const { theme } = useTheme(); // ✅ Get current theme
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const premiumFeatures = [
    "Unlimited AI Todos",
    "Custom Categories",
    "Priority Support",
    "Dark Mode Access",
    "Export PDFs",
  ];

  const plans = [
    {
      name: "Weekly Plan",
      price: 19,
      duration: "7 days",
      features: premiumFeatures,
    },
    {
      name: "Monthly Plan",
      price: 59,
      duration: "30 days",
      features: premiumFeatures,
      isHighlighted: true,
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await getUser();
        setUser(res);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpgrade = (plan) => {
    alert(
      `You selected ${plan.name} for ₹${plan.price}. Upgrade flow not implemented yet.`
    );
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress sx={{ color: theme }} />
      </Box>
    );
  }

  return (
    <Box maxWidth="900px" mx="auto" p={3}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        ⭐ Upgrade to Premium
      </Typography>

      {user?.isPremium ? (
        // UI for a premium user
        <Box textAlign="center">
          <Typography variant="h6" color="success.main" mb={1}>
            🎉 You are a Premium User!
          </Typography>
          {user.premiumExpiry && (
            <Typography variant="body1" color="text.secondary">
              Your current plan will expire on{" "}
              <Box component="span" fontWeight="bold">
                {user.premiumExpiry}
              </Box>
            </Typography>
          )}
          <Typography variant="body2" mt={2} color="text.secondary">
            Thank you for your support! Enjoy your premium features.
          </Typography>
        </Box>
      ) : (
        // UI for a free user
        <>
          <Typography variant="h6" textAlign="center" mb={3}>
            Unlock a new level of productivity with Premium.
          </Typography>

          {/* Features */}
          <Box mb={4}>
            <Typography variant="h5" mb={2}>
              Premium Features
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {premiumFeatures.map((f, idx) => (
                <Chip
                  key={idx}
                  label={f}
                  sx={{
                    borderColor: theme,
                    color: theme,
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Plans */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="center"
            mb={16} 
          >
            {plans.map((plan, idx) => (
              <PlanCard
                key={idx}
                plan={plan}
                isHighlighted={plan.isHighlighted}
                onUpgrade={handleUpgrade}
                theme={theme} // ✅ pass theme to card
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default PremiumPage;
