import React, { useState, useEffect, ReactNode, SyntheticEvent } from 'react';
import financialService, { IFinancialPlan, IFinancialSummary } from '../services/financialService';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Tabs,
  Tab
} from '@mui/material';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }: TabPanelProps) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const FinancialPlanning: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [financialPlans, setFinancialPlans] = useState<IFinancialPlan[]>([]);
  const [summary, setSummary] = useState<IFinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, summaryData] = await Promise.all([
          financialService.getAllFinancials(),
          financialService.getFinancialSummary()
        ]);
        setFinancialPlans(plansData);
        setSummary(summaryData);
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error('Error fetching financial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateProfitLoss = (plan: IFinancialPlan) => {
    return plan.revenue.actual - plan.actualExpenses.total;
  };

  const calculateCumulativeProfit = (plans: IFinancialPlan[]) => {
    return plans.reduce((total, plan) => total + calculateProfitLoss(plan), 0);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box py={4} display="flex" justifyContent="center">
          <Typography>データを読み込み中...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box py={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  const renderProfitLossStatement = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>項目</TableCell>
            {financialPlans.map((plan: IFinancialPlan) => (
              <TableCell key={plan._id} align="right">
                {new Date(plan.period.startDate).toLocaleDateString()}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>売上高</TableCell>
            {financialPlans.map((plan: IFinancialPlan) => (
              <TableCell key={plan._id} align="right">
                {formatCurrency(plan.revenue.actual)}
              </TableCell>
            ))}
          </TableRow>
          {(Object.entries(financialPlans[0]?.actualExpenses.categories || {}) as [keyof IFinancialPlan['actualExpenses']['categories'], number][]).map(([key]) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              {financialPlans.map((plan: IFinancialPlan) => (
                <TableCell key={plan._id} align="right">
                  {formatCurrency(plan.actualExpenses.categories[key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>当期損益</TableCell>
            {financialPlans.map((plan: IFinancialPlan) => (
              <TableCell key={plan._id} align="right" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(calculateProfitLoss(plan))}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderInvestmentRecovery = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>年</TableCell>
            <TableCell align="right">当期損益</TableCell>
            <TableCell align="right">累積損益</TableCell>
            <TableCell>投資回収状況</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {financialPlans.map((plan: IFinancialPlan, index: number) => {
            const yearlyProfit = calculateProfitLoss(plan);
            const cumulativeProfit = calculateCumulativeProfit(financialPlans.slice(0, index + 1));
            return (
              <TableRow key={plan._id}>
                <TableCell>{new Date(plan.period.startDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">{formatCurrency(yearlyProfit)}</TableCell>
                <TableCell align="right">{formatCurrency(cumulativeProfit)}</TableCell>
                <TableCell>
                  {cumulativeProfit >= 0
                    ? '投資回収完了'
                    : `残り${formatCurrency(Math.abs(cumulativeProfit))}`}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          損益・投資計画
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  総収益
                </Typography>
                <Typography variant="h4" color="primary">
                  {summary ? formatCurrency(summary.totalRevenue) : '-'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  総支出
                </Typography>
                <Typography variant="h4" color="error">
                  {summary ? formatCurrency(summary.totalExpenses) : '-'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  平均ROI
                </Typography>
                <Typography variant="h4" color="success">
                  {summary ? `${(summary.averageROI * 100).toFixed(1)}%` : '-'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_: SyntheticEvent, newValue: number) => setTabValue(newValue)}
            aria-label="financial planning tabs"
          >
            <Tab label="損益計算書" />
            <Tab label="投資回収計画" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderProfitLossStatement()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderInvestmentRecovery()}
        </TabPanel>
      </Box>
    </Container>
  );
};

export default FinancialPlanning;
