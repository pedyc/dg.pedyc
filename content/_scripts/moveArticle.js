module.exports = async (params) => {
  const { moment, app } = params;
  const fs = app.vault.adapter;
  const DAILY_JOURNAL_PATH = "bins/daily";
  const ARTICLE_PATH = "bins/pkm/source";

  // 获取标准化日期格式
  const getFormattedDate = () => moment.format("YYYY-MM-DD");

  // 生成文章链接
  const generateArticleLink = async (articles) => {
    let content = "\n## 今日关联文章\n";
    for (const file of articles) {
      const satats = await fs.stat(file.path);
    }
  };
};

module.exports = async (params) => {
  const { moment, app } = params;
  const fs = app.vault.adapter;
  const DAILY_JOURNAL_PATH = "bins/daily";
  const ARTICLES_PATH = "articles";

  // 获取标准化日期格式
  const getFormattedDate = () => moment().format("YYYY-MM-DD");

  // 生成文章链接内容
  const generateArticleLinks = async (articles) => {
    let content = "\n## 今日关联文章\n";
    for (const file of articles) {
      const stats = await fs.stat(file.path);
      const displayName = file.name
        .replace(/(\d{4}-\d{2}-\d{2})/, "")
        .replace(".md", "");
      content += `- [[${displayName}|${file.basename}]] (最后更新: ${moment(stats.mtime).format("HH:mm")})\n`;
    }
    return content;
  };

  // 主逻辑
  try {
    const today = getFormattedDate();

    // 获取今日文章
    const allArticles = await app.vault.getMarkdownFiles();
    const todayArticles = allArticles.filter(
      (file) => file.path.startsWith(ARTICLES_PATH) && file.name.includes(today)
    );

    if (todayArticles.length === 0) {
      console.log("今日暂无关联文章");
      return;
    }

    // 准备日记文件
    const journalPath = `${DAILY_JOURNAL_PATH}/${today}.md`;
    let journalContent = (await fs.exists(journalPath))
      ? await fs.read(journalPath)
      : `---\ndate: ${today}\n---\n\n`;

    // 避免重复添加
    if (!journalContent.includes("## 今日关联文章")) {
      const insertPosition = journalContent.indexOf("\n---\n") + 5;
      const newContent =
        journalContent.slice(0, insertPosition) +
        (await generateArticleLinks(todayArticles)) +
        journalContent.slice(insertPosition);

      await fs.write(journalPath, newContent);
      console.log("成功添加", todayArticles.length, "篇关联文章");
    }
  } catch (error) {
    console.error("文章聚合失败:", error);
  }
};
