import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { AnimatedCoins, CoinRenderer, LineRenderer } from './UIElements';
import { getLinePosition } from '../utils/hexagramUtils';

const CoinTossScreen = ({ 
  currentStep, 
  isFlipping, 
  permissionStatus, 
  lines, 
  acceleration, 
  shakeDetected,
  manualThrowCoin,
  handleShakeToss
}) => {
  const debugMode = true; // 控制是否显示调试工具

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 2 }} elevation={2}>
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          正在进行第 {currentStep}/6 次掷硬币
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          当前掷 {getLinePosition(currentStep - 1)}
        </Typography>
        
        {isFlipping ? (
          <AnimatedCoins />
        ) : (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {permissionStatus === 'granted' ? (
              <React.Fragment>
                <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
                  请用力摇动手机掷硬币！
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'info.light', 
                  color: 'info.contrastText',
                  borderRadius: 1,
                  mb: 2,
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.7 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.7 }
                  }
                }}>
                  <Typography variant="body2">
                    手机需要大幅度摇动才能检测到动作。如果多次尝试无效，请点击下方按钮。
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={manualThrowCoin}
                  sx={{ mt: 1 }}
                >
                  手动掷硬币
                </Button>
                
                {/* 调试工具按钮 */}
                {debugMode && (
                  <Box sx={{ mt: 2, p: 1, border: '1px dashed', borderColor: 'grey.400', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                      调试工具
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      onClick={() => {
                        console.log('手动触发摇动事件测试');
                        handleShakeToss(acceleration);
                      }}
                      sx={{ mr: 1 }}
                    >
                      测试摇动事件
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => {
                        console.log('当前状态:', { 
                          permissionStatus, 
                          isFlipping, 
                          currentStep,
                          accelerationData: acceleration
                        });
                      }}
                    >
                      检查状态
                    </Button>
                  </Box>
                )}
              </React.Fragment>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<ShuffleIcon />}
                onClick={manualThrowCoin}
              >
                掷硬币
              </Button>
            )}
            
            {shakeDetected && (
              <Box sx={{ 
                mt: 2, 
                p: 1, 
                bgcolor: 'success.light', 
                color: 'success.contrastText',
                borderRadius: 1
              }}>
                检测到摇动！
              </Box>
            )}
          </Box>
        )}
        
        {/* 显示陀螺仪数据（帮助调试） */}
        {permissionStatus === 'granted' && (
          <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" align="center">
              <strong>陀螺仪数据:</strong> X: {acceleration.x?.toFixed(2) || 0}, 
              Y: {acceleration.y?.toFixed(2) || 0}, 
              Z: {acceleration.z?.toFixed(2) || 0}
            </Typography>
            <Typography variant="caption" align="center" sx={{ display: 'block', mt: 0.5 }}>
              加速度越大，数值变化越明显，说明传感器工作正常
            </Typography>
          </Box>
        )}
        
        {/* 显示已有的硬币结果 */}
        {lines.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>已掷硬币结果</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {lines.map((line, index) => (
                <Paper key={index} sx={{ p: 1.5, bgcolor: 'grey.100' }}>
                  <Grid container alignItems="center">
                    <Grid item xs={2}>
                      <Typography variant="body2" fontWeight="medium">
                        {getLinePosition(index)}:
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {line.coins.map((coin, coinIndex) => (
                          <CoinRenderer key={coinIndex} value={coin} />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        {line.coins.filter(c => c === "正").length}正
                        {line.coins.filter(c => c === "反").length}反
                        {line.changing ? " (变爻)" : ""}
                        <span style={{ marginLeft: 8 }}>→</span>
                        <span style={{ marginLeft: 8, fontWeight: 500 }}>
                          {line.value === 1 ? "阳爻" : "阴爻"}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
        
        {/* 显示当前卦象进度 */}
        {lines.length > 0 && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>当前卦象形成中</Typography>
            <Paper sx={{ p: 2 }}>
              {lines.map((line, index) => (
                <LineRenderer key={index} line={line} />
              ))}
              {Array.from({ length: 6 - lines.length }).map((_, index) => (
                <Box 
                  key={`empty-${index}`} 
                  sx={{ 
                    height: 8, 
                    mx: 6, 
                    my: 1,
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 1
                  }}
                />
              ))}
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CoinTossScreen;