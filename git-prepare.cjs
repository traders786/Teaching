const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

async function main() {
  const dir = process.cwd();
  console.log('Working dir:', dir);

  // 1. Init git repo if not already initialized
  const gitDir = path.join(dir, '.git');
  if (!fs.existsSync(gitDir)) {
    console.log('Initializing git repository...');
    await git.init({ fs, dir, defaultBranch: 'main' });
  } else {
    console.log('Git repo already exists.');
  }

  // 2. Set remote origin
  try {
    await git.removeRemote({ fs, dir, remote: 'origin' });
  } catch (e) {}
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/traders786/Teaching.git',
    force: true,
  });
  console.log('Set remote origin -> https://github.com/traders786/Teaching.git');

  // 3. Stage all files (respecting .gitignore)
  const files = await git.statusMatrix({ fs, dir });
  console.log('Total files checked in statusMatrix:', files.length);

  for (const [filepath, head, workdir, stage] of files) {
    // If workdir != stage, add or remove
    if (workdir === 0 && head === 1) {
      await git.remove({ fs, dir, filepath });
    } else if (workdir !== stage) {
      await git.add({ fs, dir, filepath });
    }
  }
  console.log('All files staged successfully.');

  // 4. Create Commit
  try {
    const sha = await git.commit({
      fs,
      dir,
      message: 'Initial commit: Speak India Communication & Confidence Platform with full staff & operations portal and 3 program tiers',
      author: {
        name: 'traders786',
        email: 'admissions@speakindia.in',
      },
    });
    console.log('Committed commit SHA:', sha);
  } catch (err) {
    console.log('Commit note:', err.message);
  }

  // 5. Check branch
  await git.branch({ fs, dir, ref: 'main', checkout: true }).catch(() => {});
  console.log('Repository prepared on main branch.');
}

main().catch(console.error);
