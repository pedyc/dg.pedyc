" 基本设置
set number              " 显示行号
set relativenumber      " 显示相对行号（方便导航）
set cursorline          " 高亮当前行
; syntax on               " 语法高亮
set tabstop=2           " Tab显示为2个空格
set shiftwidth=2        " 自动缩进使用2个空格
set expandtab           " 将Tab转换为空格
set smartindent         " 智能缩进
set ignorecase          " 搜索忽略大小写
set smartcase           " 智能大小写（包含大写时区分大小写）
set incsearch           " 实时搜索高亮
set hlsearch            " 高亮搜索结果
set mouse=a             " 启用鼠标支持

" 文件编码
set encoding=utf-8
set fileencodings=utf-8,ucs-bom,gb18030,gbk,gb2312,cp936

" 备份设置
set nobackup            " 不生成备份文件
set nowritebackup
set noswapfile          " 不生成交换文件

" 键位映射
let mapleader = " "     " 设置Leader键为空格
noremap <leader>w :w<CR> " 快速保存
noremap <leader>q :q<CR> " 快速退出

" 行移动（支持普通模式和可视模式）
nnoremap <C-Up> :<C-u>silent! move-2<CR>==
nnoremap <C-Down> :<C-u>silent! move+<CR>==
vnoremap <C-Up> :<C-u>silent! '<,'>move-2<CR>gv=gv
vnoremap <C-Down> :<C-u>silent! '<,'>move'>+<CR>gv=gv

" 窗口导航
map <C-h> <C-w>h       " Ctrl+h 切换到左侧窗口
map <C-j> <C-w>j       " Ctrl+j 切换到下方窗口
map <C-k> <C-w>k       " Ctrl+k 切换到上方窗口
map <C-l> <C-w>l       " Ctrl+l 切换到右侧窗口

" 插件管理（使用vim-plug）
; call plug#begin('~/.vim/plugged')
; Plug 'morhetz/gruvbox'          " 配色方案
; Plug 'vim-airline/vim-airline'  " 状态栏
; Plug 'preservim/nerdtree'       " 文件浏览器
; Plug 'neoclide/coc.nvim', {'branch': 'release'} " 代码补全
; call plug#end()

" 颜色主题
set termguicolors     " 启用真彩色
colorscheme gruvbox   " 使用gruvbox配色
set background=dark   " 深色模式

" 其他优化
set autochdir         " 自动切换工作目录到当前文件
set scrolloff=5       " 保持光标距离顶部/底部5行
set signcolumn=yes    " 侧边栏显示标记（用于LSP错误提示）
set updatetime=300    " 更快的更新间隔（用于插件响应）
