import git from 'isomorphic-git';
import fs from 'node:fs';
import http from 'isomorphic-git/http/node';
import path from 'node:path';

const dir = process.cwd();

async function main() {
  console.log('Checking status...');
  const matrix = await git.statusMatrix({ fs, dir });
  
  // Filter modified / untracked / deleted files
  // matrix format: [filepath, headStatus, workdirStatus, stageStatus]
  // 0: absent, 1: unmodified, 2: modified, 3: deleted
  const toStage = [];
  const toRemove = [];

  for (const [filepath, head, workdir, stage] of matrix) {
    if (filepath.startsWith('node_modules') || filepath.startsWith('.git') || filepath.startsWith('dist')) continue;
    
    // file modified or new in workdir
    if (workdir === 2 || (head === 0 && workdir === 2)) {
      toStage.push(filepath);
    } else if (workdir === 0 && head >= 1) {
      toRemove.push(filepath);
    }
  }

  console.log('Files to stage:', toStage);
  console.log('Files to remove:', toRemove);

  for (const file of toStage) {
    await git.add({ fs, dir, filepath: file });
  }

  for (const file of toRemove) {
    await git.remove({ fs, dir, filepath: file });
  }

  if (toStage.length === 0 && toRemove.length === 0) {
    console.log('Working tree is clean. No changes to commit.');
    return;
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Upspeaq Team',
      email: 'admin@speakindia.in',
    },
    message: 'Update flexible batch timings and disable auto-popup on WhatsApp widget',
  });

  console.log('Committed SHA:', sha);

  // Try pushing
  console.log('Attempting push to origin main...');
  try {
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main',
      onAuth: () => {
        console.log('Auth requested');
        return {
          username: process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '',
          password: '',
        };
      },
    });
    console.log('Push result:', pushResult);
  } catch (err) {
    console.error('Push error:', err.message);
  }
}

main().catch(err => console.error('Error:', err));
