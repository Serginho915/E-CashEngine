import fs from 'fs/promises';
import path from 'path';

type CoverSyncOptions = {
  sourceDir?: string;
  intervalMs?: number;
  enabled?: boolean;
};

const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function listFilesSafe(dirPath: string) {
  try {
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
}

function isCoverFile(fileName: string) {
  return allowedExtensions.has(path.extname(fileName).toLowerCase());
}

async function copyIfMissing(sourceDir: string, targetDir: string) {
  const sourceFiles = (await listFilesSafe(sourceDir)).filter(isCoverFile);

  if (sourceFiles.length === 0) {
    return { scanned: 0, copied: 0 };
  }

  await ensureDir(targetDir);
  const targetFiles = new Set(await listFilesSafe(targetDir));

  let copied = 0;
  for (const fileName of sourceFiles) {
    if (targetFiles.has(fileName)) {
      continue;
    }

    await fs.copyFile(path.join(sourceDir, fileName), path.join(targetDir, fileName));
    copied += 1;
  }

  return { scanned: sourceFiles.length, copied };
}

export function startCoverSync(targetDir: string, options: CoverSyncOptions = {}) {
  const enabled = options.enabled ?? process.env.AUTO_SYNC_COVERS !== 'false';

  if (!enabled) {
    console.log('Cover sync: disabled');
    return;
  }

  const sourceDir =
    options.sourceDir ||
    process.env.COVERS_SOURCE_DIR ||
    path.resolve(process.cwd(), '../frontend/public/covers');

  const intervalMs =
    options.intervalMs ||
    Number(process.env.COVERS_SYNC_INTERVAL_MS || 5000);

  const runSync = async () => {
    const { scanned, copied } = await copyIfMissing(sourceDir, targetDir);

    if (copied > 0) {
      console.log(`Cover sync: copied ${copied} new file(s) from ${sourceDir} to ${targetDir}`);
    } else if (scanned > 0) {
      console.log(`Cover sync: checked ${scanned} file(s), no new files`);
    }
  };

  runSync().catch((error) => {
    console.warn(`Cover sync initial run failed: ${(error as Error).message}`);
  });

  setInterval(() => {
    runSync().catch((error) => {
      console.warn(`Cover sync failed: ${(error as Error).message}`);
    });
  }, intervalMs);
}
