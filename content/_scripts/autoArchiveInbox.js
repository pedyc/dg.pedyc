/**
 * 自动归档 Inbox 中过期的笔记 (最终修复版 - 解决遍历跳过问题)
 */
async function autoArchiveInbox(tp) {
    const INBOX_PATH = "PARA/30-RESOURCES/00 Inbox";
    const ARCHIVE_PATH = "PARA/30-RESOURCES/Archive";
    const EXPIRE_DAYS = 14;

    // 1. 等待 Obsidian 索引完全加载 (避免开机太快读不到文件)
    if (!app.workspace.layoutReady) {
        console.log("AI Archive: 等待 Obsidian 布局就绪...");
        await new Promise(resolve => app.workspace.onLayoutReady(resolve));
    }
    // 额外缓冲，确保 MetadataCache 读取完毕
    await new Promise(resolve => setTimeout(resolve, 2000));

    const inboxFolder = app.vault.getAbstractFileByPath(INBOX_PATH);
    if (!inboxFolder) {
        console.error("AI Archive: ❌ 找不到文件夹 " + INBOX_PATH);
        return;
    }

    // 确保目标文件夹存在
    if (!app.vault.getAbstractFileByPath(ARCHIVE_PATH)) {
        await app.vault.createFolder(ARCHIVE_PATH);
    }

    // === 🔴 核心修复：使用 [...array] 创建数组副本 ===
    // 如果直接用 inboxFolder.children，移动一个文件后，数组长度会变，导致跳过下一个文件
    const filesSnapshot = [...inboxFolder.children];

    console.log(`AI Archive: 扫描中，快照包含 ${filesSnapshot.length} 个项目`);

    let archivedCount = 0;
    const now = Date.now();

    for (const file of filesSnapshot) {
        // 再次检查文件是否存在（防止在等待期间被手动删除了）
        if (!file || !file.parent || file.parent.path !== INBOX_PATH) continue;

        if (file instanceof tp.obsidian.TFile && file.extension === "md") {
            // 获取时间逻辑
            const cache = app.metadataCache.getFileCache(file);
            const dateCreatedStr = cache?.frontmatter?.["date-created"];

            let targetTime;
            let dateSource = "ctime";

            if (dateCreatedStr) {
                const parsedDate = new Date(dateCreatedStr);
                if (!isNaN(parsedDate.getTime())) {
                    targetTime = parsedDate.getTime();
                    dateSource = `YAML`;
                } else {
                    targetTime = file.stat.ctime;
                    dateSource = "ctime(YAML无效)";
                }
            } else {
                targetTime = file.stat.ctime;
            }

            const diffDays = (now - targetTime) / (1000 * 60 * 60 * 24);

            if (diffDays > EXPIRE_DAYS) {
                const newPath = `${ARCHIVE_PATH}/${file.name}`;

                // 检查 Archive 里是否已有同名文件
                if (!app.vault.getAbstractFileByPath(newPath)) {
                    console.log(`✅ 归档: ${file.name} (超过 ${diffDays.toFixed(1)} 天)`);

                    // 执行移动
                    await app.fileManager.renameFile(file, newPath);
                    archivedCount++;
                } else {
                    console.log(`⚠️ 跳过: ${file.name} (Archive 中已存在)`);
                }
            }
        }
    }

    if (archivedCount > 0) {
        new Notice(`🧹 Inbox 归档完成：移动了 ${archivedCount} 个文件`);
        console.log(`AI Archive: 总计移动 ${archivedCount} 个文件`);
    } else {
        console.log("AI Archive: 扫描完成，无过期文件。");
    }
}

module.exports = autoArchiveInbox;