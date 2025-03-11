---
topics: 
uid: 202409090005
title: vscode配置
aliases: []
author: ped_yc
description: 
tags: [config]
date-created: 2024-09-08
date-modified: 2025-02-24
status: 
alias: [vscode配置]
type: 
---

::up::[[工具及配置]]

```json
{
    "window.zoomLevel": 2,
    "workbench.iconTheme": "material-icon-theme",
    "workbench.colorTheme": "Bearded Theme HC Midnight Void",
    "workbench.colorCustomizations": {
        "editor.selectionForeground": "#f666",
        "editor.selectionHighlightBackground": "#4779d189"
    },
    "workbench.settings.applyToAllProfiles": [
        "workbench.editor.customLabels.patterns"
    ],
    "workbench.experimental.enableNewProfilesUI": true,
    "workbench.activityBar.location": "top",
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
    "editor.fontSize": 14,
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
    "git.confirmSync": false,
    "git.autofetch": true,
    "gitlens.views.commitDetails.files.layout": "list",
    "gitlens.ai.experimental.model": "openai:gpt-4o",
    "gitlens.launchpad.indicator.enabled": false,
    "gitlens.views.worktrees.files.layout": "tree",
    "[css]": {
        "editor.DefaultFormatter": "esbenp.prettier-vscode"
    },
    "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features"
    },
    "[javascript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "[json]": {
        "editor.defaultFormatter": "vscode.json-language-features"
    },
    "[jsonc]": {
        "editor.defaultFormatter": "vscode.json-language-features"
    },
    "[markdown]": {
        "editor.defaultFormatter": "yzhang.markdown-all-in-one"
    },
    "[python]": {
        "editor.formatOnSave": true,
        "editor.formatOnSaveMode": "file",
        "editor.formatOnType": false
    },
    "[sass]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[scss]": {
        "editor.defaultFormatter": "sibiraj-s.vscode-scss-formatter"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[vue]": {
        "editor.defaultFormatter": "Wscats.vue"
    },
    "Codegeex.Chat.LanguagePreference": "中文",
    "Codegeex.Comment.LanguagePreference": "English",
    "Codegeex.Privacy": true,
    "accessibility.verbosity.debug": true,
    "breadcrumbs.enabled": true,
    "cSpell.allowCompoundWords": false,
    "cSpell.enabled": true,
    "cSpell.enabledLanguageIds": [
        "csharp",
        "go",
        "javascript",
        "javascriptreact",
        "markdown",
        "php",
        "plaintext",
        "typescript",
        "typescriptreact",
        "yml",
        "sql"
    ],
    "cSpell.flagWords": [
        "hte"
    ],
    "cSpell.ignorePaths": [
        "node_modules", // this will ignore anything the node_modules directory
        "**/node_modules", // the same for this one
        "**/node_modules/**", // the same for this one
        "node_modules/**", // Doesn't currently work due to how the current working directory is determined.
        "vscode-extension", //
        ".git", // Ignore the .git directory
        "*.dll", // Ignore all .dll files.
        "**/*.dll" // Ignore all .dll files
    ],
    "cSpell.ignoreWords": [
        "behaviour"
    ],
    "cSpell.language": "en",
    "cSpell.maxNumberOfProblems": 100,
    "cSpell.minWordLength": 4,
    "cSpell.numSuggestions": 8,
    "cSpell.showStatus": true,
    "cSpell.spellCheckDelayMs": 50,
    "cSpell.userWords": [
        "Altica",
        "autofetch",
        "Codegeex",
        "Colour",
        "easymotion",
        "endregion",
        "esbenp",
        "Fira",
        "hlsearch",
        "hte",
        "Inparent",
        "nico",
        "openai",
        "pretter",
        "Shiki",
        "Typscript",
        "vitepress",
        "vscodevim",
        "worktrees",
        "Wscats",
        "YCBUG",
        "YCDONE",
        "YCFIXME",
        "YCMARK",
        "YCTAG",
        "YCTODO",
        "yzhang"
    ],
    "debug.inlineValues": "on",
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
    "todo-tree.filtering.excludeGlobs": [
        "**/node_modules/*/**",
        "**/dist/*/**",
        "**/build/*/**",
        // "**/out/*/**",
        // "**/coverage/*/**",
        // "**/docs/*/**",
        // "**/examples/*/**",
        // "**/test/*/**",
        // "**/tests/*/**",
        // "**/tmp/*/**",
        // "**/temp/*/**",
        // "**/tmp/*/**",
        // "**/temp/*/**",
        // "**/tmp/*/**",
        // "**/temp/*/**",
        // "**/tmp/*/**",
        // "**/temp/*/**",
        // "**/tmp/*/**",
        // "**/temp/*/**",
        "db.json"
    ],
    "todo-tree.filtering.passGlobsToRipgrep": true,
    "todo-tree.general.showActivityBarBadge": true,
    "todo-tree.general.statusBar": "total",
    "todo-tree.general.tagGroups": {
        "YCTODO": [
            // "TODO",
            "yctodo"
        ],
        "YCDONE": [
            // "DONE",
            "ycdone"
        ],
        "YCBUG": [
            // "BUG",
            "ycbug"
        ],
        "YCMARK": [
            // "MARK",
            "ycmark"
        ],
        "YCTAG": [
            // "TAG",
            "yctag"
        ]
    },
    "todo-tree.general.tags": [
        "YCTODO",
        "YCDONE",
        "YCBUG",
        "YCMARK",
        "YCTAG",
        "YCDONE"
    ],
    "todo-tree.highlights.customHighlight": {
        "YCTODO": {
            "icon": "check",
            "foreground": "#1eec1bf2"
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
    "vim.commandLineModeKeyBindingsNonRecursive": [],
    "vim.easymotion": true,
    "vim.handleKeys": {
        "<C-a>": false,
        "<C-f>": false,
        "<C-w>": false,
        "<C-k>": false,
        "<C-n>": false,
        "<C-o>": false,
        "<C-d>": false
    },
    "vim.hlsearch": true,
    "vim.insertModeKeyBindings": [],
    "vim.leader": "<space>",
    "vim.normalModeKeyBindingsNonRecursive": [
        {},
        {
            "before": [
                "<leader>",
                "d"
            ],
            "commands": [
                "workbench.action.closeActiveEditor"
            ]
        }
    ],
    "vim.operatorPendingModeKeyBindings": [],
    "vim.smartRelativeLine": true,
    "vim.useCtrlKeys": true,
    "vim.useSystemClipboard": true,
    "vim.vimrc.enable": true,
    "vim.vimrc.path": "\\.vscode\\vimrc",
    "vscodeGoogleTranslate.preferredLanguage": "Chinese (Simplified)"
}
```
