---
title: 我的VSCode配置
date-created: 2025-05-28
date-modified: 2025-05-28
---

```json
{
  "workbench.settings.applyToAllProfiles": [
    "workbench.editor.customLabels.patterns"
  ],
  "workbench.experimental.enableNewProfilesUI": true,
  "security.workspace.trust.untrustedFiles": "open",
  "terminal.integrated.fontFamily": "LXGW WenKai Mono GB Screen",
  "terminal.integrated.suggest.enabled": true,
  "editor.cursorBlinking": "blink",
  "editor.cursorStyle": "line",
  "editor.lineNumbers": "on",
  "editor.renderLineHighlight": "all",
  "editor.renderControlCharacters": true,
  "editor.renderWhitespace": "none",
  "editor.showFoldingControls": "always",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.fontFamily": "LXGW WenKai Mono GB Screen",
  "editor.fontLigatures": true,
  "editor.lineHeight": 22,
  "editor.fontSize": 16,
  "editor.wordWrap": "bounded",
  "editor.autoIndent": "advanced",
  "editor.tabSize": 4,
  "editor.autoClosingBrackets": "always",
  "editor.autoClosingDelete": "always",
  "editor.minimap.renderCharacters": false,
  "editor.minimap.showRegionSectionHeaders": true,
  "editor.unicodeHighlight.nonBasicASCII": false,
  "editor.stickyScroll.enabled": false,
  "editor.unicodeHighlight.allowedLocales": {
    "zh-hans": true,
    "zh-hant": true
  },
  "editor.accessibilitySupport": "off",
  "git.confirmSync": false,
  "git.autofetch": true,
  "gitlens.views.commitDetails.files.layout": "list",
  "gitlens.ai.experimental.model": "openai:gpt-4o",
  "gitlens.launchpad.indicator.enabled": false,
  "gitlens.views.worktrees.files.layout": "tree",
  "[css]": {
    "editor.DefaultFormatter": "esbenp.prettier-vscode",
  },
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  },
  "[javascript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "[json]": {},
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[markdown]": {
    "editor.defaultFormatter": "yzhang.markdown-all-in-one",
    "diffEditor.ignoreTrimWhitespace": false
  },
  "[python]": {
    "editor.formatOnSave": true,
    "editor.formatOnSaveMode": "file",
    "editor.formatOnType": false
  },
  "[sass]": {},
  "[scss]": {
    "editor.defaultFormatter": "vscode.css-language-features"
  },
  "[typescript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "[vue]": {},
  "Codegeex.Chat.LanguagePreference": "中文",
  "Codegeex.Comment.LanguagePreference": "中文",
  "Codegeex.Privacy": true,
  "accessibility.verbosity.debug": true,
  "debug.inlineValues": "on",
  "diffEditor.ignoreTrimWhitespace": false,
  "errorLens.excludeBySource": [
    "ts(2528)"
  ],
  "eslint.options": {
    "plugins": [
      "html"
    ]
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "html"
  ],
  "files.autoSave": "afterDelay",
  "npm.registry": "https://registry.npmmirror.com",
  "npm.updateStrategy": "LATEST",
  "prettier.configPath": "C:\\Users\\zxc66\\Workspace\\.vscode\\.pretter.yaml",
  "search.actionsPosition": "auto",
  "search.decorations.colors": true,
  "search.searchEditor.singleClickBehaviour": "peekDefinition",
  "termial.integrated.background": "#22221b",
  "todo-tree.filtering.excludeGlobs": [
    "**/node_modules/*/**",
    "**/build/*/**",
    "db.json"
  ],
  "todo-tree.filtering.passGlobsToRipgrep": true,
  "todo-tree.general.showActivityBarBadge": true,
  "todo-tree.general.statusBar": "total",
  "todo-tree.general.tagGroups": {
    "YCTODO": [
      "yctodo"
    ],
    "YCDONE": [
      "ycdone"
    ],
    "YCBUG": [
      "ycbug"
    ],
    "YCMARK": [
      "ycmark"
    ],
    "YCTAG": [
      "yctag",
      "#"
    ]
  },
  "todo-tree.general.tags": [
    "YCTODO",
    "yctodo",
    "YCDONE",
    "YCBUG",
    "YCMARK",
    "YCTAG",
    "YCDONE"
  ],
  "todo-tree.highlights.customHighlight": {
    "YCTODO": {
      "icon": "check",
      "foreground": "#fff",
      "background": "#114b10f2"
    },
    "YCBUG": {
      "icon": "bug",
      "foreground": "#ff0000"
    },
    "YCMARK": {
      "icon": "tools",
      "foreground": "#e8ed65"
    },
    "YCDONE": {
      "icon": "bug",
      "background": "#241eddbe",
      "foreground": "#fff"
    },
    "YCTAG": {
      "icon": "tag",
      "background": "#c517a8cc",
      "foreground": "#fff"
    },
    "[ ]": {
      "icon": "issue-draft"
    }
  },
  "todo-tree.regex.regex": "(|(//)|@|#|<!--|;|/\\*|^|^\\s*(-|\\d+.))\\s*($TAGS)",
  "todo-tree.tree.autoRefresh": true,
  "todo-tree.tree.groupedByTag": true,
  "todo-tree.tree.showCountsInTree": true,
  "vim.enableNeovim": true,
  "vim.neovimUseConfigFile": true,
  "vim.incsearch": true,
  "vim.insertModeKeyBindings": [
    {
      "before": [
        "j",
        "j"
      ],
      "after": [
        "<Esc>"
      ]
    }
  ],
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": [
        "<leader>",
        "d"
      ],
      "after": [
        "d",
        "d"
      ]
    },
    {
      "before": [
        "<C-n>"
      ],
      "commands": [
        ":nohl"
      ]
    },
    {
      "before": [
        "K"
      ],
      "commands": [
        "lineBreakInsert"
      ],
      "silent": true
    }
  ],
  "vim.leader": "<space>",
  "vim.handleKeys": {
    "<C-a>": false,
    "<C-f>": false
  },
  "extensions.experimental.affinity": {
    "vscodevim.vim": 1
  },
  "vim.commandLineModeKeyBindingsNonRecursive": [],
  "vim.easymotion": true,
  "vim.hlsearch": true,
  "vim.operatorPendingModeKeyBindings": [],
  "vim.smartRelativeLine": true,
  "vim.useCtrlKeys": true,
  "vim.useSystemClipboard": true,
  // "vim.vimrc.enable": true,
  // "vim.vimrc.path": "c:\\Users\\zxc66\\Workspace\\vimrc",
  "vscodeGoogleTranslate.preferredLanguage": "Chinese (Simplified)",
  "workbench.editorAssociations": {
    "*.vsix": "default",
    "*.yml": "default"
  },
  "Codegeex.License": "",
  "better-comments.tags": [
    {
      "tag": "!",
      "color": "#FF2D00",
      "strikethrough": false,
      "underline": false,
      "backgroundColor": "transparent",
      "bold": false,
      "italic": false
    },
    {
      "tag": "?",
      "color": "#3498DB",
      "strikethrough": false,
      "underline": false,
      "backgroundColor": "transparent",
      "bold": false,
      "italic": false
    },
    {
      "tag": "//",
      "color": "#474747",
      "strikethrough": true,
      "underline": false,
      "backgroundColor": "transparent",
      "bold": false,
      "italic": false
    },
    {
      "tag": "-",
      "color": "#478149",
      "strikethrough": false,
      "underline": false,
      "backgroundColor": "transparent",
      "bold": false,
      "italic": false
    },
    {
      "tag": "*",
      "color": "#98C379",
      "strikethrough": false,
      "underline": false,
      "backgroundColor": "transparent",
      "bold": false,
      "italic": false
    }
  ],
  "git.ignoreRebaseWarning": true,
  "Codegeex.CompletionDelay": 1,
  "Codegeex.CompletionModel": "CodeGeeX Pro[Beta]",
  "Codegeex.GenerationPreference": "line by line",
  "marscode.codeCompletionPro": {
    "enableCodeCompletionPro": true
  },
  "editor.unicodeHighlight.ambiguousCharacters": false,
  "material-icon-theme.folders.theme": "specific",
  "workbench.panel.showLabels": false,
  "gitlens.ai.model": "openai:gpt-4o",
  "workbench.colorTheme": "Ayu Mirage Bordered",
  "AI.toolcall.confirmMode": "autoRun"
}
```
