import React, { useState } from 'react';
// Material UI 组件
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Grid,
  Divider 
} from '@mui/material';
// Material UI 图标
import ShuffleIcon from '@mui/icons-material/Shuffle';

const CyberDivination = () => {
  // 基本状态
  const [currentStep, setCurrentStep] = useState(0); // 0: 初始状态, 1-6: 掷硬币步骤
  const [isFlipping, setIsFlipping] = useState(false);
  const [lines, setLines] = useState([]); // 存储爻的结果: {value: 0/1, changing: true/false, coins: ["正"/"反",...]}
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);
  
  // 64卦及其基本含义 - 以二进制字符串为键 ("111111" 等)
  const hexagramData = {
    "111111": { name: "乾", meaning: "乾为天", interpretation: "象征天，代表强健、刚毅、创造和领导。暗示事业上升，计划顺利，但需谨防自满。" },
    "000000": { name: "坤", meaning: "坤为地", interpretation: "象征地，代表包容、顺从、稳重和支持。建议保持谦逊，耐心等待时机，不宜急进。" },
    "010001": { name: "屯", meaning: "水雷屯", interpretation: "意为初始和困难，如同种子初生。当前处境充满挑战，但坚持不懈终会有所成就。" },
    "100010": { name: "蒙", meaning: "山水蒙", interpretation: "意为蒙昧无知。提醒你需要学习和寻求指导，避免鲁莽行事，慎重决策。" },
    "010111": { name: "需", meaning: "水天需", interpretation: "意为等待和希望。当前形势需要耐心等待，适当的准备后再行动会更顺利。" },
    "111010": { name: "讼", meaning: "天水讼", interpretation: "意为争端和冲突。建议避免不必要的争执，寻求和平解决方案，保持理性。" },
    "000010": { name: "师", meaning: "地水师", interpretation: "意为军队和纪律。当前需要有组织、有计划地行事，团队合作至关重要。" },
    "010000": { name: "比", meaning: "水地比", interpretation: "意为亲近和团结。人际关系将得到改善，合作会带来好运，珍惜身边的人。" },
    "110111": { name: "小畜", meaning: "风天小畜", interpretation: "意为小有积聚。当前可能有小的收获和进步，宜稳健发展，不可贪多。" },
    "111011": { name: "履", meaning: "天泽履", interpretation: "意为履行和谨慎。建议谨慎行事，按规矩办事，言行一致会获得尊重。" },
    "000111": { name: "泰", meaning: "地天泰", interpretation: "意为通达和和平。当前形势大好，各方面都很顺利，宜大展宏图。" },
    "111000": { name: "否", meaning: "天地否", interpretation: "意为闭塞和不通。当前可能遇到阻碍和困难，建议暂且保守，静待转机。" },
    // 为了简化代码，省略了其余卦象...
  };

  // 掷硬币算一爻
  const throwCoin = () => {
    // 三枚硬币的结果（正面为3，反面为2）
    const coin1 = Math.random() > 0.5 ? "正" : "反";
    const coin2 = Math.random() > 0.5 ? "正" : "反";
    const coin3 = Math.random() > 0.5 ? "正" : "反";
    
    const coins = [coin1, coin2, coin3];
    const positiveCount = coins.filter(c => c === "正").length;
    
    // 根据规则判断爻的类型
    let value;
    let changing = false;
    
    if (positiveCount === 3) { // 三个正，老阳
      value = 1;
      changing = true;
    } else if (positiveCount === 0) { // 三个反，老阴
      value = 0;
      changing = true;
    } else if (positiveCount === 2) { // 两个正一个反，少阳
      value = 1;
    } else { // 一个正两个反，少阴
      value = 0;
    }
    
    return { value, changing, coins };
  };

  // 开始新的算命
  const startDivination = () => {
    setLines([]);
    setCurrentStep(1);
    setCompleted(false);
    setResult(null);
  };

  // 掷下一次硬币
  const throwNextCoin = () => {
    if (isFlipping || currentStep > 6) return;
    
    setIsFlipping(true);
    
    // 模拟掷硬币的延迟
    setTimeout(() => {
      const lineResult = throwCoin();
      const newLines = [...lines, lineResult];
      setLines(newLines);
      
      if (newLines.length >= 6) {
        // 已完成六爻，生成解读
        completeHexagram(newLines);
      } else {
        // 继续下一爻
        setCurrentStep(currentStep + 1);
      }
      
      setIsFlipping(false);
    }, 800);
  };

  // 完成卦象并生成解读
  const completeHexagram = (lineResults) => {
    // 提取爻值和变爻信息
    const hexValues = lineResults.map(line => line.value);
    const changingPositions = lineResults.map(line => line.changing);
    
    // 计算本卦代码
    const hexCode = hexValues.join('');
    const primaryInfo = hexagramData[hexCode] || { 
      name: "未知", 
      meaning: "未知", 
      interpretation: "解释未知" 
    };
    
    // 检查是否有变爻，计算变卦
    const hasChanges = changingPositions.some(pos => pos);
    let changedInfo = null;
    
    if (hasChanges) {
      // 计算变卦
      const changedValues = hexValues.map((val, idx) => 
        changingPositions[idx] ? (val === 1 ? 0 : 1) : val
      );
      const changedCode = changedValues.join('');
      changedInfo = hexagramData[changedCode] || { 
        name: "未知", 
        meaning: "未知", 
        interpretation: "解释未知" 
      };
    }
    
    // 设置结果
    setResult({
      primary: primaryInfo,
      changed: changedInfo,
      hasChanges
    });
    
    setCompleted(true);
    setCurrentStep(7); // 标记为已完成
  };

  // 重置应用
  const resetApp = () => {
    setLines([]);
    setCurrentStep(0);
    setCompleted(false);
    setResult(null);
  };

  // 获取爻位描述
  const getLinePosition = (index) => {
    const positions = ["初爻（底部）", "二爻", "三爻", "四爻", "五爻", "上爻（顶部）"];
    return positions[index];
  };

  // 渲染单个爻
  const renderLine = (line, index) => {
    if (!line) return null;
    
    const { value, changing } = line;
    
    return (
      <Box 
        key={index} 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          my: 1 
        }}
      >
        {value === 0 ? (
          <Box 
            sx={{ 
              height: 8, 
              mx: 6, 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1,
              ...(changing && {
                boxShadow: '0 0 10px #FF5722',
                animation: 'pulse 1.5s infinite',
              })
            }}
          >
            <Box sx={{ width: '41.666%', height: '100%', bgcolor: 'black', borderRadius: 1 }} />
            <Box sx={{ width: '41.666%', height: '100%', bgcolor: 'black', borderRadius: 1 }} />
          </Box>
        ) : (
          <Box 
            sx={{ 
              height: 8, 
              mx: 6, 
              bgcolor: 'black', 
              borderRadius: 1,
              ...(changing && {
                boxShadow: '0 0 10px #FF5722',
                animation: 'pulse 1.5s infinite',
              }),
              width: '100%'
            }}
          />
        )}
        {changing && <Box sx={{ color: 'error.main', ml: 1 }}>×</Box>}
      </Box>
    );
  };

  // 渲染硬币
  const renderCoin = (value, index) => {
    return (
      <Box 
        key={index} 
        sx={{ 
          width: 40, 
          height: 40, 
          borderRadius: '50%', 
          bgcolor: value === "正" ? 'warning.light' : 'grey.600', 
          color: value === "正" ? 'black' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}
      >
        {value}
      </Box>
    );
  };

  // 渲染动画中的硬币
  const renderAnimatedCoins = () => {
    return (
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', my: 2 }}>
        {[1, 2, 3].map((_, index) => (
          <Box 
            key={index} 
            sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              bgcolor: 'warning.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              animation: `spin${index + 1} 1s linear infinite`,
              '@keyframes spin1': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              },
              '@keyframes spin2': {
                '0%': { transform: 'rotate(120deg)' },
                '100%': { transform: 'rotate(480deg)' }
              },
              '@keyframes spin3': {
                '0%': { transform: 'rotate(240deg)' },
                '100%': { transform: 'rotate(600deg)' }
              }
            }}
          >
            {Math.random() > 0.5 ? "正" : "反"}
          </Box>
        ))}
      </Box>
    );
  };

  // 渲染初始界面
  const renderInitialScreen = () => (
    <React.Fragment>
      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        点击按钮开始，将逐次掷硬币六次，揭示你的卦象。
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<ShuffleIcon />}
        onClick={startDivination}
        sx={{ mb: 3 }}
      >
        开始算命
      </Button>
    </React.Fragment>
  );

  // 渲染掷硬币界面
  const renderCoinTossScreen = () => (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 2 }} elevation={2}>
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          正在进行第 {currentStep}/6 次掷硬币
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          当前掷 {getLinePosition(currentStep - 1)}
        </Typography>
        
        {isFlipping ? (
          renderAnimatedCoins()
        ) : (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<ShuffleIcon />}
              onClick={throwNextCoin}
            >
              掷硬币
            </Button>
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
                        {line.coins.map((coin, coinIndex) => renderCoin(coin, coinIndex))}
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
              {lines.map((line, index) => renderLine(line, index))}
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

  // 渲染结果界面
  const renderResultScreen = () => {
    if (!result || !completed || lines.length < 6) return null;
    
    return (
      <Paper sx={{ p: 3, mb: 2 }} elevation={2}>
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          卦象解读
        </Typography>
        
        {/* 本卦 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            本卦：{result.primary.name}卦 ({result.primary.meaning})
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            {lines.map((line, index) => renderLine(line, index))}
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {result.primary.interpretation}
          </Typography>
        </Box>
        
        {/* 变卦 */}
        {result.hasChanges && result.changed && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              变卦：{result.changed.name}卦 ({result.changed.meaning})
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              {lines.map((line, index) => {
                // 创建变卦的爻显示
                const changedLine = {
                  ...line,
                  value: line.changing ? (line.value === 1 ? 0 : 1) : line.value,
                  changing: false
                };
                return renderLine(changedLine, index);
              })}
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {result.changed.interpretation}
            </Typography>
          </Box>
        )}
        
        {/* 综合解读 */}
        {result.hasChanges && result.changed && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f3e8ff', borderRadius: 1, border: '1px solid #e9d5ff' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              综合解读
            </Typography>
            <Typography variant="body1">
              你的卦象从{result.primary.name}卦变化为{result.changed.name}卦，表明你正处于变化的过程中。
              目前的情况是{result.primary.interpretation.split('。')[0]}，
              而未来的趋势是{result.changed.interpretation.split('。')[0]}。
              {lines.filter(line => line.changing).length > 1 
                ? "有多个爻发生变化，意味着变化较为复杂且急剧。" 
                : "只有一个爻发生变化，意味着变化较为缓和且有序。"}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={resetApp}
          >
            重新开始
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          赛博算命
        </Typography>
        
        {currentStep === 0 && renderInitialScreen()}
        {currentStep > 0 && currentStep <= 6 && renderCoinTossScreen()}
        {completed && renderResultScreen()}
        
        {currentStep > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            注意：此算命仅供娱乐，请理性看待。
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CyberDivination;