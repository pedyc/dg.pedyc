"""按映射表给 atomic 补 up 字段（单父级用标量 "[[X]]"）。

映射表写死在 MAPPING 里，逐篇人工判定后填入；脚本只负责落地，不做推断。
- 已有 up 行（含空值）→ 替换该行
- 没有 up 行 → 插到 content-type 行之后
- 写入统一用 LF
"""
import sys
from pathlib import Path

VAULT = Path(__file__).resolve().parent.parent
ZET = VAULT / "50-ZETTELCASTEN"

MAPPING = {
    "Agent = LLM + 上下文 + 工具": "Agent",
    "await关键字是让出线程的标志": "事件循环",
    "HTTP2 通过多路复用实现真正的并发请求": "HTTP",
    "NextJS 的本质是 React 框架与服务端能力的深度融合": "NextJS",
    "NextJS 首屏渲染不需要 JS 引擎参与但 hydration 仍然需要": "NextJS",
    "React Fiber 是可中断的增量渲染架构": "Fiber",
    "React Fiber 的时间切片基于优先级调度": "Fiber",
    "React Fiber 采用链表结构代替递归": "Fiber",
    "React RSC 是发动机技术而非完整汽车框架": "React",
    "React 中的 setState 是同步还是异步的？为什么有时候打印不到最新值？": "React 重新渲染",
    "React.memo通过浅比较props决定是否重新渲染": "React性能优化",
    "个人品牌构建的核心在于通过持续的价值输出，提升在特定领域的可见度和影响力": "个人品牌构建概述",
    "信源的产出率衡量的是转化效率而非信源价值": "信源质量审计标准",
    "冒烟测试的本质是以极低成本快速证伪而非证明系统合格": "冒烟测试",
    "函数组件每次渲染都重新执行，为什么 React 还能保留状态、函数引用？这些数据是怎么“记住”的？": "Hooks(React)",
    "原子笔记强调一个笔记只阐述一个观点": "卡片盒笔记法",
    "原子笔记本身已经是高信噪比产物": "卡片盒笔记法",
    "否定是扬弃，既克服又保留": "否定之否定",
    "在Vue3中解构响应式对象会丢失响应性": "Vue3响应式原理",
    "外部大脑能释放前额叶的认知负荷": "认知负荷",
    "宏语法在编译时处理": "Vue",
    "知识只有被调用时才产生价值": "知识管理",
    "笔记原子化的拆分标准是用一句话能陈述一个观点": "原子笔记拆分标准",
    "笔记处理应在使用时而非定期": "知识管理",
    "给富人减税理论上能惠及穷人": "涓滴效应",
    "让风险可见，胜过消灭表面风险": "维尔达效应",
    "设计冒烟测试主要权衡业务核心链路与外部强依赖": "冒烟测试",
}


def apply(path: Path, target: str) -> bool:
    raw = path.read_bytes().decode("utf-8", errors="ignore").replace("\r\n", "\n")
    lines = raw.split("\n")
    new_line = f'up: "[[{target}]]"'
    out = []
    done = False
    for line in lines:
        if line.startswith("up:"):
            out.append(new_line)
            done = True
            continue
        out.append(line)
        if not done and line.startswith("content-type:"):
            out.append(new_line)
            done = True
    if not done:
        return False
    path.write_bytes("\n".join(out).encode("utf-8"))
    return True


def main() -> int:
    ok, miss = 0, []
    for stem, target in MAPPING.items():
        p = ZET / f"{stem}.md"
        if not p.exists():
            miss.append(stem)
            continue
        if apply(p, target):
            ok += 1
            print(f"✓ {stem}  →  {target}")
        else:
            miss.append(f"{stem}（缺少 content-type 行）")
    print(f"\n已写入 {ok} 篇")
    if miss:
        print("未处理：")
        for m in miss:
            print(f"  ✗ {m}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
