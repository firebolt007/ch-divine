import React, { useState } from 'react';
import { Container, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useGyroscope } from './hooks/useGyroscope';
import { useCoinToss } from './hooks/useCoinToss';
import InitialScreen from './components/InitialScreen';
import CoinTossScreen from './components/CoinTossScreen';
import ResultScreen from './components/ResultScreen';

const CyberDivination3 = () => {
  // 基本状态
  const [currentStep, setCurrentStep] = useState(0); // 0: 初始状态, 1-6: 掷硬币步骤
  const [lines, setLines] = useState([]); // 存储爻的结果
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 掷硬币逻辑 - 必须先定义，因为useGyroscope中用到了handleShakeToss
  const {
    isFlipping,
    setIsFlipping,
    processCoinToss,
    handleShakeToss,
    manualThrowCoin,
    completeHexagram
  } = useCoinToss({
    currentStep,
    setCurrentStep,
    lines,
    setLines,
    setCompleted,
    setResult,
    setSnackbarMessage,
    setSnackbarOpen
  });

  // 陀螺仪钩子
  const { 
    gyroscopeAvailable, 
    acceleration, 
    permissionStatus, 
    shakeDetected,
    setShakeDetected,
    requestGyroscopePermission 
  } = useGyroscope({
    onShake: handleShakeToss,
    isFlipping,
    currentStep,
    setSnackbarMessage,
    setSnackbarOpen
  });

  // 开始新的算命
  const startDivination = () => {
    setLines([]);
    setCurrentStep(1);
    setCompleted(false);
    setResult(null);
    
    // 如果尚未请求陀螺仪权限，则请求
    if (gyroscopeAvailable && permissionStatus === 'idle') {
      // iOS需要在用户交互事件中直接调用权限请求
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isIOS) {
        setSnackbarMessage('iOS设备：正在请求陀螺仪权限...');
        setSnackbarOpen(true);
        
        // 给一个短暂延迟，让用户看到提示
        setTimeout(() => {
          requestGyroscopePermission();
        }, 500);
      } else {
        requestGyroscopePermission();
      }
    } else if (permissionStatus === 'denied') {
      setSnackbarMessage('将使用虚拟掷硬币模式。点击"掷硬币"按钮继续。');
      setSnackbarOpen(true);
    } else if (permissionStatus === 'granted') {
      setSnackbarMessage('请摇动手机掷硬币！');
      setSnackbarOpen(true);
    }
  };

  // 重置应用
  const resetApp = () => {
    setLines([]);
    setCurrentStep(0);
    setCompleted(false);
    setResult(null);
  };

  // 处理Snackbar关闭
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          赛博算命
        </Typography>
        
        {currentStep === 0 && (
          <InitialScreen 
            startDivination={startDivination}
            gyroscopeAvailable={gyroscopeAvailable}
          />
        )}
        
        {currentStep > 0 && currentStep <= 6 && (
          <CoinTossScreen 
            currentStep={currentStep}
            isFlipping={isFlipping}
            permissionStatus={permissionStatus}
            lines={lines}
            acceleration={acceleration}
            shakeDetected={shakeDetected}
            manualThrowCoin={manualThrowCoin}
            handleShakeToss={handleShakeToss}
          />
        )}
        
        {completed && (
          <ResultScreen 
            result={result}
            lines={lines}
            resetApp={resetApp}
          />
        )}
        
        {currentStep > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            注意：此算命仅供娱乐，请理性看待。
          </Typography>
        )}
      </Box>
      
      {/* 提示通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CyberDivination3;