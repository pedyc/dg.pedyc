/**
 * 用于处理Windows系统不支持的特殊字符
 * Windows文件系统不允许以下字符: < > : " / \ | ? *
 */

/**
 * 将不支持的特殊字符替换为安全字符
 * @param filename 需要处理的文件名
 * @returns 处理后的安全文件名
 */
export function sanitizeFilename(filename: string): string {
  // Windows不允许的特殊字符: < > : " / \ | ? *
  return filename
    .replace(/[<>:"\/\\|?*]/g, "-") // 替换Windows不支持的字符为连字符
    .replace(/\s+/g, "-") // 替换空格为连字符
    .replace(/-+/g, "-") // 替换多个连续连字符为单个连字符
    .replace(/^-|-$/g, "") // 移除开头和结尾的连字符
}

/**
 * 将安全文件名转换回原始格式(用于URL生成)
 * 注意：此函数不会完全恢复原始字符，因为某些字符在URL中也是不安全的
 * @param safeFilename 安全的文件名
 * @returns 适合URL的文件名
 */
export function desanitizeForUrl(safeFilename: string): string {
  // 在URL中，我们不需要恢复所有特殊字符，只需确保URL有效
  // 这个函数主要用于在需要时进行自定义URL处理
  return safeFilename
}
