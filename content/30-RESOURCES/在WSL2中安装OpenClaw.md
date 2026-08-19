---
title: 在WSL2中安装OpenClaw
aliases: [SOP-在WSL2中安装OpenClaw]
description: OpenClaw 官方文档 — 个人 AI 助手，任意平台 🦞
tags: [clippings]
date-created: 2026-03-07
date-modified: 2026-04-09
created: 2026-03-07
source: https://openclaw.cc/platforms/windows.html
---

## Windows (WSL2)

Windows 上的 OpenClaw 推荐 **通过 WSL2** （推荐 Ubuntu）。CLI + Gateway 网关在 Linux 内运行，这保持了运行时的一致性并使工具兼容性大大提高（Node/Bun/pnpm、Linux 二进制文件、Skills）。原生 Windows 可能更棘手。WSL2 给你完整的 Linux 体验——一条命令安装： `wsl --install` 。

原生 Windows 配套应用已在计划中。

## 安装（WSL2）

- [入门指南](https://openclaw.cc/start/getting-started.html) （在 WSL 内使用）
- [安装和更新](https://openclaw.cc/install/updating.html)
- 官方 WSL2 指南（Microsoft）： [https://learn.microsoft.com/windows/wsl/install](https://learn.microsoft.com/windows/wsl/install)

## Gateway 网关

- [Gateway 网关操作手册](https://openclaw.cc/gateway.html)
- [配置](https://openclaw.cc/gateway/configuration.html)

## Gateway 网关服务安装（CLI）

在 WSL2 内：

```bash
openclaw onboard --install-daemon
```

或：

```bash
openclaw gateway install
```

或：

```bash
openclaw configure
```

出现提示时选择 **Gateway service** 。

修复/迁移：

```bash
openclaw doctor
```

## 高级：通过 LAN 暴露 WSL 服务（portproxy）

WSL 有自己的虚拟网络。如果另一台机器需要访问 **在 WSL 内** 运行的服务（SSH、本地 TTS 服务器或 Gateway 网关），你必须将 Windows 端口转发到当前的 WSL IP。WSL IP 在重启后会改变，因此你可能需要刷新转发规则。

示例（以 **管理员身份** 运行 PowerShell）：

```powershell
powershell$Distro = "Ubuntu-24.04"

$ListenPort = 2222

$TargetPort = 22

$WslIp = (wsl -d $Distro -- hostname -I).Trim().Split(" ")[0]

if (-not $WslIp) { throw "WSL IP not found." }

netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=$ListenPort \`

  connectaddress=$WslIp connectport=$TargetPort
```

允许端口通过 Windows 防火墙（一次性）：

```powershell
powershellNew-NetFirewallRule -DisplayName "WSL SSH $ListenPort" -Direction Inbound \`

  -Protocol TCP -LocalPort $ListenPort -Action Allow
```

在 WSL 重启后刷新 portproxy：

```powershell
powershellnetsh interface portproxy delete v4tov4 listenport=$ListenPort listenaddress=0.0.0.0 | Out-Null

netsh interface portproxy add v4tov4 listenport=$ListenPort listenaddress=0.0.0.0 \`

  connectaddress=$WslIp connectport=$TargetPort | Out-Null
```

注意事项：

- 从另一台机器 SSH 目标是 **Windows 主机 IP** （示例： `ssh user@windows-host -p 2222` ）。
- 远程节点必须指向 **可访问的** Gateway 网关 URL（不是 `127.0.0.1` ）；使用 `openclaw status --all` 确认。
- 使用 `listenaddress=0.0.0.0` 进行 LAN 访问； `127.0.0.1` 仅保持本地访问。
- 如果你想自动化，注册一个计划任务在登录时运行刷新步骤。

## WSL2 分步安装

### 1）安装 WSL2 + Ubuntu

打开 PowerShell（管理员）：

```powershell
powershellwsl --install

# Or pick a distro explicitly:

wsl --list --online

wsl --install -d Ubuntu-24.04
```

如果 Windows 要求则重启。

### 2）启用 systemd（Gateway 网关安装所需）

在你的 WSL 终端中（因为 WSL 不会自动启动 systemd）：

```bash
bashsudo tee /etc/wsl.conf >/dev/null <<'EOF'

[boot]

systemd=true

EOF
```

然后从 PowerShell：

```powershell
powershellwsl --shutdown
```

重新打开 Ubuntu，然后验证：

```bash
bashsystemctl --user status
```

### 3）安装 OpenClaw（在 WSL 内）

在 WSL 内按照 Linux 入门指南流程：

```bash
bashgit clone https://github.com/openclaw/openclaw.git

cd openclaw

pnpm install

pnpm ui:build # auto-installs UI deps on first run

pnpm build

openclaw onboard
```

完整指南： [入门指南](https://openclaw.cc/start/getting-started.html)
