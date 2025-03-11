/**
 * This script is used to merge the topics frontmatter into the tags frontmatter
 * in all markdown files. This is useful for the Eleventy tag pages.
 * usage: node mergeTopicsToTags.js
 * 
 * 此脚本用于将所有 Markdown 文件中的 topics frontmatter 合并到 tags frontmatter 中。
 * 这对于 Eleventy 标签页面很有用。
 * 使用方法: node mergeTopicsToTags.js
 */
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function processMarkdownFile(filePath) {
    try {
        // 读取文件内容
        const content = fs.readFileSync(filePath, 'utf8');

        // 检查是否有frontmatter（以---开始和结束）
        const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = content.match(frontmatterRegex);

        if (match) {
            const frontmatter = match[1];
            const parsedFrontmatter = yaml.load(frontmatter);

            // 如果存在topics属性
            if (parsedFrontmatter.topics) {
                // 确保tags属性是一个数组
                if (!parsedFrontmatter.tags) {
                    parsedFrontmatter.tags = [];
                } else if (!Array.isArray(parsedFrontmatter.tags)) {
                    parsedFrontmatter.tags = [parsedFrontmatter.tags];
                }

                // 将topics转换为数组（如果不是数组）
                const topicsArray = Array.isArray(parsedFrontmatter.topics)
                    ? parsedFrontmatter.topics
                    : [parsedFrontmatter.topics];

                // 合并topics到tags，并去重
                parsedFrontmatter.tags = [...new Set([...parsedFrontmatter.tags, ...topicsArray])];

                // 删除topics属性
                delete parsedFrontmatter.topics;

                // 生成新的frontmatter
                const newFrontmatter = yaml.dump(parsedFrontmatter);
                const newContent = content.replace(frontmatterRegex, `---\n${newFrontmatter}---`);

                // 写回文件
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`处理文件成功: ${filePath}`);
            }
        }
    } catch (error) {
        console.error(`处理文件失败 ${filePath}:`, error);
    }
}

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // 递归处理子目录，但跳过特定目录
            if (!file.startsWith('.') && !file.startsWith('_')) {
                processDirectory(fullPath);
            }
        } else if (file.endsWith('.md')) {
            processMarkdownFile(fullPath);
        }
    });
}

// 设置要处理的目录路径
const contentDir = path.join(__dirname, '..'); // 获取content目录的路径
processDirectory(contentDir);