import fs from 'node:fs';
import path from 'node:path';

const token = process.argv[2] || process.env.GITHUB_TOKEN || '';
const owner = 'traders786';
const repo = 'Teaching';
const branch = 'main';

const ignored = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'data',
  '.env',
  '.env.local',
  'coverage',
  '.DS_Store',
];

function getAllFiles(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    
    if (ignored.some(ig => relPath === ig || relPath.startsWith(ig + '/'))) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, baseDir));
    } else {
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

async function githubApi(endpoint, options = {}) {
  const url = `https://api.github.com/repos/${owner}/${repo}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'upspeaq-push-agent',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`GitHub API error on ${endpoint} (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  console.log(`🚀 Starting GitHub direct commit upload for ${owner}/${repo} on branch '${branch}'...`);
  
  // 1. Get latest commit on main
  console.log('1. Fetching latest commit on main...');
  const refData = await githubApi(`/git/refs/heads/${branch}`);
  const parentCommitSha = refData.object.sha;
  console.log(`Latest commit SHA on main: ${parentCommitSha}`);

  // 2. Collect all local project files
  const files = getAllFiles(process.cwd());
  console.log(`2. Found ${files.length} files to upload (including all grade PDFs)...`);

  // 3. Upload blobs in batches
  const treeItems = [];
  let uploadedCount = 0;

  for (const { fullPath, relPath } of files) {
    const isBinary = relPath.endsWith('.pdf') || relPath.endsWith('.png') || relPath.endsWith('.jpg') || relPath.endsWith('.webp') || relPath.endsWith('.ico') || relPath.endsWith('.sqlite');
    let blobData;

    if (isBinary) {
      const buffer = fs.readFileSync(fullPath);
      blobData = await githubApi('/git/blobs', {
        method: 'POST',
        body: JSON.stringify({
          content: buffer.toString('base64'),
          encoding: 'base64',
        }),
      });
    } else {
      const content = fs.readFileSync(fullPath, 'utf8');
      blobData = await githubApi('/git/blobs', {
        method: 'POST',
        body: JSON.stringify({
          content,
          encoding: 'utf-8',
        }),
      });
    }

    treeItems.push({
      path: relPath,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha,
    });

    uploadedCount++;
    if (uploadedCount % 15 === 0 || uploadedCount === files.length) {
      console.log(`Uploaded ${uploadedCount}/${files.length} blobs...`);
    }
  }

  // 4. Create new Git Tree
  console.log('4. Creating new Git tree...');
  const treeData = await githubApi('/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      tree: treeItems,
    }),
  });
  console.log(`Created Tree SHA: ${treeData.sha}`);

  // 5. Create new Git Commit
  console.log('5. Creating new commit on GitHub...');
  const commitData = await githubApi('/git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message: 'Update Grade Selector (UKG to 10th), Email-only OTP, delayed teacher meeting link & dynamic worksheets PDF',
      tree: treeData.sha,
      parents: [parentCommitSha],
    }),
  });
  console.log(`Created Commit SHA: ${commitData.sha}`);

  // 6. Update main branch reference
  console.log('6. Updating branch ref to point to new commit...');
  await githubApi(`/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({
      sha: commitData.sha,
      force: true,
    }),
  });

  console.log(`\n🎉 SUCCESS! All files & curriculum PDFs are pushed to GitHub: https://github.com/${owner}/${repo}/commit/${commitData.sha}`);
}

main().catch(err => {
  console.error('❌ Upload failed:', err.message);
});
