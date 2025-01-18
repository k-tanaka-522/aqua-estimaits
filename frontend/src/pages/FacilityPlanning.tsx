import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent
} from '@mui/material';

interface LandInfo {
  width: number;
  length: number;
  location: string;
  soilType: string;
}

interface FacilityEstimate {
  greenhouseType: string;
  size: number;
  beds: number;
  tanks: number;
  cost: number;
}

const FacilityPlanning: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [landInfo, setLandInfo] = useState<LandInfo>({
    width: 0,
    length: 0,
    location: '',
    soilType: ''
  });
  const [estimate, setEstimate] = useState<FacilityEstimate | null>(null);

  const steps = ['土地情報入力', '設備提案', '見積確認'];

  const handleLandInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to calculate facility estimate
    setEstimate({
      greenhouseType: 'プロフェッショナルグリーンハウス',
      size: landInfo.width * landInfo.length,
      beds: Math.floor((landInfo.width * landInfo.length * 0.7) / 10),
      tanks: Math.floor((landInfo.width * landInfo.length * 0.2) / 20),
      cost: landInfo.width * landInfo.length * 50000
    });
    setActiveStep(1);
  };

  const renderLandInfoForm = () => (
    <Paper component="form" onSubmit={handleLandInfoSubmit} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            土地情報を入力してください
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="幅 (m)"
            type="number"
            value={landInfo.width || ''}
            onChange={(e) => setLandInfo({ ...landInfo, width: Number(e.target.value) })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="奥行き (m)"
            type="number"
            value={landInfo.length || ''}
            onChange={(e) => setLandInfo({ ...landInfo, length: Number(e.target.value) })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="所在地"
            value={landInfo.location}
            onChange={(e) => setLandInfo({ ...landInfo, location: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="土地の種類"
            value={landInfo.soilType}
            onChange={(e) => setLandInfo({ ...landInfo, soilType: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            設備を提案する
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderEstimate = () => (
    estimate && (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                推奨設備プラン
              </Typography>
              <Typography variant="body1">
                温室タイプ: {estimate.greenhouseType}
              </Typography>
              <Typography variant="body1">
                設備面積: {estimate.size}㎡
              </Typography>
              <Typography variant="body1">
                栽培ベッド数: {estimate.beds}台
              </Typography>
              <Typography variant="body1">
                水槽数: {estimate.tanks}基
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                概算見積: ¥{estimate.cost.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setActiveStep(2)}
          >
            詳細見積を確認する
          </Button>
        </Grid>
      </Grid>
    )
  );

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          設備計画
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && renderLandInfoForm()}
        {activeStep === 1 && renderEstimate()}
        {activeStep === 2 && (
          <Typography variant="h6" align="center">
            詳細見積準備中...
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default FacilityPlanning;
