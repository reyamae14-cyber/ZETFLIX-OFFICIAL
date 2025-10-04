import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  useTheme
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import AnalyticsIcon from '@mui/icons-material/Analytics'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

const AnalyticsCharts = ({ analytics }) => {
  const theme = useTheme()

  // Weekly Watch Time Chart with Movie/TV Series breakdown
  const weeklyWatchTimeData = {
    labels: ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'],
    datasets: [
      {
        label: 'MOVIE',
        data: analytics?.weeklyMovieTime || [0.6, 0.3, 0.4, 0.2, 0.5, 0.7, 0.8],
        backgroundColor: 'transparent',
        borderColor: '#ff4444',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#ff4444',
        pointBorderColor: '#ff4444',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#ff4444',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      },
      {
        label: 'TV SERIES',
        data: analytics?.weeklyTvTime || [0.2, 0.4, 0.3, 0.6, 0.4, 0.3, 0.5],
        backgroundColor: 'transparent',
        borderColor: '#4444ff',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#4444ff',
        pointBorderColor: '#4444ff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#4444ff',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      }
    ]
  }

  // Genre Distribution Chart
  const genreDistributionData = {
    labels: analytics?.genreDistribution?.map(item => item.type) || ['Movies', 'TV Shows'],
    datasets: [
      {
        data: analytics?.genreDistribution?.map(item => item.count) || [0, 0],
        backgroundColor: [
          `${theme.palette.secondary.main}E6`,
          `${theme.palette.info.main}E6`,
        ],
        borderColor: [
          theme.palette.secondary.main,
          theme.palette.info.main,
        ],
        borderWidth: 0,
        hoverBackgroundColor: [
          theme.palette.secondary.main,
          theme.palette.info.main,
        ],
        hoverBorderColor: [
          theme.palette.secondary.dark,
          theme.palette.info.dark,
        ],
        hoverBorderWidth: 3,
        hoverOffset: 8,
      }
    ]
  }

  // Device Usage Data - Total hours logged in per device
  const deviceUsageStats = analytics?.deviceUsage || [
    { device: 'Desktop', hours: 24.5, sessions: 15 },
    { device: 'Mobile', hours: 18.7, sessions: 22 },
    { device: 'Tablet', hours: 8.3, sessions: 8 }
  ];

  // User Preference Data - Movies vs TV Shows with percentages
  const userPreferenceStats = analytics?.genreDistribution || [
    { type: 'Movies', count: 65, percentage: 65 },
    { type: 'TV Series', count: 35, percentage: 35 }
  ];

  const moviePercentage = userPreferenceStats.find(item => item.type === 'Movies')?.percentage || 65;
  const tvPercentage = userPreferenceStats.find(item => item.type === 'TV Series' || item.type === 'TV Shows')?.percentage || 35;

  // Dynamic color calculation based on percentage
  const getColorByPercentage = (percentage) => {
    if (percentage >= 80) return '#4caf50'; // Green for high percentage
    if (percentage >= 60) return '#ff9800'; // Orange for medium-high percentage
    if (percentage >= 40) return '#2196f3'; // Blue for medium percentage
    if (percentage >= 20) return '#ff5722'; // Red-orange for low-medium percentage
    return '#f44336'; // Red for low percentage
  };

  const movieColor = getColorByPercentage(moviePercentage);
  const tvColor = getColorByPercentage(tvPercentage);

  // Daily Activity Chart
  const dailyActivityData = {
    labels: analytics?.dailyActivity?.map(item => item.day) || [],
    datasets: [
      {
        label: 'Active Users',
        data: analytics?.dailyActivity?.map(item => item.users) || [],
        backgroundColor: `${theme.palette.info.main}33`,
        borderColor: theme.palette.info.main,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: theme.palette.info.main,
        pointBorderColor: theme.palette.info.dark,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: theme.palette.info.dark,
        pointHoverBorderColor: theme.palette.common.white,
        pointHoverBorderWidth: 3,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default') {
          delay = context.dataIndex * 100;
        }
        return delay;
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 12,
            weight: '500'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11
          }
        },
        grid: {
          color: `${theme.palette.divider}40`,
          lineWidth: 0.5
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11
          }
        },
        grid: {
          color: `${theme.palette.divider}40`,
          lineWidth: 0.5
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    interaction: {
      intersect: false
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 12,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    borderWidth: 0,
    hoverBorderWidth: 3
  }

  return (
    <Paper elevation={3} sx={{ 
      p: { xs: 1, sm: 1.5, md: 2 }, 
      mt: { xs: 2, sm: 2.5, md: 3 }, 
      borderRadius: { xs: 1.5, sm: 2, md: 2.5 } 
    }}>
      <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 1.5, md: 2 }}>
        <AnalyticsIcon sx={{ 
          mr: { xs: 0.5, sm: 0.75, md: 1 }, 
          color: theme.palette.primary.main,
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
        }} />
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' }
        }}>
          Analytics Dashboard
        </Typography>
      </Box>
      
      <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
        {/* Device Usage - Total Hours Logged */}
        <Grid item xs={6} sm={6} md={6}>
          <Paper elevation={1} sx={{ 
            p: { xs: 0.75, sm: 1, md: 1.5 }, 
            height: { xs: 150, sm: 200, md: 250 }, 
            borderRadius: { xs: 1, sm: 1.5, md: 2 } 
          }}>
            <Typography variant="subtitle1" sx={{ 
              mb: { xs: 1, sm: 1.5, md: 2 }, 
              fontWeight: 'bold',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
            }}>
              Device Usage
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 1, sm: 1.5, md: 2 },
              height: { xs: 110, sm: 150, md: 190 },
              justifyContent: 'center'
            }}>
              {deviceUsageStats.map((device, index) => {
                const colors = ['#4caf50', '#ff9800', '#f44336'];
                return (
                  <Box key={device.device} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: { xs: 0.5, sm: 0.75, md: 1 },
                    borderRadius: 1,
                    backgroundColor: `${colors[index]}15`,
                    border: `1px solid ${colors[index]}30`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: { xs: 8, sm: 10, md: 12 }, 
                        height: { xs: 8, sm: 10, md: 12 }, 
                        borderRadius: '50%', 
                        backgroundColor: colors[index] 
                      }} />
                      <Typography variant="body2" sx={{ 
                        fontWeight: '500',
                        fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' }
                      }}>
                        {device.device}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        color: colors[index],
                        fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' }
                      }}>
                        {device.hours}h
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: 'text.secondary',
                        fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem' }
                      }}>
                        {device.sessions} sessions
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        {/* Monthly User Preference - Movies vs TV Shows with Circular Charts */}
        <Grid item xs={6} sm={6} md={6}>
          <Paper elevation={1} sx={{ 
            p: { xs: 0.75, sm: 1, md: 1.5 }, 
            height: { xs: 150, sm: 200, md: 250 }, 
            borderRadius: { xs: 1, sm: 1.5, md: 2 } 
          }}>
            <Typography variant="subtitle1" sx={{ 
              mb: { xs: 0.5, sm: 1, md: 1.5 }, 
              fontWeight: 'bold',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
            }}>
              Monthly User Preference
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-around',
              height: { xs: 110, sm: 150, md: 190 },
              gap: { xs: 1, sm: 1.5, md: 2 }
            }}>
              {/* Movies Circular Chart */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1, md: 1.5 }
              }}>
                <Box sx={{ 
                  position: 'relative',
                  width: { xs: 70, sm: 90, md: 110 },
                  height: { xs: 70, sm: 90, md: 110 },
                  borderRadius: '50%',
                  background: `conic-gradient(${movieColor} 0deg ${moviePercentage * 3.6}deg, #333 ${moviePercentage * 3.6}deg 360deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    width: { xs: 55, sm: 70, md: 85 },
                    height: { xs: 55, sm: 70, md: 85 },
                    borderRadius: '50%',
                    backgroundColor: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold',
                      color: movieColor,
                      fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' }
                    }}>
                      {moviePercentage}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ 
                    width: { xs: 8, sm: 10, md: 12 }, 
                    height: { xs: 8, sm: 10, md: 12 }, 
                    borderRadius: '50%', 
                    backgroundColor: movieColor 
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                  }}>
                    Movies
                  </Typography>
                </Box>
              </Box>

              {/* TV Series Circular Chart */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1, md: 1.5 }
              }}>
                <Box sx={{ 
                  position: 'relative',
                  width: { xs: 70, sm: 90, md: 110 },
                  height: { xs: 70, sm: 90, md: 110 },
                  borderRadius: '50%',
                  background: `conic-gradient(${tvColor} 0deg ${tvPercentage * 3.6}deg, #333 ${tvPercentage * 3.6}deg 360deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    width: { xs: 55, sm: 70, md: 85 },
                    height: { xs: 55, sm: 70, md: 85 },
                    borderRadius: '50%',
                    backgroundColor: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold',
                      color: tvColor,
                      fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' }
                    }}>
                      {tvPercentage}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ 
                    width: { xs: 8, sm: 10, md: 12 }, 
                    height: { xs: 8, sm: 10, md: 12 }, 
                    borderRadius: '50%', 
                    backgroundColor: tvColor 
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                  }}>
                    TV Series
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Weekly Watch Time */}
        <Grid item xs={6} sm={6} md={6}>
          <Paper elevation={1} sx={{ 
            p: { xs: 0.75, sm: 1, md: 1.5 }, 
            height: { xs: 150, sm: 200, md: 250 }, 
            borderRadius: { xs: 1, sm: 1.5, md: 2 } 
          }}>
            <Typography variant="subtitle1" sx={{ 
              mb: { xs: 0.5, sm: 1, md: 1.5 }, 
              fontWeight: 'bold',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
            }}>
              Weekly Watch Time
            </Typography>
            <Box sx={{ height: { xs: 110, sm: 150, md: 190 } }}>
              <Line data={weeklyWatchTimeData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Daily Activity */}
        <Grid item xs={6} sm={6} md={6}>
          <Paper elevation={1} sx={{ 
            p: { xs: 0.75, sm: 1, md: 1.5 }, 
            height: { xs: 150, sm: 200, md: 250 }, 
            borderRadius: { xs: 1, sm: 1.5, md: 2 } 
          }}>
            <Typography variant="subtitle1" sx={{ 
              mb: { xs: 0.5, sm: 1, md: 1.5 }, 
              fontWeight: 'bold',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
            }}>
              Daily Activity (Last 7 Days)
            </Typography>
            <Box sx={{ height: { xs: 110, sm: 150, md: 190 } }}>
              <Line data={dailyActivityData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default AnalyticsCharts