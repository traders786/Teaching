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
  'scratch',
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
    
    // Skip static binary assets that are already in base_tree
    if (relPath.endsWith('.pdf') || relPath.endsWith('.jpg') || relPath.endsWith('.png') || relPath.endsWith('.sqlite')) {
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

async function uploadSingleBlob({ fullPath, relPath }) {
  const content = fs.readFileSync(fullPath, 'utf8');
  const blobData = await githubApi('/git/blobs', {
    method: 'POST',
    body: JSON.stringify({
      content,
      encoding: 'utf-8',
    }),
  });
  return {
    path: relPath,
    mode: '100644',
    type: 'blob',
    sha: blobData.sha,
  };
}

async function main() {
  if (!token) {
    console.error('Please pass GitHub PAT token: node scripts/github_direct_push.mjs <token>');
    process.exit(1);
  }

  console.log(`🚀 Starting parallel delta push for ${owner}/${repo} on branch '${branch}'...`);
  
  // 1. Get latest commit on main
  const refData = await githubApi(`/git/refs/heads/${branch}`);
  const parentCommitSha = refData.object.sha;
  console.log(`Latest commit SHA on main: ${parentCommitSha}`);

  // 2. Collect local code & config files
  const files = getAllFiles(process.cwd());
  console.log(`Found ${files.length} code & config files to sync...`);

  // 3. Upload blobs in parallel chunks of 15
  const treeItems = [];
  const chunkSize = 15;
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(uploadSingleBlob));
    treeItems.push(...chunkResults);
    console.log(`Uploaded ${treeItems.length}/${files.length} files...`);
  }

  // 4. Create new Git Tree with base_tree
  console.log('Creating new Git tree with base_tree...');
  const treeData = await githubApi('/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      base_tree: parentCommitSha,
      tree: treeItems,
    }),
  });
  console.log(`Created Tree SHA: ${treeData.sha}`);

  // 5. Create new Git Commit
  console.log('Creating new commit on GitHub...');
  const commitData = await githubApi('/git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message: 'Add Vercel serverless API with Node 22 engines, /tmp SQLite & Unenrolled Demo Dashboard',
      tree: treeData.sha,
      parents: [parentCommitSha],
    }),
  });
  console.log(`Created Commit SHA: ${commitData.sha}`);

  // 6. Update main branch reference
  console.log('Updating branch ref to point to new commit...');
  await githubApi(`/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({
      sha: commitData.sha,
      force: true,
    }),
  });

  console.log(`\n🎉 SUCCESS! Pushed to GitHub: https://github.com/${owner}/${repo}/commit/${commitData.sha}`);
}

main().catch((err) => {
  console.error('\n❌ Upload failed:', err.message);
  process.exit(1);
});
