import * as fs from "fs";
import path from "path";
import * as readline from "readline";
import { selectLineFromStringArray } from "@gld5000-cli/readline";
import { logTimestampArrow } from "@gld5000k/timestamp";

/**
 * Gives a list of filenames for a given path
 * @param {string | undefined} inputPath
 * @returns {Promise<{fileList: string[], inputPath: string}>}
 */
export async function listFileNames(inputPath) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (inputPath) {
      const fileList = fs.readdirSync(inputPath);
      resolve({ fileList, inputPath });
      rl.close();
    }

    rl.question("Please enter the directory path: ", (dirPath) => {
      if (!dirPath.trim()) {
        console.log(
          "Input should not be blank. Using current working directory."
        );
        dirPath = process.cwd(); // Set dirPath to the current working directory
      }

      try {
        const fileList = fs.readdirSync(dirPath);
        resolve({ fileList, inputPath: dirPath });
      } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        reject(error);
      } finally {
        rl.close(); // Close the readline interface after operation
      }
    });
  });
}
/**
 * Gives a list of files (full path) for a given path
 */
export async function listFileFullPaths(
  inputPath: string
): Promise<{ fileList: string[]; inputPath: string }> {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (inputPath) {
      const files = fs.readdirSync(inputPath);
      resolve({
        fileList: files.map((fileName) => path.join(inputPath, fileName)),
        inputPath,
      });
      rl.close();
    }
    rl.question("Please enter the directory path: ", (dirPath) => {
      if (!dirPath.trim()) {
        console.error(
          "Input should not be blank. Using current working directory."
        );
        dirPath = process.cwd(); // Set dirPath to the current working directory
      }

      try {
        const files = fs.readdirSync(dirPath);
        resolve({
          fileList: files.map((fileName) => path.join(dirPath, fileName)),
          inputPath: dirPath,
        });
      } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        reject(error);
      } finally {
        rl.close(); // Close the readline interface after operation
      }
    });
  });
}
/**
 * Returns the full path of a selected file
 *
 * @export
 * @async
 * @param {string} initialPath
 * @returns {*}
 */
export async function getFilePath(initialPath) {
  logTimestampArrow();
  if (!isFolder(initialPath)) return initialPath;
  const { fileList } = await listFileFullPaths(initialPath);
  const selectedFile = await selectLineFromStringArray(fileList);
}

/**
 * Tests if a filePath is a folder
 */
function isFolder(filePath: string) {
  const extension = path.extname(filePath);
  return extension.length === 0;
}
