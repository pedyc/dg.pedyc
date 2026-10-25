/**
 * 把 00-INBOX 里超过 14 天未转化的笔记移入 40-ARCHIVE
 *
 * Inbox 本身就是待消化队列，只有一层，不设子目录区分。
 * 归档不是丢弃：40-ARCHIVE 免维护，需要时按文件名取回即可。
 *
 * 判据只用文件系统 ctime——它记录文件**进入 vault 的时刻**，不依赖任何字段。
 *
 * 不能用 frontmatter 的 `date-created`：2026-10-25 实测，剪藏笔记里这个字段存的
 * 是**网页发布时间**（2026-03-01 / 04-23 等），于是重启一次就把刚剪藏的老文章
 * 整批判成 200 天以上、全部搬走。判的不是「两周没处理」，是「文章本身写得早」。
 *
 * `inbox.children` 只含直接子项，文件夹条目会被下面的 TFile 判断挡掉，
 * 所以将来若在 Inbox 下建子目录，它不会被动到。
 */
async function autoArchiveInbox(tp) {
    const INBOX_PATH = "00-INBOX";
    const ARCHIVE_PATH = "40-ARCHIVE";
    const EXPIRE_DAYS = 14;
    const DAY_MS = 1000 * 60 * 60 * 24;

    // 等 Obsidian 布局就绪，避免开机太快读不到文件
    if (!app.workspace.layoutReady) {
        await new Promise((resolve) => app.workspace.onLayoutReady(resolve));
    }

    const inbox = app.vault.getAbstractFileByPath(INBOX_PATH);
    if (!inbox) {
        console.error(`Inbox 归档：找不到文件夹 ${INBOX_PATH}`);
        return;
    }

    if (!app.vault.getAbstractFileByPath(ARCHIVE_PATH)) {
        await app.vault.createFolder(ARCHIVE_PATH);
    }

    // 用副本遍历：移动文件会改变 children 数组，边遍历边改会跳过下一个
    const snapshot = [...inbox.children];
    const now = Date.now();
    let archived = 0;

    for (const file of snapshot) {
        if (!(file instanceof tp.obsidian.TFile)) continue;
        if (file.extension !== "md") continue;

        const days = (now - file.stat.ctime) / DAY_MS;
        if (days <= EXPIRE_DAYS) continue;

        const newPath = `${ARCHIVE_PATH}/${file.name}`;
        if (app.vault.getAbstractFileByPath(newPath)) {
            console.log(`Inbox 归档：跳过 ${file.name}（40-ARCHIVE 已有同名）`);
            continue;
        }

        console.log(`Inbox 归档：${file.name}（滞留 ${Math.floor(days)} 天）`);
        await app.fileManager.renameFile(file, newPath);
        archived++;
    }

    if (archived > 0) {
        new Notice(`Inbox 归档：移动了 ${archived} 篇滞留超过 ${EXPIRE_DAYS} 天的笔记`);
    } else {
        console.log("Inbox 归档：没有需要归档的笔记");
    }
}

module.exports = autoArchiveInbox;
