const token = process.argv[2] || process.env.GITHUB_TOKEN || '';

async function checkRules() {
  console.log('Fetching repository rules and branch protections from GitHub API...');
  
  // 1. Check branch protection on main
  try {
    const res = await fetch('https://api.github.com/repos/traders786/Teaching/branches/main/protection', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'upspeaq-agent',
      },
    });
    const data = await res.json();
    console.log('Branch Protection on main:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching branch protection:', err);
  }

  // 2. Check rulesets
  try {
    const res = await fetch('https://api.github.com/repos/traders786/Teaching/rulesets', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'upspeaq-agent',
      },
    });
    const data = await res.json();
    console.log('Rulesets:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching rulesets:', err);
  }

  // 3. Check repo details
  try {
    const res = await fetch('https://api.github.com/repos/traders786/Teaching', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'upspeaq-agent',
      },
    });
    const data = await res.json();
    console.log('Repo permissions:', {
      permissions: data.permissions,
      default_branch: data.default_branch,
    });
  } catch (err) {
    console.error('Error fetching repo:', err);
  }
}

checkRules();
