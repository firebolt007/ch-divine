import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { LineRenderer } from './UIElements';

const ResultScreen = ({ result, lines, resetApp }) => {
  if (!result || lines.length < 6) return null;
  
  const { primary, changed, hasChanges } = result;
  
  return (
    <Paper sx={{ p: 3, mb: 2 }} elevation={2}>
      <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
        卦象解读
      </Typography>
      
      {/* 本卦 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          本卦：{primary.name}卦 ({primary.meaning})
        </Typography>
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          {lines.map((line, index) => (
            <LineRenderer key={index} line={line} />
          ))}
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {primary.interpretation}
        </Typography>
      </Box>
      
      {/* 变卦 */}
      {hasChanges && changed && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            变卦：{changed.name}卦 ({changed.meaning})
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            {lines.map((line, index) => {
              // 创建变卦的爻显示
              const changedLine = {
                ...line,
                value: line.changing ? (line.value === 1 ? 0 : 1) : line.value,
                changing: false
              };
              return <LineRenderer key={index} line={changedLine} />;
            })}
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {changed.interpretation}
          </Typography>
        </Box>
      )}
      
      {/* 综合解读 */}
      {hasChanges && changed && (
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f3e8ff', borderRadius: 1, border: '1px solid #e9d5ff' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            综合解读
          </Typography>
          <Typography variant="body1">
            你的卦象从{primary.name}卦变化为{changed.name}卦，表明你正处于变化的过程中。
            目前的情况是{primary.interpretation.split('。')[0]}，
            而未来的趋势是{changed.interpretation.split('。')[0]}。
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

export default ResultScreen;