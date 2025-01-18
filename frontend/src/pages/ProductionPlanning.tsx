import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

interface ProductionPlan {
  vegetables: {
    type: string;
    area: number;
    plantsPerSqm: number;
    cyclesPerYear: number;
    yieldPerPlant: number;
    totalYield: number;
  }[];
  fish: {
    type: string;
    tankVolume: number;
    densityPerCubicMeter: number;
    cyclesPerYear: number;
    weightPerFish: number;
    totalYield: number;
  }[];
}

const ProductionPlanning: React.FC = () => {
  const [selectedVegetable, setSelectedVegetable] = useState<string>('レタス');
  const [selectedFish, setSelectedFish] = useState<string>('ティラピア');
  
  // サンプルデータ
  const productionPlan: ProductionPlan = {
    vegetables: [
      {
        type: 'レタス',
        area: 100,
        plantsPerSqm: 16,
        cyclesPerYear: 8,
        yieldPerPlant: 0.3,
        totalYield: 100 * 16 * 8 * 0.3
      }
    ],
    fish: [
      {
        type: 'ティラピア',
        tankVolume: 30,
        densityPerCubicMeter: 20,
        cyclesPerYear: 2,
        weightPerFish: 0.5,
        totalYield: 30 * 20 * 2 * 0.5
      }
    ]
  };

  const vegetableOptions = ['レタス', 'バジル', 'ほうれん草', 'トマト'];
  const fishOptions = ['ティラピア', 'コイ', 'ナマズ', 'トラウト'];

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          生産計画
        </Typography>
        
        <Grid container spacing={4}>
          {/* 作物選択 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                栽培作物の選択
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>野菜の種類</InputLabel>
                <Select
                  value={selectedVegetable}
                  label="野菜の種類"
                  onChange={(e) => setSelectedVegetable(e.target.value)}
                >
                  {vegetableOptions.map((veg) => (
                    <MenuItem key={veg} value={veg}>{veg}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>項目</TableCell>
                      <TableCell align="right">数値</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productionPlan.vegetables.map((veg) => (
                      <React.Fragment key={veg.type}>
                        <TableRow>
                          <TableCell>栽培面積</TableCell>
                          <TableCell align="right">{veg.area} m²</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>栽植密度</TableCell>
                          <TableCell align="right">{veg.plantsPerSqm} 株/m²</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>年間栽培回数</TableCell>
                          <TableCell align="right">{veg.cyclesPerYear} 回</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>1株あたり収量</TableCell>
                          <TableCell align="right">{veg.yieldPerPlant} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>年間予想収量</TableCell>
                          <TableCell align="right">{veg.totalYield} kg</TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* 魚類選択 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                養殖魚の選択
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>魚の種類</InputLabel>
                <Select
                  value={selectedFish}
                  label="魚の種類"
                  onChange={(e) => setSelectedFish(e.target.value)}
                >
                  {fishOptions.map((fish) => (
                    <MenuItem key={fish} value={fish}>{fish}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>項目</TableCell>
                      <TableCell align="right">数値</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productionPlan.fish.map((fish) => (
                      <React.Fragment key={fish.type}>
                        <TableRow>
                          <TableCell>水槽容量</TableCell>
                          <TableCell align="right">{fish.tankVolume} m³</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>飼育密度</TableCell>
                          <TableCell align="right">{fish.densityPerCubicMeter} 尾/m³</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>年間生産回数</TableCell>
                          <TableCell align="right">{fish.cyclesPerYear} 回</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>1尾あたり重量</TableCell>
                          <TableCell align="right">{fish.weightPerFish} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>年間予想生産量</TableCell>
                          <TableCell align="right">{fish.totalYield} kg</TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* 生産予測サマリー */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  年間生産予測サマリー
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      野菜生産量: {productionPlan.vegetables[0].totalYield.toLocaleString()} kg/年
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      魚類生産量: {productionPlan.fish[0].totalYield.toLocaleString()} kg/年
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductionPlanning;
