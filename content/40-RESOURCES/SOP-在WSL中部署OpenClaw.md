---
title: SOP-在WSL中部署OpenClaw
date-created: 2026-03-06
date-modified: 2026-03-07
content-type: [sop]
---

## 📋 WSL 中部署 OpenClaw 完整流程总结

### **第一阶段：环境准备**

#### 1. 启用 WSL 的 [[systemd]]

systemd 是 Linux 中的服务管理器

```bash
# 创建/修改wsl.conf
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF

# Windows PowerShell中执行（完全重启WSL）
wsl --shutdown
```

#### 2. 修复用户会话 [[DBus]]（关键步骤）

DBus 是 Linux 中的事件总线，在 WSL 环境下 DBus 用户会话总线需要手动触发（WSL 为了轻量化和兼容性，省略了在用户登录时自动创建用户会话和 DBus 总线）

```bash
# 检查会话状态
loginctl list-sessions

# 设置环境变量（添加到~/.bashrc）
export XDG_RUNTIME_DIR="/run/user/$UID"
export DBUS_SESSION_BUS_ADDRESS="unix:path=${XDG_RUNTIME_DIR}/bus"

# 手动创建总线文件（如果缺失）
sudo mkdir -p /run/user/1000
sudo chown pedyc:pedyc /run/user/1000
sudo chmod 700 /run/user/1000
/usr/bin/dbus-daemon --session --address=$DBUS_SESSION_BUS_ADDRESS --nofork --nopidfile --syslog-only &
```

---

### **第二阶段：安装 OpenClaw**

#### 3. 安装主程序

```bash
# 下载并运行安装脚本
curl -fsSL https://openclaw.bot/install.sh | bash

# 或使用官方备用地址
curl -fsSL https://openclaw.ai/install.sh | bash
```

#### 4. 安装网关服务（关键步骤）

```bash
# 方法A：安装时指定创建服务
openclaw onboard --install-daemon

# 方法B：单独安装服务
openclaw gateway install

# 验证服务文件是否生成
ls -la ~/.config/systemd/user/openclaw-gateway.service
```

---

### **第三阶段：服务配置**

#### 5. 启动服务并设置开机自启

```bash
# 重新加载systemd配置
systemctl --user daemon-reload

# 启动网关
systemctl --user start openclaw-gateway

# 设置开机自启
systemctl --user enable openclaw-gateway

# 启用用户服务持久化（允许开机自启）
sudo loginctl enable-linger pedyc
```

#### 6. 验证服务状态

```bash
# 检查服务状态
systemctl --user status openclaw-gateway
openclaw status

# 运行健康检查
openclaw doctor
openclaw doctor --fix  # 如有问题自动修复
```

---

### **第四阶段：使用配置**

#### 7. 获取访问 Token 并登录 Web 界面

```bash
# 获取带Token的Dashboard地址
openclaw dashboard --no-open

# 复制输出的完整URL，在浏览器中打开
# 格式：http://127.0.0.1:18789/#token=<你的Token>
```

#### 8. 日常管理命令

```bash
# 服务管理
systemctl --user start|stop|restart openclaw-gateway
openclaw gateway start|stop|restart  # 等效命令

# 查看日志
journalctl --user -u openclaw-gateway -f

# 查看Web界面地址
openclaw dashboard
```

---

## ⚠️ **重要注意事项**

### **1. systemd 相关**

- ⚠️ **必须先在 wsl.conf 中启用 systemd**，否则所有服务管理命令都会失败
- ⚠️ **修改 wsl.conf 后必须 `wsl --shutdown` 完全重启**，仅退出终端重开不够
- ⚠️ **用户会话服务需要手动激活**，环境变量必须正确设置

### **2. 安装过程**

- ⚠️ **安装时务必选择 " 创建网关服务 "**，否则无法开机自启
- ⚠️ **安装脚本可能需要科学上网**，如果失败可尝试官方备用地址
- ⚠️ **确保 `~/.config/systemd/user/` 目录存在且有正确权限**

### **3. Token 和认证**

- ⚠️ **Token 是访问 Web 界面的唯一凭证**，务必保存好
- ⚠️ **每次重启后 Token 不变**，但浏览器可能丢失，用 `openclaw dashboard --no-open` 重新获取
- ⚠️ **如果报 "unauthorized"**，说明需要重新粘贴 Token 或批准设备

### **4. 系统维护**

- ⚠️ **Windows 正常关机不影响**，服务会自动恢复
- ⚠️ **如果遇到莫名问题，先跑 `openclaw doctor --fix`**，它能解决 90% 的常见问题
- ⚠️ **定期检查日志**：`journalctl --user -u openclaw-gateway -n 50 --no-pager`

### **5. 资源管理**

- ⚠️ **WSL 默认内存限制可能不足**，可在 `C:\Users\你的用户名\.wslconfig` 中配置：

```ini
[wsl2]
memory=4GB
processors=2
```

- ⚠️ **OpenClaw 默认占用 512MB-1GB 内存**，资源紧张时可限制：

```bash
systemctl --user edit openclaw-gateway
# 添加：
[Service]
MemoryMax=512M
```

### **6. 常见错误及解决**

| 错误                         | 原因           | 解决                                         |
| -------------------------- | ------------ | ------------------------------------------ |
| `Failed to connect to bus` | DBus 会话未启动   | 检查环境变量，手动启动 dbus-daemon                    |
| `Unit not found`           | 服务文件缺失       | 运行 `openclaw gateway install`              |
| `gateway token missing`    | Token 丢失/未配置 | `openclaw dashboard --no-open` 重新获取        |
| `Dependency failed`        | 依赖服务未启动      | `sudo systemctl start dbus systemd-logind` |

---

## 🎯 **最佳实践建议**

1. **安装后立即备份配置**

```bash
cp -r ~/.openclaw ~/.openclaw.backup
cp -r ~/.config/systemd/user/openclaw-gateway.service ~/
```

2. **设置监控脚本**

```bash
# 每5分钟检查一次服务状态
crontab -e
*/5 * * * * /home/pedyc/check-openclaw.sh
```

3. **遇到问题先自救**

```bash
# 三部曲
openclaw doctor --fix
systemctl --user restart openclaw-gateway
journalctl --user -u openclaw-gateway -n 20
```

4. **保持更新**

```bash
# 定期更新OpenClaw
openclaw update
```

---

## 📌 **一句话总结**

**部署成功的关键三步**：1️⃣ 启用 systemd 并重启 WSL 2️⃣ 正确设置 DBus 环境变量 3️⃣ 安装时选择创建网关服务。之后即可用 `systemctl --user` 管理服务，用 `openclaw dashboard` 访问 Web 界面。

**恭喜你完成部署！** 🎉 现在你可以尽情使用 OpenClaw 了。如果以后遇到任何问题，随时可以回来参考这个总结，或者直接问～
