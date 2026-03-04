<%*
try {
    // 获取用户脚本
    const archiveScript = tp.user.autoArchiveInbox;
    
    if (archiveScript) {
        // 执行脚本
        await archiveScript(tp);
        console.log("Templater Startup: Inbox Archive script executed successfully.");
    } else {
        console.error("Templater Startup: Script 'autoArchiveInbox.js' not found in your scripts folder.");
    }
} catch (e) {
    console.error("Templater Startup Execution Error:", e);
}
%>