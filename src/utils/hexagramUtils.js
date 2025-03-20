// 获取爻位描述
export const getLinePosition = (index) => {
    const positions = ["初爻（底部）", "二爻", "三爻", "四爻", "五爻", "上爻（顶部）"];
    return positions[index];
  };
  
  // 其他卦象计算相关的工具函数可以放在这里