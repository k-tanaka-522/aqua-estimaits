import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';

interface ProductPrice {
  product: string;
  wholesalePrice: number;
  directSalePrice: number;
  annualProduction: number;
}

const SalesPlanning: React.FC = () => {
  const [directSaleRatio, setDirectSaleRatio] = useState<number>(30);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const products: ProductPrice[] = [
    {
      product: 'レタス',
      wholesalePrice: 300,
      directSalePrice: 500,
      annualProduction: 3840 // 100m² * 16株/m² * 8回/年 * 0.3kg
    },
    {
      product: 'ティラピア',
      wholesalePrice: 800,
      directSalePrice: 1500,
      annualProduction: 600 // 30m³ * 20尾/m³ * 2回/年 * 0.5kg
    }
  ];

  useEffect(() => {
    const calculateRevenue = () => {
      const revenue = products.reduce((total, product) => {
        const directSaleVolume = product.annualProduction * (directSaleRatio / 100);
        const wholesaleVolume = product.annualProduction * ((100 - directSaleRatio) / 100);
        
        return total + 
          (directSaleVolume * product.directSalePrice) +
          (wholesaleVolume * product.wholesalePrice);
      }, 0);
      
      setTotalRevenue(revenue);
    };

    calculateRevenue();
  }, [directSaleRatio]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          販売計画
        </Typography>

        <Grid container spacing={4}>
          {/* 直売比率設定 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                直売比率の設定
              </Typography>
              <Box sx={{ px: 3 }}>
                <Typography gutterBottom>
                  直売比率: {directSaleRatio}%
                </Typography>
                <Slider
                  value={directSaleRatio}
                  onChange={(_, value) => setDirectSaleRatio(value as number)}
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                />
              </Box>
            </Paper>
          </Grid>

          {/* 販売単価表 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                販売単価
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>商品</TableCell>
                      <TableCell align="right">卸売価格</TableCell>
                      <TableCell align="right">直売価格</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.product}>
                        <TableCell>{product.product}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(product.wholesalePrice)}/kg
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(product.directSalePrice)}/kg
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* 年間売上予測 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                年間売上予測
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>商品</TableCell>
                      <TableCell align="right">生産量</TableCell>
                      <TableCell align="right">直売量</TableCell>
                      <TableCell align="right">卸売量</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.product}>
                        <TableCell>{product.product}</TableCell>
                        <TableCell align="right">
                          {product.annualProduction.toLocaleString()} kg
                        </TableCell>
                        <TableCell align="right">
                          {(product.annualProduction * directSaleRatio / 100).toLocaleString()} kg
                        </TableCell>
                        <TableCell align="right">
                          {(product.annualProduction * (100 - directSaleRatio) / 100).toLocaleString()} kg
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* 売上サマリー */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  年間売上予測サマリー
                </Typography>
                <Typography variant="h4" align="center" color="primary">
                  {formatCurrency(totalRevenue)}
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary">
                  直売比率 {directSaleRatio}% での予測売上高
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SalesPlanning;
