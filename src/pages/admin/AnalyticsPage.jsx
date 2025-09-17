import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { getAdminStats } from "../../services/api";

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data.stats);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <Typography>Loading stats...</Typography>;

  const statCards = [
    { title: "Total Users", value: stats.totalUsers },
    { title: "Premium Users", value: stats.premiumUsers },
    { title: "Total Todos", value: stats.totalTodos },
    { title: "Completed Todos", value: stats.completedTodos },
  ];

  return (
    <Grid container spacing={2}>
      {statCards.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <Card>
            <CardContent>
              <Typography variant="h6">{stat.title}</Typography>
              <Typography variant="h4" color="primary">
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsPage;
