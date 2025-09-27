#!/usr/bin/env node

/**
 * DG项目内存优化脚本
 * 用于监控和优化Quartz构建过程的内存使用
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DGMemoryOptimizer {
  constructor() {
    this.memoryLimit = 6144; // MB
    this.gcInterval = 30000; // 30秒
    this.logFile = path.join(__dirname, '../.turbo/memory.log');
  }

  // 获取当前内存使用情况
  getMemoryUsage() {
    try {
      const usage = process.memoryUsage();
      return {
        rss: Math.round(usage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
        external: Math.round(usage.external / 1024 / 1024), // MB
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('获取内存使用情况失败:', error.message);
      return null;
    }
  }

  // 记录内存使用情况
  logMemoryUsage(usage) {
    if (!usage) return;
    
    const logEntry = `${usage.timestamp} - RSS: ${usage.rss}MB, Heap: ${usage.heapUsed}/${usage.heapTotal}MB, External: ${usage.external}MB\n`;
    
    try {
      // 确保日志目录存在
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('写入日志失败:', error.message);
    }
  }

  // 强制垃圾回收
  forceGC() {
    if (global.gc) {
      global.gc();
      console.log('🗑️  执行垃圾回收');
    } else {
      console.log('⚠️  垃圾回收不可用，请使用 --expose-gc 标志启动');
    }
  }

  // 检查内存使用是否超限
  checkMemoryLimit(usage) {
    if (!usage) return false;
    
    if (usage.heapUsed > this.memoryLimit * 0.8) {
      console.log(`⚠️  内存使用接近限制: ${usage.heapUsed}MB / ${this.memoryLimit}MB`);
      this.forceGC();
      return true;
    }
    
    if (usage.heapUsed > this.memoryLimit * 0.9) {
      console.log(`🚨 内存使用过高: ${usage.heapUsed}MB / ${this.memoryLimit}MB`);
      return true;
    }
    
    return false;
  }

  // 启动内存监控
  startMonitoring() {
    console.log('🔍 启动DG项目内存监控...');
    
    const monitor = setInterval(() => {
      const usage = this.getMemoryUsage();
      this.logMemoryUsage(usage);
      this.checkMemoryLimit(usage);
    }, this.gcInterval);

    // 优雅退出
    process.on('SIGINT', () => {
      console.log('\n🛑 停止内存监控');
      clearInterval(monitor);
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 停止内存监控');
      clearInterval(monitor);
      process.exit(0);
    });
  }

  // 清理日志文件
  cleanLogs() {
    try {
      if (fs.existsSync(this.logFile)) {
        fs.unlinkSync(this.logFile);
        console.log('🧹 清理内存日志完成');
      }
    } catch (error) {
      console.error('清理日志失败:', error.message);
    }
  }

  // 显示内存报告
  showReport() {
    try {
      if (!fs.existsSync(this.logFile)) {
        console.log('📊 暂无内存使用记录');
        return;
      }

      const logs = fs.readFileSync(this.logFile, 'utf8').trim().split('\n');
      const recentLogs = logs.slice(-10); // 最近10条记录

      console.log('📊 DG项目内存使用报告:');
      console.log('================================');
      recentLogs.forEach(log => console.log(log));
      console.log('================================');
      
      const usage = this.getMemoryUsage();
      if (usage) {
        console.log(`当前内存使用: RSS ${usage.rss}MB, Heap ${usage.heapUsed}/${usage.heapTotal}MB`);
      }
    } catch (error) {
      console.error('生成报告失败:', error.message);
    }
  }
}

// 命令行接口
const command = process.argv[2];
const optimizer = new DGMemoryOptimizer();

switch (command) {
  case 'monitor':
    optimizer.startMonitoring();
    break;
  case 'clean':
    optimizer.cleanLogs();
    break;
  case 'report':
    optimizer.showReport();
    break;
  case 'gc':
    optimizer.forceGC();
    break;
  default:
    console.log('DG项目内存优化工具');
    console.log('用法:');
    console.log('  node memory-optimize.js monitor  - 启动内存监控');
    console.log('  node memory-optimize.js report   - 显示内存报告');
    console.log('  node memory-optimize.js clean    - 清理日志文件');
    console.log('  node memory-optimize.js gc       - 强制垃圾回收');
}