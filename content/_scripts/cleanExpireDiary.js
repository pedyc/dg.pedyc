/**
 * This script is used to move expire file to the target folder.
 * Usage: node cleanExpireDiary.js
 * 这个脚本用于将过期的文件移动到归档目标目录。
 */
import fs from 'fs';
import path from 'path';
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import moment from 'moment';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(__filename, __dirname)

function cleanExpireFolder(oriDir, tarDir, expireDays) {
    try {
        // 检查目录是否存在
        if (!fs.existsSync(oriDir)) {
            console.error(`源目录不存在: ${oriDir}`);
            return;
        }
        if (!fs.existsSync(tarDir)) {
            console.error(`目标目录不存在: ${tarDir}`);
            return;
        }

        const today = moment().format('YYYY-MM-DD');
        const expireDate = moment().subtract(expireDays, 'days');
        const files = fs.readdirSync(oriDir);

        files.forEach(file => {
            try {
                const fullPath = path.join(oriDir, file);
                const stat = fs.statSync(fullPath);
                console.log(fullPath, stat.isDirectory());

                if (stat.isDirectory()) {
                    if (!file.startsWith('.') && !file.startsWith('_'))
                        cleanExpireFolder(fullPath, tarDir, expireDays);
                } else if (file.endsWith('.md')) {  // 只处理 markdown 文件
                    const fileDate = moment(stat.birthtime);
                    if (fileDate.isBefore(expireDate)) {
                        const tarPath = path.join(tarDir, file);
                        console.log(`移动文件: ${fullPath} -> ${tarPath}`);
                        fs.renameSync(fullPath, tarPath);
                    }
                }
            } catch (err) {
                console.error(`处理文件失败 ${file}:`, err);
            }
            console.log(`当前日期: ${today}, ${expireDays}天之前的日记会被归档`);
        });

    } catch (err) {
        console.error('处理目录失败:', err);
    }
}

// 设置需要处理的目录
const oriDir = path.join(__dirname, '../PKM/10-PROJECTS/Diary/')
const tarDir = path.join(__dirname, '../PKM/40-ARCHIVES/Diary/')
const expireDays = 30;
cleanExpireFolder(oriDir, tarDir, expireDays)