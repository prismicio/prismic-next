# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0-alpha.0](https://github.com/prismicio/prismic-next/compare/v1.2.1...v1.3.0-alpha.0) (2023-06-10)


### Features

* support Draft Mode with static rendering ([b839d19](https://github.com/prismicio/prismic-next/commit/b839d198136e1667a010775c30356283b393a71c))


### Bug Fixes

* restore preview share link support ([73f2479](https://github.com/prismicio/prismic-next/commit/73f247922bcff0647e485a0ef8be4829f0fe4315))


### Chore

* remove experimental `prismic-next` CLI ([#71](https://github.com/prismicio/prismic-next/issues/71)) ([812ddd9](https://github.com/prismicio/prismic-next/commit/812ddd99f64a04e865c3ff4c5b885ccd770a51c7))
* update to latest Next.js canary ([0e8d530](https://github.com/prismicio/prismic-next/commit/0e8d53098e746ed2c33fb73226d758cc66f16187))

### [1.2.1](https://github.com/prismicio/prismic-next/compare/v1.2.0...v1.2.1) (2023-05-23)


### Bug Fixes

* **cli:** update warn and info style to match new Next.js style ([c661c9f](https://github.com/prismicio/prismic-next/commit/c661c9f041558f0b55c97f947da46984c5a6485c))
* properly resolve types when using TypeScript's latest module resolution strategy ([#70](https://github.com/prismicio/prismic-next/issues/70)) ([7966d39](https://github.com/prismicio/prismic-next/commit/7966d39992f179dc55b32051d89140b815257aa9))

## [1.2.0](https://github.com/prismicio/prismic-next/compare/v1.1.0...v1.2.0) (2023-05-19)


### Features

* add `prismic-next` CLI to clear cached `/api/v2` requests ([#66](https://github.com/prismicio/prismic-next/issues/66)) ([e257ae1](https://github.com/prismicio/prismic-next/commit/e257ae1381bd6fbcadff2a45b32ae299ba9e5c84))


### Bug Fixes

* **PrismicNextImage:** log error if no alternative text is available (only in non-production environments) ([#68](https://github.com/prismicio/prismic-next/issues/68)) ([2e01b67](https://github.com/prismicio/prismic-next/commit/2e01b67fcecbc74488aecced3567b868a65572be))

## [1.1.0](https://github.com/prismicio/prismic-next/compare/v1.0.3...v1.1.0) (2023-05-06)


### Features

* support App Router ([#63](https://github.com/prismicio/prismic-next/issues/63)) ([90d795c](https://github.com/prismicio/prismic-next/commit/90d795cb9833beb57ef2ab2cefb95760859d7ec6)), closes [#65](https://github.com/prismicio/prismic-next/issues/65)

## [1.1.0-alpha.2](https://github.com/prismicio/prismic-next/compare/v1.1.0-alpha.1...v1.1.0-alpha.2) (2023-05-05)


### Features

* support for previews in App Router ([#65](https://github.com/prismicio/prismic-next/issues/65)) ([9c6b23b](https://github.com/prismicio/prismic-next/commit/9c6b23ba311c123bc079f29b6acd5b39749f5f52))


### Bug Fixes

* regression in `<PrismicPreviewClient>` ([f0a6b2f](https://github.com/prismicio/prismic-next/commit/f0a6b2f4aae5c8d0925245176e42f70dfa3ede55))

## [1.1.0-alpha.1](https://github.com/prismicio/prismic-next/compare/v1.1.0-alpha.0...v1.1.0-alpha.1) (2023-04-28)


### Features

* **PrismicNextLink:** restore `href` prop ([ceaf8c6](https://github.com/prismicio/prismic-next/commit/ceaf8c6d46dd3e62a0437bc9a1cad7d73447ffad))


### Bug Fixes

* bundle `@prismicio/client` v7 to prevent `npm install` issues ([eaa5a30](https://github.com/prismicio/prismic-next/commit/eaa5a3048553682efa9ddceae572967cc7767f54))
* **PrismicNextLink:** remove `href` prop ([057ec51](https://github.com/prismicio/prismic-next/commit/057ec51fb55909e9da9d175ee2d757501b19245e))


### Refactor

* use more accurate name for unsupported error builder ([faf568c](https://github.com/prismicio/prismic-next/commit/faf568c3525c2a77ec1ae7b4054a7a8585fca6d5))

## [1.1.0-alpha.0](https://github.com/prismicio/prismic-next/compare/v1.0.3...v1.1.0-alpha.0) (2023-04-25)


### Features

* support React Server Components and App Router ([be9e1a1](https://github.com/prismicio/prismic-next/commit/be9e1a1a3f400ce0d7e8d4e6709081127b6c0398))


### Bug Fixes

* support projects using `@prismicio/client` v6 ([0c48157](https://github.com/prismicio/prismic-next/commit/0c481577691331608b05ab8c049b8572442f6f04))


### Chore

* **deps:** update all dependencies ([9b2cd75](https://github.com/prismicio/prismic-next/commit/9b2cd752eacfae5e5c3ded7f22027c51c0c47204))
* fix type issue in `vite.config.ts` ([4fb85ee](https://github.com/prismicio/prismic-next/commit/4fb85eea5c35b5107501701135a9956d389b5e16))

### [1.0.3](https://github.com/prismicio/prismic-next/compare/v1.0.2...v1.0.3) (2023-02-22)


### Bug Fixes

* **PrismicNextImage:** use correct height dimension ([#61](https://github.com/prismicio/prismic-next/issues/61)) ([e9534c1](https://github.com/prismicio/prismic-next/commit/e9534c11de5878de15c543a745d2075134397a40))


### Chore

* **deps:** update dependencies ([#54](https://github.com/prismicio/prismic-next/issues/54)) ([9d26909](https://github.com/prismicio/prismic-next/commit/9d2690959d7d1255800861ca22d43c97554b6d3a))
* use consistent file path prefix in `types` `package.json` property ([92a02dc](https://github.com/prismicio/prismic-next/commit/92a02dc4415f53470033edc2c870a9c63c471ec6))

### [1.0.2](https://github.com/prismicio/prismic-next/compare/v1.0.1...v1.0.2) (2022-11-18)


### Bug Fixes

* resolve an issue where previews would not show if the default URL led to a 404 page ([#51](https://github.com/prismicio/prismic-next/issues/51)) ([b6cf270](https://github.com/prismicio/prismic-next/commit/b6cf270b08b3bbe725892c67929eebe5fbe27b2a))

### [1.0.1](https://github.com/prismicio/prismic-next/compare/v1.0.0...v1.0.1) (2022-11-17)


### Bug Fixes

* resolve "'`PrismicPreview`' cannot be used as a JSX component" TypeScript error ([a96f844](https://github.com/prismicio/prismic-next/commit/a96f844c7f7bf53ede5202222a5a53aa88c94a16))

## [1.0.0](https://github.com/prismicio/prismic-next/compare/v0.2.0...v1.0.0) (2022-11-16)

## [0.2.0](https://github.com/prismicio/prismic-next/compare/v0.1.8...v0.2.0) (2022-11-16)


### ⚠ BREAKING CHANGES

* support Next 13, drop support for Next 12 (#48)

### Features

* support Next 13, drop support for Next 12 ([#48](https://github.com/prismicio/prismic-next/issues/48)) ([c633a49](https://github.com/prismicio/prismic-next/commit/c633a4906801c428d6fb9b7ded4975f08c113d23))


### Bug Fixes

* remove deprecated `exitPreviewURL` argument for `exitPreview()` ([fedd246](https://github.com/prismicio/prismic-next/commit/fedd246751e203b0bf0858ef25a02e144801141b))

### [0.1.8](https://github.com/prismicio/prismic-next/compare/v0.1.7...v0.1.8) (2022-11-11)


### Chore

* remove `@prismicio/client` as a dependency ([#49](https://github.com/prismicio/prismic-next/issues/49)) ([cf3fd6d](https://github.com/prismicio/prismic-next/commit/cf3fd6d404c91efcdac6308ba176732405fc9eca))

### [0.1.7](https://github.com/prismicio/prismic-next/compare/v0.1.6...v0.1.7) (2022-10-18)


### Refactor

* use `next/script` to load the Prismic Toolbar ([#46](https://github.com/prismicio/prismic-next/issues/46)) ([1ad5750](https://github.com/prismicio/prismic-next/commit/1ad5750127305c3ba7aa244476d3341aa3cad7e0))


### Chore

* **deps:** update dependencies ([355dcad](https://github.com/prismicio/prismic-next/commit/355dcad54cd1d6e1bcccfa97b79b005cb4530ae2))

### [0.1.6](https://github.com/prismicio/prismic-next/compare/v0.1.5...v0.1.6) (2022-10-11)


### Features

* support `width` and `height` props in `<PrismicNextImage>` when layout is `intrinsic` or `fixed` ([#42](https://github.com/prismicio/prismic-next/issues/42)) ([a170999](https://github.com/prismicio/prismic-next/commit/a1709999acbf091b832a3c4be4143f85a1871c0b))


### Chore

* **deps:** update dependencies ([d0df170](https://github.com/prismicio/prismic-next/commit/d0df170692fc98c673724eba494a06864f754a1f))
* replace unbuild with Vite ([#43](https://github.com/prismicio/prismic-next/issues/43)) ([08f3c01](https://github.com/prismicio/prismic-next/commit/08f3c01bba1ad8a86aa9105af6b8c4b2a7a0a8f0))

### [0.1.6-alpha.1](https://github.com/prismicio/prismic-next/compare/v0.1.6-alpha.0...v0.1.6-alpha.1) (2022-10-06)

### [0.1.6-alpha.0](https://github.com/prismicio/prismic-next/compare/v0.1.5...v0.1.6-alpha.0) (2022-10-06)


### Refactor

* use sdk plugin ([bf49fb3](https://github.com/prismicio/prismic-next/commit/bf49fb3858651184965f5a3ee0b4bc3d98699730))


### Chore

* **ci:** restore coverage and size steps ([12dd3e4](https://github.com/prismicio/prismic-next/commit/12dd3e4a293b3d1fb2ef45df7acb5f6b67d4ac18))
* **ci:** swap to node 16 ([23a526e](https://github.com/prismicio/prismic-next/commit/23a526eb9e8cdc2fad063b0672e49dbf4ec0900e))
* **deps:** maintain lock file ([5d94505](https://github.com/prismicio/prismic-next/commit/5d94505c372a0d8364329ab7edb51e10b8a23682))
* replace unbuild with Vite ([724d41d](https://github.com/prismicio/prismic-next/commit/724d41d26a8bb5ce42c1172a448935333e60570c))
* restore package.json version ([3bbd73a](https://github.com/prismicio/prismic-next/commit/3bbd73aea59fb0d8c319bb14d8ba6fb71fef693b))


### Documentation

* update CONTRIBUTING.md ([fa5b036](https://github.com/prismicio/prismic-next/commit/fa5b036c0987ece6b116eb1f7110c4c8bac8c65d))

### [0.1.5](https://github.com/prismicio/prismic-next/compare/v0.1.4...v0.1.5) (2022-09-09)


### Chore

* add `main` and `module` entries ([6efc264](https://github.com/prismicio/prismic-next/commit/6efc2641eb8993527f0cca101fa966a0d8e84462))
* include source maps ([845d0ab](https://github.com/prismicio/prismic-next/commit/845d0ab180fff11c136b4b01b865a0dc7564a1b0))

### [0.1.4](https://github.com/prismicio/prismic-next/compare/v0.1.3...v0.1.4) (2022-09-09)


### Features

* add `@prismicio/client`'s `ClientConfig` to `CreateClientConfig` ([#37](https://github.com/prismicio/prismic-next/issues/37)) ([38d1b24](https://github.com/prismicio/prismic-next/commit/38d1b24ed7d6a3800e220482ea65b3ee856b8f76))


### Bug Fixes

* prevent CDN-level caching of exit preview route implemented with `exitPreview()` ([#32](https://github.com/prismicio/prismic-next/issues/32)) ([445a3ae](https://github.com/prismicio/prismic-next/commit/445a3ae3b670b9b9773e9e00a61c20290a0dec53))
* support tree-shaking ([#36](https://github.com/prismicio/prismic-next/issues/36)) ([c234524](https://github.com/prismicio/prismic-next/commit/c234524ce9e52618bab575cb7e40c71c3d892c88))


### Documentation

* update feature list ([330bab2](https://github.com/prismicio/prismic-next/commit/330bab28c70832d4da4bc03c4ccf7dd484801ec5))


### Refactor

* simplify Prismic preview cookie reading ([#34](https://github.com/prismicio/prismic-next/issues/34)) ([80e876f](https://github.com/prismicio/prismic-next/commit/80e876f9e0a850761d725bc587e34a16f51db320))


### Chore

* **deps:** update dependencies ([#38](https://github.com/prismicio/prismic-next/issues/38)) ([c6cef33](https://github.com/prismicio/prismic-next/commit/c6cef33cfc708e5933057c4fa662107992b059c5))
* **deps:** upgrade dependencies ([#33](https://github.com/prismicio/prismic-next/issues/33)) ([1a654af](https://github.com/prismicio/prismic-next/commit/1a654afeba791f1c94f7f079d50b986875a60439))

### [0.1.3](https://github.com/prismicio/prismic-next/compare/v0.1.2...v0.1.3) (2022-05-25)


### Features

* add `<PrismicNextImage>` ([#24](https://github.com/prismicio/prismic-next/issues/24)) ([697da1a](https://github.com/prismicio/prismic-next/commit/697da1a04614951bbb9cb3181e6e8382ee61a49a))
* add support for `basePath` ([#28](https://github.com/prismicio/prismic-next/issues/28)) ([9527e85](https://github.com/prismicio/prismic-next/commit/9527e85fb138ea36c7784f70aa6dff896c219c4e))


### Refactor

* simplify `<PrismicPreview>` logic ([#23](https://github.com/prismicio/prismic-next/issues/23)) ([5232b14](https://github.com/prismicio/prismic-next/commit/5232b14c4fb0b6d31f8757bcdd0b8925718b99f9))

### [0.1.2](https://github.com/prismicio/prismic-next/compare/v0.1.0...v0.1.2) (2022-04-01)


### Features

* expose PrismicPreview props ([#10](https://github.com/prismicio/prismic-next/issues/10)) ([f15f064](https://github.com/prismicio/prismic-next/commit/f15f06478f0d375568f5c2f8e806dac33032793a)), closes [#9](https://github.com/prismicio/prismic-next/issues/9)


### Bug Fixes

* support React 18 ([#17](https://github.com/prismicio/prismic-next/issues/17)) ([b8c6157](https://github.com/prismicio/prismic-next/commit/b8c61578f987c04ed7f345aa5cd0350abb2361a5))


### Documentation

* remove experimental/beta message ([d7f1b55](https://github.com/prismicio/prismic-next/commit/d7f1b55c7fcbc68795dcf45a48be1dad12d073f8))


### Chore

* add missing `react-dom` dev dependency ([b5e570b](https://github.com/prismicio/prismic-next/commit/b5e570bbef1fc3466fdb89643ca8b64a562cd712))
* **ci:** update ci to not use workspaces ([6891f46](https://github.com/prismicio/prismic-next/commit/6891f46a5e71637091965df457736d83d8a80647))
* **ci:** use node 16 ([a0eb3ec](https://github.com/prismicio/prismic-next/commit/a0eb3ec264a9bc6fe9ff26e8a0a1692ef68f4736))
* clean up .github directory ([f66b625](https://github.com/prismicio/prismic-next/commit/f66b625146eaf8fe74754e8b719da341da2e4938))
* restructure + refresh project ([#18](https://github.com/prismicio/prismic-next/issues/18)) ([f0e1170](https://github.com/prismicio/prismic-next/commit/f0e1170ea92ed489bbfbc1d2ef386d84bde45cd1))
* update package.json version to v0.1.1 ([0d498e8](https://github.com/prismicio/prismic-next/commit/0d498e84156b726ac031cf86d369a4fa90a8062a))
* update warning label ([8d58178](https://github.com/prismicio/prismic-next/commit/8d58178e89afce2bd64660be5dcee4d6ecacf56c))

## [0.1.0](https://github.com/prismicio/prismic-next/compare/v0.0.5...v0.1.0) (2022-02-28)

### [0.0.5](https://github.com/prismicio/prismic-next/compare/v0.0.4...v0.0.5) (2022-02-21)


### Features

* replace `enableAutoPreviews()`'s `context` option with `previewData` ([#12](https://github.com/prismicio/prismic-next/issues/12)) ([435b8eb](https://github.com/prismicio/prismic-next/commit/435b8eb06356829b3cabc34152a31661feba6d41))
* support shareable Preview links ([#11](https://github.com/prismicio/prismic-next/issues/11)) ([180fee8](https://github.com/prismicio/prismic-next/commit/180fee8358d58f71d99b4e20d8bb99bab22724f3))


### Chore

* link root README to package README ([609a1f3](https://github.com/prismicio/prismic-next/commit/609a1f3d4e2fe0c15571f73acec92b5921835d13))

### [0.0.4](https://github.com/prismicio/prismic-next/compare/v0.0.3...v0.0.4) (2022-01-25)


### Chore

* fixed readme links ([41404a8](https://github.com/prismicio/prismic-next/commit/41404a886f51b5133748bd352f94d7651f6630c3))

### [0.0.3](https://github.com/prismicio/prismic-next/compare/v0.0.2...v0.0.3) (2022-01-25)


### Chore

* add symlink for README ([6e94087](https://github.com/prismicio/prismic-next/commit/6e94087552304560ce70120a0ea46dcbd0ac4a47))
* adding script back to release ([4cdac7c](https://github.com/prismicio/prismic-next/commit/4cdac7c46ba1bbe4cff64245b270e1f89055dcf7))
* update repo links and add package name ([a186468](https://github.com/prismicio/prismic-next/commit/a18646854d4b47ad3d9981012814b03438dfca21))

### 0.0.2 (2022-01-25)


### Features

* add test command ([0e97ed3](https://github.com/prismicio/prismic-next/commit/0e97ed302173b3a4cfa41761a844f006e7e8b7ba))
* add test for setPreviewData ([a368498](https://github.com/prismicio/prismic-next/commit/a36849870a839e8a106999dd200261f2bacf8efc))
* add tests for preview component ([c941d9a](https://github.com/prismicio/prismic-next/commit/c941d9a67c3b1bd3f0df5232eaa5f8f6e1fe6ca5))
* api changes ([9b0de37](https://github.com/prismicio/prismic-next/commit/9b0de3731ae0ebb2b6d0de60ad6875065d5513fc))
* exitPreview test working ([51d3e82](https://github.com/prismicio/prismic-next/commit/51d3e827ffb9c57e3139d3be47731d069f663818))
* initial commit ([275c8d6](https://github.com/prismicio/prismic-next/commit/275c8d629e382fd78627c3f1a428b7394a5294e5))
* make req required on redirectToPreviewURL ([b419617](https://github.com/prismicio/prismic-next/commit/b4196172b827bd57c50ea2d5172b9640349c4794))
* remove event listeners for prismic toolbar events ([b42ef2a](https://github.com/prismicio/prismic-next/commit/b42ef2a96e3e83110d02e5a8cebf25175698d28b))
* wrapping up tests and working event listeners ([548340e](https://github.com/prismicio/prismic-next/commit/548340ed58ecb2bbd6c859ad347f1ce649a1e7b7))


### Bug Fixes

* resolve "Can't set headers after they are sent" warning in preview API endpoint ([#7](https://github.com/prismicio/prismic-next/issues/7)) ([d6442f5](https://github.com/prismicio/prismic-next/commit/d6442f59706158c7407b9c827cdabef3140a613c))


### Documentation

* update TSDoc with more context ([6845353](https://github.com/prismicio/prismic-next/commit/68453537bd9f33f8d0eeca33625a5e2d6a2fff08))


### Chore

* add .github folder ([f982a28](https://github.com/prismicio/prismic-next/commit/f982a28392ad4424d7fa93dec8460e8b2b03339f))
* add defaultURL to res.redirect ([e969244](https://github.com/prismicio/prismic-next/commit/e9692447944f62c75b097b15808dcd7492201bd5))
* add dot files and readme ([937006e](https://github.com/prismicio/prismic-next/commit/937006e225a17d275b391dcc9370284e1819c554))
* add experimental warning ([303fad3](https://github.com/prismicio/prismic-next/commit/303fad3c8f7731b088735f53ecba84ebe25e883e))
* add function to check if event is from prismic toolbar ([0b94c18](https://github.com/prismicio/prismic-next/commit/0b94c188ee59c8836d5ee85aaf06cd55a2063283))
* add license ([8ffe899](https://github.com/prismicio/prismic-next/commit/8ffe899c911a06f68e95dad4d4e9fd0c2c22df71))
* add script test ([3fa92a1](https://github.com/prismicio/prismic-next/commit/3fa92a14cc6716749353e873fe1d3a095f809616))
* add ts doc ([0163937](https://github.com/prismicio/prismic-next/commit/01639378de65acaa6fd6d1871fa36d30a54c1937))
* add TS doc for exit preview ([ae8916f](https://github.com/prismicio/prismic-next/commit/ae8916f160297efc11aa790e7b7cee998100ab2c))
* add ts docs ([2affb42](https://github.com/prismicio/prismic-next/commit/2affb4245d8a178fd8c2a62736cb32d2ba0ba721))
* add tsdoc ([66ab83d](https://github.com/prismicio/prismic-next/commit/66ab83da56f6912ff7183e9ec9fce060badcd71f))
* clean up ([627fc90](https://github.com/prismicio/prismic-next/commit/627fc900a018910cfeb853046d6e16bfdfdf93fc))
* clean up ([6525241](https://github.com/prismicio/prismic-next/commit/65252415b45bc21117c094de7d74a8b5d3e650ab))
* clean up setPreviewData ([b12dc90](https://github.com/prismicio/prismic-next/commit/b12dc902e1fb449e0fe65e839523f555a7125f9a))
* comments ([c389508](https://github.com/prismicio/prismic-next/commit/c3895081d946773e280468cc56438f109549915c))
* delete unused function ([eb34c7a](https://github.com/prismicio/prismic-next/commit/eb34c7ad2cf00199c5e5bfc0ea3adc1516d18ee7))
* export ExitPreviewParams ([fc13319](https://github.com/prismicio/prismic-next/commit/fc13319209e226a6e03e19b1d431fbc76777622b))
* export types ([6d7fe1d](https://github.com/prismicio/prismic-next/commit/6d7fe1d493ce9f966cf03bf4773e1e49f73892a3))
* fix imports ([53232d2](https://github.com/prismicio/prismic-next/commit/53232d2acc4f19252ec77ea66033cf9b913334a7))
* fix imports and remove server ([a9d473b](https://github.com/prismicio/prismic-next/commit/a9d473b9f90c1414c0a2512085e0cd43324c8323))
* if statement to check for token ([d9bab90](https://github.com/prismicio/prismic-next/commit/d9bab904b161d654d8fd58a28ddb43d4ced6f099))
* import SetPreviewConfig to index.ts ([7a4a300](https://github.com/prismicio/prismic-next/commit/7a4a3007b71ce9bd4aa1ca414c13a88b592991c4))
* make children optional ([8807409](https://github.com/prismicio/prismic-next/commit/88074093c53327cacb00a720e2ae104a9971b645))
* make linkResolver optional ([9195794](https://github.com/prismicio/prismic-next/commit/9195794ce1ef538b3851c89ae7a917859ba1dad7))
* minimal PreviewConfig param ([3434042](https://github.com/prismicio/prismic-next/commit/3434042882402a97838577a34ee2aa1c53b7e55b))
* refactor <PrismicPreview /> and update test ([7bc918a](https://github.com/prismicio/prismic-next/commit/7bc918a3169b795ebb8b48815b18f214fdd767d6))
* refactor setPreviewData to work with test ([2d00faf](https://github.com/prismicio/prismic-next/commit/2d00faf974dee1898ba0b44f0c189d4669a45876))
* refactor to use req ([000c89b](https://github.com/prismicio/prismic-next/commit/000c89bf253f70b6cd2be04b55df27c565ee0829))
* **release:** 0.0.1 ([35a8bfb](https://github.com/prismicio/prismic-next/commit/35a8bfb972ffc7432fbef6d6e5ab0b33446b00bf))
* remove <React.Fragment /> ([127a169](https://github.com/prismicio/prismic-next/commit/127a169628dc8630a3c258a5883f14122567d335))
* remove async ([5a2b828](https://github.com/prismicio/prismic-next/commit/5a2b8287ed99505701b71fa851d85f95c6002803))
* remove comment ([48daf16](https://github.com/prismicio/prismic-next/commit/48daf164dfc0edbdc79432de995a3c5027522849))
* remove logs ([11c40a2](https://github.com/prismicio/prismic-next/commit/11c40a2748ae21791f1d96f00b78fa18bce00e0f))
* remove react as peer dependency ([d856459](https://github.com/prismicio/prismic-next/commit/d856459de1889f090ed51b0e30da76f7724b0147))
* remove renderJSON ([cebaa34](https://github.com/prismicio/prismic-next/commit/cebaa34c25aa300fb472bbf6cac80516a8a17283))
* remove unnecessary things ([1725d3e](https://github.com/prismicio/prismic-next/commit/1725d3e2d45a61f9ade45e9d5aca3396d54005fa))
* remove unused file ([6762ded](https://github.com/prismicio/prismic-next/commit/6762dedba18b7fdce71aef814f9b32c5b4f27b13))
* rename ([2b5b20f](https://github.com/prismicio/prismic-next/commit/2b5b20f18fcaab7ba48fe65b52147c04e951288b))
* simplify exports ([e0e8bf7](https://github.com/prismicio/prismic-next/commit/e0e8bf7ff5391deae919f09c6116ad6c3f8cb8bd))
* ts doc ([e5b5c7f](https://github.com/prismicio/prismic-next/commit/e5b5c7f14d8e40f1d4c0c7578ed4718f59f9693d))
* ts doc for enableAutoPreviews ([caf64d6](https://github.com/prismicio/prismic-next/commit/caf64d677e35d32a60384fbb94c4d2f560c47651))
* type event as custom event ([d41abeb](https://github.com/prismicio/prismic-next/commit/d41abeb386e2d5e4a57bdff6900ffa072e6c2ded))
* update after rename ([dc3d11e](https://github.com/prismicio/prismic-next/commit/dc3d11e67b2c074e4d801a5f0450ae78c828bbd2))
* update nextjs as peer dependency ([85ddf36](https://github.com/prismicio/prismic-next/commit/85ddf36ae50aca19f6a2c41c7a47260c3fc0fc36))
* update package description ([0776850](https://github.com/prismicio/prismic-next/commit/077685091abdb95e58b32f4d14f910155f10a975))
* update package name to @prismicio/next ([5f0ed6a](https://github.com/prismicio/prismic-next/commit/5f0ed6a9d5166f2f46f76a0a1f706685abb6cc30))
* update package-lock.json ([1f60d59](https://github.com/prismicio/prismic-next/commit/1f60d592d73eb2b384e601c49b3fb0a2953fe5ac))
* update repo ([c281f75](https://github.com/prismicio/prismic-next/commit/c281f75b9cda0e5476245560b400720cc8d3a1dc))
* update test ([e557277](https://github.com/prismicio/prismic-next/commit/e5572775d7b9476180eba5d2ae3ba158bfceb472))
* update TS doc for exit preview ([206e8c3](https://github.com/prismicio/prismic-next/commit/206e8c3a685ae10cc8baa2d02e145c88b2862b79))
* update tsdoc ([38f2430](https://github.com/prismicio/prismic-next/commit/38f24309ebcb2b72536a2da187c15af69450c1f3))

### 0.0.1 (2021-12-20)


### Features

* add test command ([0e97ed3](https://github.com/prismicio/prismic-next/commit/0e97ed302173b3a4cfa41761a844f006e7e8b7ba))
* add test for setPreviewData ([a368498](https://github.com/prismicio/prismic-next/commit/a36849870a839e8a106999dd200261f2bacf8efc))
* add tests for preview component ([c941d9a](https://github.com/prismicio/prismic-next/commit/c941d9a67c3b1bd3f0df5232eaa5f8f6e1fe6ca5))
* api changes ([9b0de37](https://github.com/prismicio/prismic-next/commit/9b0de3731ae0ebb2b6d0de60ad6875065d5513fc))
* exitPreview test working ([51d3e82](https://github.com/prismicio/prismic-next/commit/51d3e827ffb9c57e3139d3be47731d069f663818))
* initial commit ([275c8d6](https://github.com/prismicio/prismic-next/commit/275c8d629e382fd78627c3f1a428b7394a5294e5))
* make req required on redirectToPreviewURL ([b419617](https://github.com/prismicio/prismic-next/commit/b4196172b827bd57c50ea2d5172b9640349c4794))
* remove event listeners for prismic toolbar events ([b42ef2a](https://github.com/prismicio/prismic-next/commit/b42ef2a96e3e83110d02e5a8cebf25175698d28b))
* wrapping up tests and working event listeners ([548340e](https://github.com/prismicio/prismic-next/commit/548340ed58ecb2bbd6c859ad347f1ce649a1e7b7))


### Documentation

* update TSDoc with more context ([6845353](https://github.com/prismicio/prismic-next/commit/68453537bd9f33f8d0eeca33625a5e2d6a2fff08))


### Chore

* add .github folder ([f982a28](https://github.com/prismicio/prismic-next/commit/f982a28392ad4424d7fa93dec8460e8b2b03339f))
* add defaultURL to res.redirect ([e969244](https://github.com/prismicio/prismic-next/commit/e9692447944f62c75b097b15808dcd7492201bd5))
* add dot files and readme ([937006e](https://github.com/prismicio/prismic-next/commit/937006e225a17d275b391dcc9370284e1819c554))
* add function to check if event is from prismic toolbar ([0b94c18](https://github.com/prismicio/prismic-next/commit/0b94c188ee59c8836d5ee85aaf06cd55a2063283))
* add license ([8ffe899](https://github.com/prismicio/prismic-next/commit/8ffe899c911a06f68e95dad4d4e9fd0c2c22df71))
* add script test ([3fa92a1](https://github.com/prismicio/prismic-next/commit/3fa92a14cc6716749353e873fe1d3a095f809616))
* add ts doc ([0163937](https://github.com/prismicio/prismic-next/commit/01639378de65acaa6fd6d1871fa36d30a54c1937))
* add TS doc for exit preview ([ae8916f](https://github.com/prismicio/prismic-next/commit/ae8916f160297efc11aa790e7b7cee998100ab2c))
* add ts docs ([2affb42](https://github.com/prismicio/prismic-next/commit/2affb4245d8a178fd8c2a62736cb32d2ba0ba721))
* add tsdoc ([66ab83d](https://github.com/prismicio/prismic-next/commit/66ab83da56f6912ff7183e9ec9fce060badcd71f))
* clean up ([627fc90](https://github.com/prismicio/prismic-next/commit/627fc900a018910cfeb853046d6e16bfdfdf93fc))
* clean up ([6525241](https://github.com/prismicio/prismic-next/commit/65252415b45bc21117c094de7d74a8b5d3e650ab))
* clean up setPreviewData ([b12dc90](https://github.com/prismicio/prismic-next/commit/b12dc902e1fb449e0fe65e839523f555a7125f9a))
* comments ([c389508](https://github.com/prismicio/prismic-next/commit/c3895081d946773e280468cc56438f109549915c))
* delete unused function ([eb34c7a](https://github.com/prismicio/prismic-next/commit/eb34c7ad2cf00199c5e5bfc0ea3adc1516d18ee7))
* export ExitPreviewParams ([fc13319](https://github.com/prismicio/prismic-next/commit/fc13319209e226a6e03e19b1d431fbc76777622b))
* export types ([6d7fe1d](https://github.com/prismicio/prismic-next/commit/6d7fe1d493ce9f966cf03bf4773e1e49f73892a3))
* fix imports ([53232d2](https://github.com/prismicio/prismic-next/commit/53232d2acc4f19252ec77ea66033cf9b913334a7))
* fix imports and remove server ([a9d473b](https://github.com/prismicio/prismic-next/commit/a9d473b9f90c1414c0a2512085e0cd43324c8323))
* if statement to check for token ([d9bab90](https://github.com/prismicio/prismic-next/commit/d9bab904b161d654d8fd58a28ddb43d4ced6f099))
* import SetPreviewConfig to index.ts ([7a4a300](https://github.com/prismicio/prismic-next/commit/7a4a3007b71ce9bd4aa1ca414c13a88b592991c4))
* make children optional ([8807409](https://github.com/prismicio/prismic-next/commit/88074093c53327cacb00a720e2ae104a9971b645))
* make linkResolver optional ([9195794](https://github.com/prismicio/prismic-next/commit/9195794ce1ef538b3851c89ae7a917859ba1dad7))
* minimal PreviewConfig param ([3434042](https://github.com/prismicio/prismic-next/commit/3434042882402a97838577a34ee2aa1c53b7e55b))
* refactor <PrismicPreview /> and update test ([7bc918a](https://github.com/prismicio/prismic-next/commit/7bc918a3169b795ebb8b48815b18f214fdd767d6))
* refactor setPreviewData to work with test ([2d00faf](https://github.com/prismicio/prismic-next/commit/2d00faf974dee1898ba0b44f0c189d4669a45876))
* refactor to use req ([000c89b](https://github.com/prismicio/prismic-next/commit/000c89bf253f70b6cd2be04b55df27c565ee0829))
* remove <React.Fragment /> ([127a169](https://github.com/prismicio/prismic-next/commit/127a169628dc8630a3c258a5883f14122567d335))
* remove async ([5a2b828](https://github.com/prismicio/prismic-next/commit/5a2b8287ed99505701b71fa851d85f95c6002803))
* remove comment ([48daf16](https://github.com/prismicio/prismic-next/commit/48daf164dfc0edbdc79432de995a3c5027522849))
* remove logs ([11c40a2](https://github.com/prismicio/prismic-next/commit/11c40a2748ae21791f1d96f00b78fa18bce00e0f))
* remove react as peer dependency ([d856459](https://github.com/prismicio/prismic-next/commit/d856459de1889f090ed51b0e30da76f7724b0147))
* remove renderJSON ([cebaa34](https://github.com/prismicio/prismic-next/commit/cebaa34c25aa300fb472bbf6cac80516a8a17283))
* remove unnecessary things ([1725d3e](https://github.com/prismicio/prismic-next/commit/1725d3e2d45a61f9ade45e9d5aca3396d54005fa))
* remove unused file ([6762ded](https://github.com/prismicio/prismic-next/commit/6762dedba18b7fdce71aef814f9b32c5b4f27b13))
* rename ([2b5b20f](https://github.com/prismicio/prismic-next/commit/2b5b20f18fcaab7ba48fe65b52147c04e951288b))
* simplify exports ([e0e8bf7](https://github.com/prismicio/prismic-next/commit/e0e8bf7ff5391deae919f09c6116ad6c3f8cb8bd))
* ts doc ([e5b5c7f](https://github.com/prismicio/prismic-next/commit/e5b5c7f14d8e40f1d4c0c7578ed4718f59f9693d))
* ts doc for enableAutoPreviews ([caf64d6](https://github.com/prismicio/prismic-next/commit/caf64d677e35d32a60384fbb94c4d2f560c47651))
* type event as custom event ([d41abeb](https://github.com/prismicio/prismic-next/commit/d41abeb386e2d5e4a57bdff6900ffa072e6c2ded))
* update after rename ([dc3d11e](https://github.com/prismicio/prismic-next/commit/dc3d11e67b2c074e4d801a5f0450ae78c828bbd2))
* update nextjs as peer dependency ([85ddf36](https://github.com/prismicio/prismic-next/commit/85ddf36ae50aca19f6a2c41c7a47260c3fc0fc36))
* update package description ([0776850](https://github.com/prismicio/prismic-next/commit/077685091abdb95e58b32f4d14f910155f10a975))
* update package name to @prismicio/next ([5f0ed6a](https://github.com/prismicio/prismic-next/commit/5f0ed6a9d5166f2f46f76a0a1f706685abb6cc30))
* update package-lock.json ([1f60d59](https://github.com/prismicio/prismic-next/commit/1f60d592d73eb2b384e601c49b3fb0a2953fe5ac))
* update repo ([c281f75](https://github.com/prismicio/prismic-next/commit/c281f75b9cda0e5476245560b400720cc8d3a1dc))
* update test ([e557277](https://github.com/prismicio/prismic-next/commit/e5572775d7b9476180eba5d2ae3ba158bfceb472))
* update TS doc for exit preview ([206e8c3](https://github.com/prismicio/prismic-next/commit/206e8c3a685ae10cc8baa2d02e145c88b2862b79))
* update tsdoc ([38f2430](https://github.com/prismicio/prismic-next/commit/38f24309ebcb2b72536a2da187c15af69450c1f3))
