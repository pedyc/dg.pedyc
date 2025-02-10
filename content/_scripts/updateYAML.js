module.exports = async (params) => {
  const {
    quickAddApi: { inputPrompt, suggester },
  } = params;
  const { update, getPropertiesInFile } = app.plugins.plugins["metaedit"].api;
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
