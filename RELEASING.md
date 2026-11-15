# Releasing

Releases are published to npm by the [Publish to npm](.github/workflows/publish.yml) workflow. Nothing is published from a local machine.

## From the terminal

```sh
yarn release patch   # bug fixes:          1.1.0 -> 1.1.1
yarn release minor   # new features:       1.1.0 -> 1.2.0
yarn release major   # breaking changes:   1.1.0 -> 2.0.0
yarn release beta    # pre-release:        1.1.0 -> 1.1.1-beta.0 (npm tag "next")
```

Needs the [GitHub CLI](https://cli.github.com/) logged in (`gh auth login`).

## From GitHub (web or mobile app)

Actions → **Publish to npm** → **Run workflow** → pick the version type → **Run workflow**.

## What the workflow does

1. Runs lint, typecheck and tests on `main`.
2. Bumps `package.json`, commits `chore: release X.Y.Z` and tags `vX.Y.Z` on `main`.
3. Publishes to npm with provenance (pre-releases go to the `next` tag, the rest to `latest`).
4. Creates the GitHub Release with notes generated from the merged pull requests.

Publishing a GitHub Release by hand also works: its tag must match the version already in `package.json`.

Authentication uses npm [Trusted Publishing](https://docs.npmjs.com/trusted-publishers/), so there is no npm token. On npmjs.com the package lists this repository and the `publish.yml` workflow as a trusted publisher. Don't rename the workflow file.
