#!/usr/bin/env node
/**
 * Releases a new version through the "Publish to npm" GitHub workflow.
 *
 *   yarn release patch   # 1.1.0 -> 1.1.1
 *   yarn release minor   # 1.1.0 -> 1.2.0
 *   yarn release major   # 1.1.0 -> 2.0.0
 *   yarn release beta    # 1.1.0 -> 1.1.1-beta.0 (published with the "next" tag)
 *
 * The workflow bumps package.json, tags, publishes to npm and creates the GitHub release.
 * Needs the GitHub CLI (`gh`) logged in.
 */
const { execFileSync } = require('node:child_process');

const TYPES = {
  patch: 'patch',
  minor: 'minor',
  major: 'major',
  beta: 'prerelease',
  prerelease: 'prerelease',
  prepatch: 'prepatch',
  preminor: 'preminor',
  premajor: 'premajor',
};

const type = (process.argv[2] || '').toLowerCase();
const bump = TYPES[type];
if (!bump) {
  console.error(
    `Usage: yarn release <${Object.keys(TYPES).join('|')}>\n` +
      'Example: yarn release patch'
  );
  process.exit(1);
}

const gh = (args) =>
  execFileSync('gh', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });

try {
  gh(['workflow', 'run', 'publish.yml', '--ref', 'main', '-f', `bump=${bump}`]);
} catch {
  console.error(
    'Could not start the workflow. Is the GitHub CLI installed and logged in (gh auth login)?'
  );
  process.exit(1);
}

const repo = gh([
  'repo',
  'view',
  '--json',
  'nameWithOwner',
  '--jq',
  '.nameWithOwner',
]).trim();
console.log(`Release "${bump}" started.`);
console.log(
  `Follow it at https://github.com/${repo}/actions/workflows/publish.yml`
);
