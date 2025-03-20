import React from 'react';
import { Typography, Button, Box, Alert } from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

const InitialScreen = ({ startDivination, gyroscopeAvailable }) => {
  // 检测是否为iOS设备
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  return (
    <React.Fragment>
      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        点击按钮开始，然后摇动手机掷硬币六次，揭示你的卦象。
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<PhoneAndroidIcon />}
        onClick={startDivination}
        sx={{ mb: 3 }}
      >
        开始算命
      </Button>
      
      {gyroscopeAvailable && (
        <Box>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
            本应用使用手机陀螺仪感应，请允许动作和方向访问权限。
          </Typography>
          
          {isIOS && (
            <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>iOS设备提示：</strong> 如果权限请求失败，请在Safari浏览器中打开，并在
                <strong>设置 &gt; Safari &gt; 高级 &gt; 网站数据</strong>中确认已启用动作与方向权限。
              </Typography>
            </Alert>
          )}
        </Box>
      )}
    </React.Fragment>
  );
};

export default InitialScreen;