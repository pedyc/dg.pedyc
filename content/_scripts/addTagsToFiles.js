/**
 * 这个脚本用于给某个目录下的文件添加标签
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const TARGET_DIRECTORY = '../PKM/30-RESOURCES'
addTagsToDFiles(TARGET_DIRECTORY, ['RESOURCE'])

// 将标签添加到目录中的所有文件
function addTagsToDirFiles(directory, tags) {
    // 检查目录是否存在
    try {
        if (!fs.existsSync(directory)) {
            console.error(`目录不存在: ${directory}`)
            return
        }
        // 获取目标目录所有文件
        const files = fs.readdirSync(directory)
        // 遍历文件
        for (const file of files) {
            addTagsToFiles(path.join(directory, file), tags)
        }
    } catch (error) {
        console.error(`检查目录失败: ${directory}`)
    }
}

// 将标签添加进文件
function addTagsToFiles(filePath, tags) {
    // 检查文件是否存在
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`文件不存在: ${filePath}`)
            return
        }
        // 读取文件内容
        const content = fs.readFileSync(filePath, 'utf-8')

        // 检查是否有frontmatter（以---开始和结束）
        const frontmatterRegex = /^---\n(\s\S)*\n---/
        const match = content.match(frontmatterRegex)

    } catch (err) {
        console.error(`检查目录失败: ${directory}`)
    }
}