import { useState } from 'react';
import { hexagramData } from '../data/hexagramData';

export const useCoinToss = ({ 
  currentStep, 
  setCurrentStep, 
  lines, 
  setLines, 
  setCompleted, 
  setResult,
  setSnackbarMessage,
  setSnackbarOpen
}) => {
  const [isFlipping, setIsFlipping] = useState(false);

  // 掷硬币算一爻
  const throwCoin = (acceleration) => {
    // 使用加速度值作为随机数生成的种子
    let seed = Math.abs(acceleration?.x + acceleration?.y + acceleration?.z);
    if (isNaN(seed) || seed === 0) {
      seed = Math.random();
    }
    
    // 三枚硬币的结果（正面为3，反面为2）
    const coin1 = (seed * 7919) % 1 > 0.5 ? "正" : "反"; // 使用大质数增加随机性
    const coin2 = (seed * 7867) % 1 > 0.5 ? "正" : "反";
    const coin3 = (seed * 7823) % 1 > 0.5 ? "正" : "反";
    
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

  // 处理掷硬币结果
  const processCoinToss = (acceleration) => {
    const lineResult = throwCoin(acceleration);
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
  };

  // 处理摇动掷硬币事件
  const handleShakeToss = (acceleration) => {
    if (isFlipping || currentStep > 6) return;
    
    setIsFlipping(true);
    setSnackbarMessage('检测到摇动，正在掷硬币...');
    setSnackbarOpen(true);
    
    // 添加一个明显的视觉和声音反馈（如果可能）
    try {
      // 尝试使用振动API（如果设备支持）
      if ('vibrate' in navigator) {
        navigator.vibrate(200); // 振动200毫秒
      }
    } catch (e) {
      console.log('振动API不可用', e);
    }
    
    // 模拟掷硬币的延迟
    setTimeout(() => {
      processCoinToss(acceleration);
    }, 800);
  };

  // 手动掷硬币（当陀螺仪不可用时）
  const manualThrowCoin = () => {
    if (isFlipping || currentStep > 6) return;
    
    setIsFlipping(true);
    
    // 模拟掷硬币的延迟
    setTimeout(() => {
      processCoinToss();
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

  return {
    isFlipping,
    setIsFlipping,
    processCoinToss,
    handleShakeToss,
    manualThrowCoin,
    completeHexagram
  };
};