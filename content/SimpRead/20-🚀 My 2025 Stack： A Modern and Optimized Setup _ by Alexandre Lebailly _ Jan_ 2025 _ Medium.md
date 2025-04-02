---
title: 20-🚀 My 2025 Stack： A Modern and Optimized Setup _ by Alexandre Lebailly _ Jan_ 2025 _ Medium
aliases: ['"🚀 My 2025 Stack: A Modern and Optimized Setup | by Alexandre Lebailly | Jan', '2025 | Medium"']
tags: []
date-created: 2025-03-21
date-modified: 2025-03-30
desc: In 2025, I completely reinvented my stack to suit my daily needs, whether for development, tool manag......
url: https://medium.com/@a-lebailly/my-2025-stack-a-modern-and-optimized-setup-06533ba67bc9
---

In 2025, I completely reinvented my stack to suit my daily needs, whether for development, tool management, or overall work efficiency. Here's an overview of my setup and the reasoning behind my choices.

**_Note:_** _I am a web developer / back-end primarily working with PHP, so this stack is tailored to support my workflow. This configuration also reflects years of experience with Linux. Setting up such an environment requires time and effort, especially for those new to Arch Linux. If you're unfamiliar with these tools, be prepared to invest in learning and troubleshooting as you build your setup. But it's a good training to learn Linux and his great ecosystem._

* **Arch Linux**: A lightweight, flexible, and cutting-edge Linux distribution known for its **rolling release model**, which ensures access to the latest software updates. Arch focuses on simplicity, leaving users in full control but requiring a hands-on approach.
* **EndeavourOS**: A user-friendly Arch-based distribution that streamlines the installation process and offers sensible defaults while preserving Arch's flexibility. It's perfect for users who want the Arch experience without starting from scratch.
* **Hyprland**: A modern tiling window manager for Wayland, designed for efficiency and customization. Hyprland supports advanced window management, animations, and a highly configurable setup, making it ideal for power users.

These tools together form a powerful, customizable, and bleeding-edge environment tailored to advanced workflows.

![[SimpRead/_resources/20-🚀 My 2025 Stack： A Modern and Optimized Setup _ by Alexandre Lebailly _ Jan_ 2025 _ Medium/7bf942d4dcc65c455f651b333b4edf8a_MD5.jpg]]

Screenshot 1

![[SimpRead/_resources/20-🚀 My 2025 Stack： A Modern and Optimized Setup _ by Alexandre Lebailly _ Jan_ 2025 _ Medium/62797cd9faa082ceca5716375b619b0f_MD5.jpg]]

Screenshot 2

_You can find many inspirations on_ [_r/unix****_](https://www.reddit.com/r/unixporn/)_, a subreddit dedicated to sharing Linux/BSD desktop customization._

1. **Why the Change?**
2. **My CLI Stack: Everything in the Terminal**
3. I**My GUI Tools: Modern and Ergonomic**
4. **Arch / Hyprland Tools: The Heart of My Linux Environment**
5. **IDE: Flexibility for Small and Large Projects**
6. **Development Stack: Comprehensive and Powerful**
7. **Other Essentials**

I transitioned from a dual boot of Windows 11 and Ubuntu i3 to a dual boot of Windows 11 and [EndeavourOS](https://endeavouros.com/) ([Arch Distribution](https://archlinux.org/)) with [Hyprland](https://hyprland.org/). This change was driven by several motivations:

1. **Arch Linux Rolling Release**: Continuous updates to always have the latest software versions.
2. **Hyprland**: A modern and elegant tiling window manager, perfectly suited for advanced window management.
3. **Infinite Customization**: With EndeavourOS / Arch and Hyprland, I can tweak every aspect of my environment to fit my needs.

As a general aesthetic, I chose the **Catppuccin Macchiato** theme for most tools, with a **Dark Theme** fallback for those without Catppuccin support.

* [**Kitty**](https://github.com/kovidgoyal/kitty) — _Terminal_: Fast, customizable, and aesthetic.
* [**ZSH**](https://github.com/zsh-users/zsh) — _Shell_: Enhanced shell experience with [OhMyZsh](https://github.com/ohmyzsh/ohmyzsh) and [Power10klevel](https://github.com/romkatv/powerlevel10k).
* [**Bat**](https://github.com/sharkdp/bat) — _File Viewer_: An improved alternative to `cat` with syntax highlighting.
* [**Btop++**](https://github.com/aristocratos/btop) — _Monitoring_: Intuitive system performance analysis.
* [**Posting**](https://github.com/darrenburns/posting) — _API Testing_: Essential for testing and debugging APIs directly in the terminal.I
* [**Harlequin**](https://github.com/tconbeer/harlequin) — _SQL IDE_: Manage database directly in the terminal.
* [**Superfile**](https://github.com/yorukot/superfile) — _File Manager_: Manage files directly in the terminal.
* [**Better-commits**](https://github.com/Everduin94/better-commits) — _Git Commit Tool_: Craft clear and relevant commit messages.
* [**FastFetch**](https://github.com/fastfetch-cli/fastfetch) — _Hardware & OS Information_: Displays system info in style.
* [**Hyprshot**](https://github.com/Gustash/Hyprshot) — _Screenshot Utility_: Simple and efficient screenshot tool for the terminal.
* [**Cava**](https://github.com/karlstav/cava) — _Sound Viewer_: Real-time audio visualization.
* [**Eww**](https://github.com/elkowar/eww) — _Widget_: Standalone widget system.

These CLI tools enable **speed** and **seamless integration** into a terminal-based workflow. The customization, particularly with themes, enhances the overall user experience.

* [**Firefox**](https://www.mozilla.org/en-US/firefox/new/) — _Browser_: A performant and customizable browser.
* [**Nautilus**](https://gitlab.gnome.org/GNOME/nautilus) — _File Manager_: A graphical tool for quick file operations.
* [**Obsidian**](https://github.com/obsidianmd/obsidian-releases) — _Notes_: A powerful tool to organize thoughts and documents.
* [**Blueman**](https://github.com/blueman-project/blueman) — _Bluetooth Manager_: Easily manage Bluetooth connections.
* [**OBS Studio**](https://github.com/obsproject/obs-studio) — _Screen Recorder_: Perfect for capturing sessions or tutorials.
* [**KeePassXS**](https://github.com/keepassxreboot/keepassxc) — _Password Manager_: Secure management of passwords.
* [**LibreOffice**](https://github.com/LibreOffice/core) — _Office Suite_: Open-source and elegant office tools.
* [**Postman**](https://www.postman.com/) — _API Testing_: Essential for testing and debugging APIs.
* [**Spotify**](https://spotify.com/) — _Music Streaming_: Essential to dancing and to be always happy.
* [**WireShark**](https://gitlab.com/wireshark/wireshark) — _Network Monitoring_: One of the best network traffic analyzer.

These GUI tools complement my workflow when the terminal is insufficient, providing **intuitive interfaces** and a **smooth user experience**.

* [**Wofi**](https://hg.sr.ht/~scoopta/wofi) — _Menu Program_: A fast and lightweight launcher.
* [**SDDM**](https://github.com/sddm/sddm) — _Session Manager_: Simplified session management.
* [**Hyprpick**](https://github.com/hyprwm/hyprpicker) — _Color Picker_: A minimalist tool for selecting colors.
* [**Hyprpanel**](https://github.com/Jas-SinghFSU/HyprPanel) — _Hyprland Panel_: An efficient and aesthetic taskbar.
* [**Hyprlock**](https://github.com/hyprwm/hyprlock) — _Session Locker_: Quickly secure my session.
* [**Imv**](https://git.sr.ht/~exec64/imv/) — _Image Viewer_: A lightweight and fast image viewer.

These tools optimize my productivity by being lightweight and deeply integrated into the Hyprland ecosystem. **Fluidity** and **extensive customization** are their primary strengths.

* [**NeoVim**](https://github.com/neovim/neovim) & [**NvChad**](https://github.com/NvChad/NvChad): Perfect for lightweight projects with full control in the terminal.
* [**JetBrains IDEs**](https://www.jetbrains.com/): A comprehensive suite for larger projects, including tools like IntelliJ IDEA or PhpStorm.

This combination allows me to harness the **power of JetBrains IDEs** for heavy projects and the **lightweight efficiency of NeoVim** for quick and focused edits.

* [**Nginx**](https://github.com/nginx/nginx): HTTP server.
* [**PHP**](https://github.com/php/php-src) (Composer, Symfony CLI…): A complete ecosystem for web development.
* [**NVM**](https://github.com/nvm-sh/nvm) (npm, yarn…): Node.js manager for JavaScript/TypeScript projects.
* [**Redis**](https://github.com/redis/redis), [**MariaDB**](https://github.com/MariaDB/server), [**ElasticSearch + Kibana**](https://www.elastic.co/), [**Maildev**](https://github.com/maildev/maildev): Powerful tools for managing databases, caching, search, and email server emulation.

A robust stack that covers all my needs, from backend and frontend development to data analysis.

* [**Nerd Fonts**](https://www.nerdfonts.com/) (`Cascadia + Fira`): Optimized fonts for terminal and IDE usage.
* [**GitHub Copilot**](https://github.com/features/copilot): AI integration into my tools to boost productivity (Terminal, NeoVim, Jetbrains IDEs).

My 2025 stack reflects my need for efficiency, customization, and modernity. Between a fast and lightweight Hyprland environment, powerful CLI tools, and a comprehensive development stack, I can work under optimal conditions. If you're looking to optimize your own setup, feel free to take inspiration from this configuration!

You can star this article on [GitHub](https://github.com/a-lebailly/2k25-stack) 🌟🌟🌟
