---
uid: <% tp.file.creation_date("YYYYMMDDHHmm") %>
title: "<% tp.file.title %>"
aliases: ["<% tp.file.title %>"]
description: "第 <% tp.date.now('gggg-[W]ww') %> 周周期性回顾与原子知识洞察流转图谱"
tags: [周回顾, weekly, diary]
status: active
content-type: diary
date-created: <% tp.date.now("YYYY-MM-DD") %>
# 选填备用字段：如果想自定义或跨自然周，可显式填写，Dataview 会优先采用它
date-range: [<% tp.date.weekday("YYYY-MM-DD", 0) %>, <% tp.date.weekday("YYYY-MM-DD", 6) %>]
up: "[[90-DIARY/]]"
---
```dataviewjs
// 1. 获取当前笔记的标题（兼容 title 属性与实际文件名）
const titleStr = dv.current().title || dv.current().file.name;

// 2. 正则匹配类似 2026-W36、2026-W37 等 ISO 周格式
const weekMatch = titleStr.match(/(\d{4})-[wW](\d{1,2})/);

if (!weekMatch) {

    dv.paragraph(
        "⚠️ **无法从标题解析周数**：请确保周记标题符合 `YYYY-Www` 格式（例如 `2026-W36`）"
    );

} else {

    const year = parseInt(weekMatch[1], 10);
    const week = parseInt(weekMatch[2], 10);

    // 3. 计算该 ISO 周的周一 00:00 与周日 23:59
    const startOfWeek = moment()
        .year(year)
        .isoWeek(week)
        .startOf('isoWeek');

    const endOfWeek = moment()
        .year(year)
        .isoWeek(week)
        .endOf('isoWeek');

    dv.paragraph(
        `> 📅 **本周知识沉淀统计周期**：` +
        `\`${startOfWeek.format('YYYY-MM-DD')}\` ～ ` +
        `\`${endOfWeek.format('YYYY-MM-DD')}\``
    );

    // 4. 获取两个目录下的全部页面
    //    只保留 atomic / concept / question / sop
    const pages = dv.pages('"50-ZETTELCASTEN" or "30-RESOURCES"')
        .where(p => {

            const type = p['content-type'];

            if (
                type !== 'atomic' &&
                type !== 'concept' &&
                type !== 'question' &&
                type !== 'sop'
            ) {
                return false;
            }

            // 优先使用 date-created
            // 缺失时使用文件系统创建时间 cday
            const createdStr = p['date-created']
                ? p['date-created'].toString()
                : null;

            const noteDate = createdStr
                ? moment(createdStr, 'YYYY-MM-DD')
                : moment(p.file.cday.toISODate());

            // 严格限制在当前 ISO 周
            return noteDate.isBetween(
                startOfWeek,
                endOfWeek,
                null,
                '[]'
            );
        })
        .sort(
            p => p['date-created'] || p.file.cday,
            'desc'
        );

    // 5. 按 content-type 分组
    const grouped = pages.groupBy(p => p['content-type']);

    // ============================================================
    // A. Atomic
    // ============================================================

    const atomicGroup = grouped.find(g => g.key === 'atomic');

    dv.header(
        4,
        `🧠 本周原子洞察（Atomic · ${
            atomicGroup ? atomicGroup.rows.length : 0
        } 篇）`
    );

    if (atomicGroup && atomicGroup.rows.length > 0) {

        dv.table(
            [
                "新增原子笔记（陈述句核心观点）",
                "挂载父级（Concept）",
                "状态",
                "创建日期"
            ],
            atomicGroup.rows.map(p => [
                p.file.link,
                p.up || "-",
                p.status || "cultivating",
                p['date-created'] || p.file.cday.toISODate()
            ])
        );

    } else {

        dv.paragraph("*(本周暂无新增原子洞察)*");
    }

    // ============================================================
    // B. Concept
    // ============================================================

    const conceptGroup = grouped.find(g => g.key === 'concept');

    dv.header(
        4,
        `📚 本周概念整合（Concept · ${
            conceptGroup ? conceptGroup.rows.length : 0
        } 篇）`
    );

    if (conceptGroup && conceptGroup.rows.length > 0) {

        dv.table(
            [
                "新增概念笔记",
                "一句话定义",
                "挂载父级（Area）",
                "状态",
                "创建日期"
            ],
            conceptGroup.rows.map(p => [
                p.file.link,
                p.description || "-",
                p.up || "-",
                p.status || "cultivating",
                p['date-created'] || p.file.cday.toISODate()
            ])
        );

    } else {

        dv.paragraph("*(本周暂无新增概念笔记)*");
    }

    // ============================================================
    // C. Question
    // ============================================================

    const questionGroup = grouped.find(g => g.key === 'question');

    dv.header(
        4,
        `❓ 本周问题沉淀（Question · ${
            questionGroup ? questionGroup.rows.length : 0
        } 篇）`
    );

    if (questionGroup && questionGroup.rows.length > 0) {

        dv.table(
            [
                "问题",
                "关联主题",
                "状态",
                "创建日期"
            ],
            questionGroup.rows.map(p => [
                p.file.link,
                p.up || "-",
                p.status || "open",
                p['date-created'] || p.file.cday.toISODate()
            ])
        );

    } else {

        dv.paragraph("*(本周暂无新增问题)*");
    }

    // ============================================================
    // D. SOP
    // ============================================================

    const sopGroup = grouped.find(g => g.key === 'sop');

    dv.header(
        4,
        `🛠️ 本周流程沉淀（SOP · ${
            sopGroup ? sopGroup.rows.length : 0
        } 篇）`
    );

    if (sopGroup && sopGroup.rows.length > 0) {

        dv.table(
            [
                "SOP",
                "主题介绍",
                "关联问题",
                "状态",
                "创建日期"
            ],
            sopGroup.rows.map(p => [
                p.file.link,
                p.description || "-",
                p.up || "-",
                p.status || "draft",
                p['date-created'] || p.file.cday.toISODate()
            ])
        );

    } else {

        dv.paragraph("*(本周暂无新增 SOP)*");
    }
}
```
