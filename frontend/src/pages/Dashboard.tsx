import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box
} from '@mui/material';
import {
  Architecture,
  Agriculture,
  ShowChart,
  AccountBalance
} from '@mui/icons-material';

interface MenuItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, description, icon, path }) => {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardActionArea onClick={() => navigate(path)}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" p={2}>
              {icon}
              <Typography variant="h6" component="h2" align="center" gutterBottom>
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                {description}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

const Dashboard: React.FC = () => {
  const menuItems: MenuItemProps[] = [
    {
      title: '設備計画',
      description: '土地情報から最適な設備設計を提案',
      icon: <Architecture fontSize="large" color="primary" />,
      path: '/facility-planning'
    },
    {
      title: '生産計画',
      description: '野菜と魚の最適な組み合わせを提案',
      icon: <Agriculture fontSize="large" color="secondary" />,
      path: '/production-planning'
    },
    {
      title: '販売計画',
      description: '生産量から売上予測を算出',
      icon: <ShowChart fontSize="large" color="primary" />,
      path: '/sales-planning'
    },
    {
      title: '損益・投資計画',
      description: '5年分の損益計算と投資回収計画',
      icon: <AccountBalance fontSize="large" color="secondary" />,
      path: '/financial-planning'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          アクアポニックス シミュレーター
        </Typography>
        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
