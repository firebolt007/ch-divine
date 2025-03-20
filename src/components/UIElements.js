import React from 'react';
import { Box } from '@mui/material';

// 渲染单个爻
export const LineRenderer = ({ line }) => {
  if (!line) return null;
  
  const { value, changing } = line;
  
  return (
    <Box 
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
export const CoinRenderer = ({ value }) => {
  return (
    <Box 
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
export const AnimatedCoins = () => {
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