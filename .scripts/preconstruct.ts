import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "fast-glob";

// Symlinks package sources to dist for local development

console.log("Setting up packages for development.");

async function main() {
  // Get all package.json files
  const packagePaths = await glob("**/package.json", {
    ignore: ["**/dist/**", "**/node_modules/**"],
  });

  let count = 0;
  for (const packagePath of packagePaths) {
    type Package = {
      bin?: Record<string, string> | undefined;
      exports?: Record<string, { types: string; default: string } | string> | undefined;
      name?: string | undefined;
      private?: boolean | undefined;
    };
    const file = await fs.readFile(packagePath, "utf8");
    const packageJson = (await JSON.parse(file)) as Package;

    // Skip private packages
    if (packageJson.private) continue;
    if (!packageJson.exports) continue;

    count += 1;
    console.log(`${packageJson.name} — ${path.dirname(packagePath)}`);

    const dir = path.resolve(path.dirname(packagePath));

    // Empty dist directory
    const distDirName = "dist";
    const dist = path.resolve(dir, distDirName);
    let files: string[] = [];
    try {
      files = await fs.readdir(dist);
    } catch {
      await fs.mkdir(dist);
    }

    const promises: Promise<void>[] = [];
    for (const file of files) {
      promises.push(fs.rm(path.join(dist, file), { recursive: true, force: true }));
    }
    await Promise.all(promises);

    // Link exports to dist locations
    for (const [key, exports] of Object.entries(packageJson.exports)) {
      // Skip `package.json` exports
      if (/package\.json$/.test(key)) continue;

      let entries: any;
      if (typeof exports === "string")
        entries = [
          ["default", exports],
          ["types", exports.replace(".js", ".d.ts")],
        ];
      else entries = Object.entries(exports);

      // Link exports to dist locations
      for (const [type, value] of entries as [type: "types" | "default", value: string][]) {
        const srcDir = path.resolve(
          dir,
          path
            .dirname(value)
            .replace(
              `dist${packageJson.name === "@fc-auth/react" ? "" : type === "default" ? "/esm" : `/${type}`}`,
              "src",
            ),
        );
        let srcFileName: string;
        if (key.endsWith(".css")) continue;
        if (key === ".") srcFileName = "index.ts";
        else srcFileName = path.basename(`${key}.ts`);
        const srcFilePath = path.resolve(srcDir, srcFileName);

        const distDir = path.resolve(dir, path.dirname(value));
        const distFileName = path.basename(value);
        const distFilePath = path.resolve(distDir, distFileName);

        await fs.mkdir(distDir, { recursive: true });

        // Symlink src to dist file
        await fs.symlink(srcFilePath, distFilePath, "file");
      }
    }
  }

  console.log(`Done. Set up ${count} ${count === 1 ? "package" : "packages"}.`);
}
main();
