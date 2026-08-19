import os, re, sys, json
sys.stdout.reconfigure(encoding='utf-8')
CONTENT = r"D:\Workspace\pedyc\site\apps\dg\content"
PAIRS = {'P-AI学习计划':'AI学习计划','P-构建一个智能体':'构建一个智能体','MOC-OpenClaw-Skills清单':'OpenClaw-Skills清单','P-斑驳光背景实现':'斑驳光背景实现','P-前端能力提升专项':'前端能力提升专项','P-后端能力提升专项':'后端能力提升专项','P-求职前端岗位':'求职前端岗位','P-算法提升专项':'算法提升专项','C-撒旦教':'撒旦教','C-超验':'超验','MOC-AI Agent 与工具':'AI Agent 与工具','MOC-LLM 基础':'LLM 基础','MOC-OpenClaw':'OpenClaw','MOC-PWA应用案例':'PWA应用案例','MOC-Vite相关问题':'Vite相关问题','MOC-Webpack相关问题':'Webpack相关问题','MOC-前端工程化工具':'前端工程化工具','MOC-前端构建与打包':'前端构建与打包','MOC-前端缓存方案':'前端缓存方案','MOC-前端面试真题库':'前端面试真题库','MOC-前端面试知识清单':'前端面试知识清单','MOC-后端能力提升指南':'后端能力提升指南','MOC-哲学与认知':'哲学与认知','MOC-心流体验':'心流体验','MOC-时政':'时政','MOC-浏览器兼容性问题':'浏览器兼容性问题','MOC-神秘主义':'神秘主义','MOC-算法真题库':'算法真题库','Q-qiankun和ModuleFederation怎么选':'qiankun和ModuleFederation怎么选','Q-useEffect依赖数组为什么不能使用对象':'useEffect依赖数组为什么不能使用对象','Q-useState的参数为什么不能直接用对象写法':'useState的参数为什么不能直接用对象写法','Q-Vapor Mode是什么':'Vapor Mode是什么','Q-Vue编译器如何优化':'Vue编译器如何优化','Q-为什么useEffect需要return-cleanup函数':'为什么useEffect需要return-cleanup函数','Q-为什么使用SSR（服务端渲染）？':'为什么使用SSR（服务端渲染）？','Q-何时选微前端或Monorepo':'何时选微前端或Monorepo','Q-如何识别系统中的增强回路和调节回路':'如何识别系统中的增强回路和调节回路','Q-如何选择前端监控方案':'如何选择前端监控方案','Q-微前端vsMonorepo性能对比':'微前端vsMonorepo性能对比','R-简历素材':'简历素材','SOP-AI输出质量评估':'AI输出质量评估','SOP-Babel使用指南':'Babel使用指南','SOP-CSS实现文字横向滚动效果':'CSS实现文字横向滚动效果','SOP-ThreeJS实现3D视差滚动':'ThreeJS实现3D视差滚动','SOP-ThreeJS实现平面凹凸效果':'ThreeJS实现平面凹凸效果','SOP-useCallback使用示例':'useCallback使用示例','SOP-Vite配置流程':'Vite配置流程','SOP-从问题到图形的决策路径':'从问题到图形的决策路径','SOP-使用Claude-Code开发React组件':'使用Claude-Code开发React组件','SOP-使用Claude-Code自动化CI-CD流水线':'使用Claude-Code自动化CI-CD流水线','SOP-前端监控指标采集':'前端监控指标采集','SOP-前端面试的算法提升指南':'前端面试的算法提升指南','SOP-在Next.js中使用Hydration':'在Next.js中使用Hydration','SOP-在React中实现ASCII动画':'在React中实现ASCII动画','SOP-在React中实现文字故障效果':'在React中实现文字故障效果','SOP-在React中正确使用Ref':'在React中正确使用Ref','SOP-在WSL2中安装OpenClaw':'在WSL2中安装OpenClaw','SOP-如何在Vite中配置环境变量？':'如何在Vite中配置环境变量？','SOP-如何在WSL中配置并运行自定义systemd服务？':'如何在WSL中配置并运行自定义systemd服务？','SOP-如何在四象限中应用精力成本':'如何在四象限中应用精力成本','SOP-实现磁吸式光标':'实现磁吸式光标','SOP-开发一个最小PWA应用':'开发一个最小PWA应用','SOP-微前端ModuleFederation方案':'微前端ModuleFederation方案','SOP-微前端WebComponents封装':'微前端WebComponents封装','SOP-微前端沙箱隔离':'微前端沙箱隔离','SOP-微前端路由分发模式':'微前端路由分发模式','SOP-提示词工程最佳实践':'提示词工程最佳实践','SOP-混合型PKM构建指南':'混合型PKM构建指南','SOP-视觉工具选择矩阵':'视觉工具选择矩阵','SOP-视觉思维工作流':'视觉思维工作流','SOP-调试JavaScript内存泄漏':'调试JavaScript内存泄漏','T-AutoHotKey':'AutoHotKey','T-帧动画':'帧动画','VS-async vs defer':'async vs defer','VS-Vue2 vs Vue3':'Vue2 vs Vue3','VS-Vuex vs Pinia':'Vuex vs Pinia'}

def parse_fm(txt):
    fm = {}
    m = re.match(r'^---\n(.*?)\n---', txt, re.S)
    if not m: return fm
    body = m.group(1)
    tm = re.search(r'^title:\s*["\']?([^"\'\n]+?)["\']?\s*$', body, re.M)
    if tm: fm['title'] = tm.group(1).strip()
    am = re.search(r'^aliases:\s*(\[.*?\])\s*$', body, re.M | re.S)
    aliases = []
    if am:
        try: aliases = json.loads(am.group(1).replace("'", '"'))
        except Exception:
            aliases = [x.strip().strip('"').strip("'") for x in am.group(1)[1:-1].split(',')]
    else:
        bm = re.search(r'^aliases:\s*\n((?:^\s*-\s*.+\n?)+)', body, re.M)
        if bm:
            aliases = [re.sub(r'^\s*-\s*["\']?([^"\'\n]+)["\']?\s*$', r'\1', l, flags=re.M).strip() for l in bm.group(1).strip().splitlines()]
    fm['aliases'] = aliases
    return fm

notes = []
resolvable = set()
for root, dirs, files in os.walk(CONTENT):
    dirs[:] = [d for d in dirs if not d.startswith('.')]
    rel = os.path.relpath(root, CONTENT)
    if rel == '.' or any(x in rel for x in ('40-ARCHIVE','99-ASSETS','_templates','.obsidian')): continue
    for f in files:
        if not f.endswith('.md'): continue
        p = os.path.join(root, f); rp = os.path.relpath(p, CONTENT)
        fm = parse_fm(open(p, encoding='utf-8').read())
        notes.append((rp, f[:-3], fm.get('title',''), fm.get('aliases',[])))
        for nm in [f[:-3], fm.get('title','')] + fm.get('aliases',[]):
            if nm: resolvable.add(nm.strip())

def resolves(ref):
    if ref in resolvable: return True
    return any(('/'+rp.lower()).endswith('/'+ref.lower()) for rp,fn,ti,al in notes)

print("== A) 76 个迁移旧名可解析性 ==")
bad = [old for old in PAIRS if not resolves(old)]
print("  不可解析旧名：%d %s" % (len(bad), "无，全部通过 OK" if not bad else bad))

print("\n== B) 活跃文件残留前缀引用分类 ==")
EXCL_DIR = ('/40-ARCHIVE/', '/99-ASSETS/', '/_templates/', '/.obsidian/')
EXCL_FILE = ('wiki-log.md', 'suggest-log.md')
mig_breaks, preexisting, resolved = [], [], 0
for root, dirs, files in os.walk(CONTENT):
    dirs[:] = [d for d in dirs if not d.startswith('.')]
    for f in files:
        if not f.endswith('.md'): continue
        rel = os.path.relpath(os.path.join(root, f), CONTENT)
        if any(x in '/'+rel for x in EXCL_DIR): continue
        if f in EXCL_FILE: continue
        txt = open(os.path.join(root, f), encoding='utf-8').read()
        for m in re.finditer(r'!?\[\[((?:P-|A-|Q-|MOC-|SOP-|T-|C-|VS-|R-|FAQ-)[^\]\n]+?)(?:\]\]|[\|#])', txt):
            ref = m.group(1).strip()
            if ref in ('C-神秘主义','MOC-浏览器原理与运行机制相关问题','T-will-change'): continue
            if ref in PAIRS: mig_breaks.append((rel, ref))
            elif resolves(ref): resolved += 1
            else: preexisting.append((rel, ref))
print("  迁移断裂：%d %s" % (len(mig_breaks), mig_breaks if mig_breaks else "OK 无"))
print("  可解析（经别名）：%d" % resolved)
print("  迁移前即悬空（规划中笔记）：%d" % len(preexisting))

print("\n== C) 排除目录中旧前缀引用解析（别名恢复后）==")
ex_res, ex_bad = [], []
for root, dirs, files in os.walk(CONTENT):
    dirs[:] = [d for d in dirs if not d.startswith('.')]
    rel = os.path.relpath(root, CONTENT)
    if rel == '.' or not any(x in rel for x in ('40-ARCHIVE','99-ASSETS','_templates','.obsidian')): continue
    for f in files:
        if not f.endswith('.md'): continue
        rp = os.path.relpath(os.path.join(root, f), CONTENT)
        txt = open(os.path.join(root, f), encoding='utf-8').read()
        for m in re.finditer(r'!?\[\[([^\]\n]+?)(?:\]\]|[\|#])', txt):
            ref = m.group(1).strip().split('#')[0].split('|')[0]
            if ref in PAIRS:
                if resolves(ref): ex_res.append(ref)
                else: ex_bad.append((rp, ref))
print("  可解析旧前缀引用：%d（%d 个不同名）" % (len(ex_res), len(set(ex_res))))
print("  仍不可解析：%d %s" % (len(ex_bad), ex_bad if ex_bad else "OK 无"))
