import { exec, execSync, spawn } from 'child_process'; // Import spawn
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Import the standard fs module

// 获取当前文件所在的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Executes the Python script to extract Chinese characters.
 */
function extractCharacters() {
    console.log('Extracting Chinese characters...');
    try {
        // Use absolute path for the python script
        const pythonScriptPath = join(__dirname, 'extract_chars.py');
        execSync(`python ${pythonScriptPath}`, { stdio: 'inherit' });
        console.log('Character extraction complete.');
    } catch (error) {
        console.error('Error during character extraction:', error);
        process.exit(1);
    }
}

/**
 * Subsets the font based on the extracted characters.
 * @param {string} inputFile - Path to the original font file.
 * @param {string} outputFile - Path for the output subsetted font file.
 * @param {string} charsFile - Path to the file containing extracted characters.
 */
async function subsetFont(fontPath, charsFile, outputFontPath) {
    console.log(`Subsetting font ${fontPath}...`);
    return new Promise((resolve, reject) => {
        // Use pyftsubset from fonttools
        const commandArgs = [
            fontPath,
            `--text-file=${charsFile}`,
            `--output-file=${outputFontPath}`,
            '--flavor=woff2' // Specify woff2 output format
        ];

        // Construct the full command string
        const fullCommand = `pyftsubset ${commandArgs.join(' ')}`;
        console.log(`Executing command: ${fullCommand}`); // Log the full command

        // Use spawn to execute the pyftsubset command
        const subsetProcess = spawn('pyftsubset', commandArgs, { stdio: 'pipe', shell: true }); // Use shell: true to find pyftsubset in PATH

        let stdout = '';
        let stderr = '';

        subsetProcess.stdout.on('data', (data) => {
            stdout += data;
        });

        subsetProcess.stderr.on('data', (data) => {
            stderr += data;
        });

        subsetProcess.on('error', (error) => {
            console.error(`Failed to start pyftsubset process: ${error.message}`);
            reject(error);
        });

        subsetProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`pyftsubset process exited with code ${code}`);
                console.error(`Stderr: ${stderr}`);
                reject(new Error(`pyftsubset process failed with code ${code}`));
            } else {
                console.log(`Font subsetting stdout: ${stdout}`);
                console.log(`Font subsetting complete: ${outputFontPath}`);
                resolve();
            }
        });
    });
}

// Main execution flow
async function main() {
    const originalFont = join(__dirname, '..', 'static', 'fonts', 'lxgw.woff'); // Adjust if your font file is different
    const subsettedFont = join(__dirname, '..', 'static', 'fonts', 'lxgw.subset.woff'); // Output file name
    const extractedCharsFile = join(__dirname, 'chinese_chars.txt'); // File created by extract_chars.py

    // Ensure the original font file exists
    if (!fs.existsSync(originalFont)) { // Use fs.existsSync
        console.error(`Error: Original font file not found at ${originalFont}`);
        process.exit(1);
    }

    extractCharacters();

    // Check if the extracted characters file was created
    if (!fs.existsSync(extractedCharsFile)) { // Use fs.existsSync
        console.error(`Error: Extracted characters file not found at ${extractedCharsFile}`);
        process.exit(1);
    }

    await subsetFont(originalFont, extractedCharsFile, subsettedFont);

    // Clean up the temporary characters file
    if (fs.existsSync(extractedCharsFile)) { // Use fs.existsSync before deleting
        // Add a small delay to ensure the file is released by the previous process
        await new Promise(resolve => setTimeout(resolve, 100));
        try {
            fs.unlinkSync(extractedCharsFile); // Use fs.unlinkSync
            console.log(`Cleaned up ${extractedCharsFile}`);
        } catch (unlinkError) {
            console.error(`Error cleaning up ${extractedCharsFile}: ${unlinkError.message}`);
            // Continue execution even if cleanup fails, as it might be a transient issue
        }
    }
}

main().catch(error => {
    console.error('An error occurred during the font subsetting process:', error);
    process.exit(1);
});
