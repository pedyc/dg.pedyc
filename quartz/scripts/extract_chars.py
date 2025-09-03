import os
import re

def extract_chinese_chars(directory):
    """
    Scans Markdown and HTML files in the given directory and extracts unique Chinese characters.

    Args:
        directory (str): The directory to scan.

    Returns:
        set: A set of unique Chinese characters found.
    """
    chinese_chars = set()
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.md', '.html')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # Use a regex to find Chinese characters, English letters, and numbers
                        found_chars = re.findall(r'[\u4e00-\u9fffA-Za-z0-9]+', content)
                        for chars in found_chars:
                            for char in chars:
                                chinese_chars.add(char)
                except Exception as e:
                    print(f"Error reading file {filepath}: {e}")
    return chinese_chars

if __name__ == "__main__":
    # Assuming the content directory is at the project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up two levels to reach project root, then into content
    content_directory = os.path.join(script_dir, '..', '..', 'content')
    if not os.path.isdir(content_directory):
        print(f"Error: Content directory '{content_directory}' not found.")
    else:
        unique_chars = extract_chinese_chars(content_directory)
        # Output the unique characters to a file in the script's directory
        output_file_path = os.path.join(script_dir, 'chinese_chars.txt')
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(''.join(sorted(list(unique_chars))))
        print(f"Extracted {len(unique_chars)} unique Chinese characters to {output_file_path}")