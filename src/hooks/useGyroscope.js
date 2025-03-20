import { useState, useEffect, useCallback } from 'react';

export const useGyroscope = ({ 
  onShake, 
  isFlipping,
  currentStep,
  setSnackbarMessage, 
  setSnackbarOpen 
}) => {
  const [gyroscopeAvailable, setGyroscopeAvailable] = useState(false);
  const [shakeDetected, setShakeDetected] = useState(false);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [permissionStatus, setPermissionStatus] = useState('idle');
  const [debugMode] = useState(true); // 调试模式

    // 设置摇动检测
    const setupShakeDetection = useCallback(() => {
      // 节流处理 - 限制事件处理频率
      let lastProcessTime = 0;
      const PROCESS_INTERVAL = 100; // 每100ms处理一次
      // 降低加速度阈值（提高灵敏度）
      const SHAKE_THRESHOLD = 8; // 从15降低到7
      
      // 减少时间间隔（更频繁地响应摇动）
      const SHAKE_TIMEOUT = 600; 
      let lastShakeTime = 0;
      
      // 添加调试日志
      if (debugMode) console.log('开始监听设备动作事件');

      const deviceMotionHandler = (event) => {
        const now = Date.now();
        // 节流: 只有经过足够间隔才处理事件
        if (now - lastProcessTime < PROCESS_INTERVAL) return;
        lastProcessTime = now;

        const { accelerationIncludingGravity } = event;
        
        if (!accelerationIncludingGravity) return;
        
        const x = accelerationIncludingGravity.x || 0;
        const y = accelerationIncludingGravity.y || 0;
        const z = accelerationIncludingGravity.z || 0;
        
        setAcceleration({ x, y, z });
        
        // 检查是否处于可以响应摇动的状态
        if (isFlipping || currentStep === 0 || currentStep > 6) return;
        
        // 直接用最简单的触发逻辑解决问题
        // 任何轴上超过阈值的加速度都可能是摇动
        const isSignificantMovement = 
          Math.abs(x) > SHAKE_THRESHOLD || 
          Math.abs(y) > SHAKE_THRESHOLD || 
          Math.abs(z) > SHAKE_THRESHOLD;
        
        const currentTime = new Date().getTime();
  
        // 调试日志
        if (debugMode && isSignificantMovement) {
          console.log('检测到潜在摇动:', {
            x: x.toFixed(2),
            y: y.toFixed(2),
            z: z.toFixed(2),
            timeSinceLastShake: currentTime - lastShakeTime
          });
        }
        
        // 如果检测到显著移动且间隔足够
        if (isSignificantMovement && (currentTime - lastShakeTime > SHAKE_TIMEOUT)) {
          if (debugMode) console.log('✓ 触发有效摇动!', {x, y, z});
          lastShakeTime = currentTime;
          setShakeDetected(true);
          
          // 显示明显的视觉反馈
          setSnackbarMessage('检测到摇动! 正在掷硬币...');
          setSnackbarOpen(true);
          
          // 尝试振动反馈
          if ('vibrate' in navigator) {
            try {
              navigator.vibrate(200);
            } catch(e) {}
          }
          
          // 触发掷硬币
          onShake();
        }
      };
      
  
      // 添加事件监听器
      window.addEventListener('devicemotion', deviceMotionHandler);
      
      // 返回一个清理函数，可以在组件卸载时移除监听器
      return () => {
        if (debugMode) console.log('移除设备动作事件监听器');
        window.removeEventListener('devicemotion', deviceMotionHandler);
      };
    }, [isFlipping, currentStep, onShake, acceleration]);
  
  // 检查设备是否支持陀螺仪
  useEffect(() => {
    // 更可靠地检测设备动作支持
    const checkDeviceMotionSupport = () => {
      // 一些Safari版本在隐私浏览模式下会声称支持但实际不工作
      if (window.DeviceMotionEvent !== undefined) {
        // 测试是否能真正获取事件
        let motionSupported = false;
        
        // 测试监听器
        const testHandler = () => {
          motionSupported = true;
          window.removeEventListener('devicemotion', testHandler);
        };
        
        window.addEventListener('devicemotion', testHandler, false);
        
        // 如果是iOS设备，无法在用户交互前测试，默认假设支持
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS) {
          setGyroscopeAvailable(true);
          if (debugMode) console.log('iOS设备：假设支持陀螺仪，等待用户交互');
        } else {
          // 给一个简短的延迟来确认是否真的支持
          setTimeout(() => {
            if (motionSupported) {
              setGyroscopeAvailable(true);
              if (debugMode) console.log('设备支持陀螺仪');
            } else {
              setGyroscopeAvailable(false);
              setSnackbarMessage('您的设备不支持陀螺仪或已禁用，将使用虚拟掷硬币。');
              setSnackbarOpen(true);
              if (debugMode) console.log('设备不支持陀螺仪');
            }
          }, 500);
        }
      } else {
        setGyroscopeAvailable(false);
        setSnackbarMessage('您的设备不支持陀螺仪，将使用虚拟掷硬币。');
        setSnackbarOpen(true);
        if (debugMode) console.log('DeviceMotionEvent未定义');
      }
    };
    
    checkDeviceMotionSupport();
  }, [debugMode, setSnackbarMessage, setSnackbarOpen]);

  // 监听权限状态和步骤状态，设置摇动检测
  useEffect(() => {
    // 只有当权限已授予时才设置摇动检测
    if (permissionStatus !== 'granted') return;
    
    const cleanupFunction = setupShakeDetection();
    
    // 返回清理函数
    return cleanupFunction;
  }, [permissionStatus, currentStep, isFlipping, setupShakeDetection]);

  // 请求陀螺仪权限
  const requestGyroscopePermission = () => {
    if (!gyroscopeAvailable) return;

    setPermissionStatus('requesting');
    if (debugMode) console.log('正在请求陀螺仪权限...');
    
    // iOS 13+ 需要请求权限
    if (typeof window.DeviceMotionEvent !== 'undefined' && 
        typeof window.DeviceMotionEvent.requestPermission === 'function') {
      
      // 必须在用户手势事件内调用请求权限方法（如点击事件）
      try {
        window.DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              setPermissionStatus('granted');
              setSnackbarMessage('陀螺仪权限已授予，请摇动手机掷硬币。');
              setSnackbarOpen(true);
              if (debugMode) console.log('iOS陀螺仪权限已授予');
            } else {
              setPermissionStatus('denied');
              setSnackbarMessage('陀螺仪权限被拒绝，将使用虚拟掷硬币。');
              setSnackbarOpen(true);
              if (debugMode) console.log('iOS陀螺仪权限被拒绝');
            }
          })
          .catch(error => {
            console.error('权限请求错误:', error);
            setPermissionStatus('denied');
            setSnackbarMessage('iOS权限请求失败，这可能是由于浏览器安全策略导致。将使用虚拟掷硬币。');
            setSnackbarOpen(true);
            if (debugMode) console.log('iOS权限请求失败:', error);
          });
      } catch (error) {
        console.error('iOS权限API调用失败:', error);
        setPermissionStatus('denied');
        setSnackbarMessage('iOS设备权限API调用失败，将使用虚拟掷硬币。');
        setSnackbarOpen(true);
        if (debugMode) console.log('iOS权限API调用失败:', error);
      }
    } else {
      // 其他设备直接尝试使用
      setPermissionStatus('granted');
      if (debugMode) console.log('非iOS设备，直接授予权限');
    }
  };


  return {
    gyroscopeAvailable,
    acceleration,
    permissionStatus,
    shakeDetected,
    setShakeDetected,
    requestGyroscopePermission
  };
};