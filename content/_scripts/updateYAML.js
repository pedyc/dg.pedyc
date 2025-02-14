module.exports = async (params) => {
  const {
    quickAddApi: { inputPrompt, suggester },
  } = params;
  const metaeditPlugin = app.plugins.plugins.metaedit;
  if (!metaeditPlugin) {
    throw new Error("MetaEdit 插件未安装或未启用");
  }
  const { update, getPropertiesInFile } = metaeditPlugin.api;
  const date = window.moment().format("gggg-MM-DD - ddd MMM D");
  const dailyJournalFilePath = `bins/daily/${date}.md`;

  const propertiesInDailyJournal =
    await getPropertiesInFile(dailyJournalFilePath);
  const targetProp = await suggester(
    propertiesInDailyJournal.map((p) => p.key),
    propertiesInDailyJournal
  );

  const newPropertyValue = await inputPrompt(
    `Log ${targetProp.key}`,
    targetProp.content,
    targetProp.content
  );

  await update(targetProp.key, newPropertyValue, dailyJournalFilePath);
};
