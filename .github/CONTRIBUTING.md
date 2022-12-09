# Contributing


## Repository Conventions
Before contributing to our project, there are a few conventions we follow that you need to know about.

### Commit Messages
To help keep better track of contributions made to this project, we follow the [conventional commits scheme](https://www.conventionalcommits.org/en/v1.0.0/#specification) along with the [Angular commit message guideline](https://gist.github.com/brianclements/841ea7bffdb01346392c). It is also suggested to perform atomic commits whenever possible.

The format is as follows:

```txt
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Guidelines
The commitlint tool is configured as a pre-commit hook to help enforce this commit message scheme.

##### Header
The header consists of:

```txt
<type>[optional scope]: <description>
```

- The length **MUST NOT** exceed 72 characters

##### Type
The type **MUST** be one of the following:

- `feat`: Addition of a new feature
- `fix`: Production bugfix
- `build`: Development changes (scripts, configs, tools, dependencies)
- `perf`: Backwards-compatible performance improvements
- `test`: Add, remove, modify or refactor tests
- `docs`: Documentation changes (both internal and external)
- `style`: Code formatting without changing its behaviour
- `refactor`: Code restructuring without changing its behaviour
- `ci`: Changes to CI and deployment system
- `revert`: Reverts mentioned commit

This section also **MUST** comply by the following points:

- The type name **MUST** be lowercase
- `fix` type **MUST** mention the associated issue tag
- `fix` type description **MUST** either be `fix issue <issue tag>`, or a summary describing the fix with the phrase `Fixes <issue tag>` in the footer of the commit message.
- `revert` type **MUST** have `revert:` followed by a space and then the header of the reverted commit message, and **MUST** have body in the following format: `This reverts commit <hash>`. The body may also contain reason for revert.

##### Scope
The scope depends on what's registered in the [commitlint config](configs/commitlint.json).

This section also **MUST** comply by the following points:

- The scope name **MUST** be lowercase

##### Description

- The content **MUST** be lowercase
- It **MUST NOT** end with a full-stop/period.

##### Body

- This section **MUST** use words in the form of imperative present tense, such as `fix issue #1234` and not `fixes issue #1234` or `fixed issue #1234`
- The length of each line **MUST NOT** exceed 72 characters
- The length of the entire section **MUST NOT** exceed 720 characters
- The content **MUST** be sentence case
- Each line **MUST NOT** end with a full-stop/period.
- It **SHOULD** be provided when possible

##### Footer
In case of a breaking change, the footer **MUST** follow the following format:

```txt
BREAKING CHANGE: <summary>

<breaking change description>


Fixes <issue tag>
```

- The length of each line **MUST NOT** exceed 72 characters
- The length of the entire section **MUST NOT** exceed 360 characters
- Each line **MUST NOT** end with a full-stop/period.
- It **SHOULD** be provided when possible


### Versioning
This project follows [Semantic Versioning](http://semver.org/). The versioning process is automated, and you don't need to know anything about it to be able to contribute — other than the fact that following our [commit message conventions](#commit-messages) helps make this process easier.

### Pull Requests and Merging



## General Contribution
You can contribute to this project in multiple ways. This section explains how you can perform some quick contributions. For further contribution, see our [repository workflow](#repository-workflow).

### Requesting Features
To be able to improve this project the way our users want, we're open to feature and enhancement suggestions at all times. [Go ahead and suggest](https://github.com/spuggle/typescript-template/issues/new?assignees=&labels=Type%3A+Feature&template=feature-suggestion.yml) what you would like to see added to the project!

We've set up a template to help you with providing us relevant information about your suggestion. You may include any additional points that you feel are relevant to the suggestion.

#### Working on the Feature
If you want to work on the suggestion too, you may fork this repository to start making changes, and then create a pull request to the `next` branch once you're ready to submit the contributions. Make sure to mention forking the repository or even possibly linking your suggestion issue to your fork, so that others know that you're working on it, and maybe even help you with the contributions.

You should expect your suggested feature to ship with the next non-hotfix release of the project. To see the progress of any ongoing development, see [projects](https://github.com/spuggle/typescript-template/projects) — or if you want to know the inner workings of this repository, see our [repository workflow](#repository-workflow).

### Reporting Bugs
It is very likely for bugs to end up in the production release of the project, and a user may encounter that bug whilst using the project. To provide a great user experience, we act immediately to fix any bugs as soon as possible.

There are measures you need to take before reporting a bug, and follow certain procedures to carry out the reporting. The following sections help guide you through this.

#### Debugging
Before opening an issue regarding your problem, it is advised that you try to diagnose it yourself to see if you can easily solve it by yourself. Chances are that your problem might not be caused by a bug at all.

If you've made changes to the core configurations of the project, it is likely that those changes might be the root cause of the issue you're facing. These configurations are not intended to be changed by non-contributing users, and are most likely the source of the problem as this repository has no functional parts.

You may attempt to resolve the problem by cloning the `main` branch of this repository into a different directory in your machine, and then working your way through the changes you've made till you find the cause of your problem. You can then fix your problem by either reverting the buggy change, or by fixing it yourself if you know how to.

#### Asking for Help
If you are unable to fix the cause of your problem by yourself, or are unable to identify the cause itself, then you may start a discussion about it. You may be guided though your problem to a solution that works out, or be requested to [open an issue](#opening-an-issue) for further investigation.

##### Reproducing your issue
You will need to tell us the steps we need to follow in order for us to reproduce the problem you're facing as accurately as possible on our machines. This will help us understand the problem better, and discover its cause.

You may also be asked to provide more details — such as about your environment, or the content of select configuration files and debug logs.

#### Opening an Issue
At this point, it is becoming clear that the cause of your issue may be because of a bug in the project after all. You may have been guided to open an issue regarding your problem. If not, you may [create one yourself](https://github.com/spuggle/typescript-template/issues/new?assignees=&labels=Bug%2CInvestigation+required&template=bug_report.yml).

We've set up a template that serves as a guide for you to provide us with relevant information about the issue you're having. You may also mention points that aren't asked in the template, which you feel may be relevant to the situation. You may also refer to any discussions you've had regarding the problem.

#### Working on the Issue
If you want to work on the hotfix too, you may fork this repository to start making changes, and then create a pull request to the `main` branch once you're ready to submit the contributions. You **MUST** link your bug report issue to your fork, so that we can keep track of its progress, and maybe even help you with patching it up. Any delays or inactivity in the patching process of the hotfix may result in transfer of responsibilities.


## Repository Workflow
This repository uses concepts from both gitflow and fork workflow models to convenient for collaborators to integrate the next set of planned features, as well as allowing other contributors to get involved. Here is an explanation on the workflow model set up by us.

Our model sets up two sets of branches for contributions to occur in: [Main Branches](#main-branches) and [Supporting branches](#supporting-branches).

A contributor may choose to fork the repository and branch off from the `next` branch to develop features, or branch off from the `main` branch to work on a hotfix.

### Procedure
This section explains the planning and development procedure for the planned release. The steps are as follows:

#### Feature Planning
A discussion board is opened to collaborators regarding addition of the next set of features. The inspiration behind selected features may depend on the goal of the project, vision of the project authors, and user suggestions. The discussion process involves adjustments to planned features as well as assigning contributors to take lead on certain features.

A separate QnA discussion thread is opened to allow everyone else to talk about the planned features.

#### Assigning Responsibilities
Collaborators usually take lead on managing how a single feature is developed. A group of contributors may choose to work with them.

In the case of lack of collaborators, they may take responsibilities on multiple features. If not possible, then experienced contributors are given the opportunity. A feature may have to be rescheduled if no experienced contributor can take on the role.

#### Development Procedure
A branch for each feature is created in which all the development will happen. Contributors who are also helping out with the feature will need to fork the repository and open a pull request to their target feature branch in order to contribute.

Collaborators or contributors leading development on certain features may open an issue to further discuss it — if not already opened. This will help in splitting tasks, tracking progress and making further decisions.

#### Feature Submission
Once the feature is completed and stable, a pull request to the `next` branch should be opened to allow verification and any last minute changes.

#### Release Testing
After most to all the features are merged to `next`, project testing is done to find and fix bugs. When the branch seems stable enough, it is branched off to a [release branch](#release-branches) to allow any last minute changes and fix problems that appeared.

#### Feature Release
A release is made when the active release branch is merged with `main` and the version tag is bumped.


### Main Branches
These branches reflect the latest state of the purpose they represent, hence are the main branches for those purposes. They exist indefinitely and are actively worked on, unless indicated otherwise.

#### main
The core branch of this repository. It is always in a production-ready state, and its latest state is always delivered to production.

**Guidelines:**

- Merges from non-issue or non-release repositories or pull requests is **NOT** allowed. All pushes are not allowed either, unless absolutely necessary — which should only be done by the authors of this repository.
- Each merge is recognized as a release, and is associated with a version tag.

#### next
The main development branch of the repository, containing the latest development code. The content within it may serve as the source for nightly builds of the project.

> This branch does not represent a specific version of the next release, as the final product is not apparent throughout the development process. A version tag for the next release is created when a [Release Branch](#release-branch) is created.

**Guidelines:**

- New features are **ALWAYS** merged into this branch through pull requests — from both [feature branches](#feature-branches) and forks. This allows keeping the `main` branch stable, and makes it convenient for forking contributors to contribute.
- Branched off to a [release branch](#release-branch) once considered stable and production-ready. At this point, any development in this branch is halted until the release branch merges with `main` to make a release.
- All hotfixes merged to `main` should also be merged to this repository to prevent reported bugs from re-entering production code.

### Supporting Branches
These are a set of branches created to help with the development process. They are used to:

- Allow parallel development
- Make tracking features easier
- Prepare for production releases
- Assist in fixing production problems

#### Feature Branches
These are branches with a short, descriptive name that represent individual features being developed by contributors for an ongoing milestone — and are removed when incorporated or discarded.

Features associated with the ongoing milestone should be merged to the `next` branch before release. If not possible, they will be held back for a future release.

- Branch off from: `next`
- Merge to: `next`
- Versioning: `Minor`
- Naming convention: Anything except `main`, `master`, `next`, `dev`, `develop`, `development`, `hotfix-[HOTFIX_VERSION]` and `release-[RELEASE_VERSION]`

##### Working with Feature Branches

Creating a feature branch (`myfeature`):

``` bash
git checkout -b myfeature next
```

Incorporating the feature back to the `next` branch:

``` bash
git checkout next
git merge --no-ff myfeature
git branch -d myfeature
git push origin next
```

#### Release Branches
These are branches created to help prepare for a new production release. They are created when the `next` branch almost completely reflects the state of the next intended release. Contributions being made to this branch include versioning, bugfixes, metadata changes, and other last minute changes. Merging this branch to the `main` branch is considered a release.

Only one branch of this kind can exist at a time, as multiple versions of this project are not intended to be released simultaneously. Therefore, existence of this kind of branch prevents contributions from being made to the `next` branch for the duration of its existence. This also means that any features that were completed during this period, which are also ready to be merged, should be held back until after the release.

- Branch off from: `next`
- Merge to: `next` and `main`
- Versioning: `Major`, `Minor` and/or `Patch`
- Naming convention: `release-[VERSION]`

##### Working with Release Branches
You need to use pull requests to designated branches to merge any changes, as automated versioning depends on them to be triggered. The following is a guide on how to work with them without creating a pull request, and is subject to change to reflect the true workings of these branches.

Creation of a release branch:

```bash
git checkout -b release-[RELEASE_VERSION] next
```

Releasing the changes by merging the release branch to the `main` branch:

```bash
git checkout main
git merge --no-ff release-[RELEASE_VERSION]
```

Syncing changes in the release branch with the `next` branch by merging to it:

```bash
git checkout develop
git merge --no-ff release-[RELEASE_VERSION]
```

Finally, the release branch is deleted:

```bash
git branch -d release-[RELEASE_VERSION]
```

#### Hotfix Branches
These branches are a lot like release branches, except they're for production bugfixes, require immediate attention, and had minimum preplanning involved. Only one may exist at a given time, and no other contributions to the `main` branch shall be permitted till this kind of branch is merged. All changes should be reflected in the `next` branch, or any active release branch which will eventually sync with the `next` branch.

- Branch off from: `main`
- Merge to: `next` and `main`
- Versioning: `Patch`, sometimes `Major` depending on bug severity
- Naming convention: `hotfix-[HOTFIX_VERSION]`

##### Working with Hotfix Branches
You need to use pull requests to designated branches to merge any changes, as automated versioning depends on them to be triggered. The following is a guide on how to work with them without creating a pull request, and is subject to change to reflect the true workings of these branches.

Creating a hotfix branch:

```bash
git checkout -b hotfix-[HOTFIX_VERSION] master
```

Committing fixes:

```bash
git commit -m "Fixed severe production problem"
```

Merging fixes with `main`:

```bash
git checkout main
git merge --no-ff hotfix-[HOTFIX_VERSION]
```

Syncing changes with `next` branch if no release branch exist, or if absolutely necessary:

```bash
git checkout next
git merge --no-ff hotfix-[HOTFIX_VERSION]
```

Syncing changes with an existing release branch, which will get synced with the `next` branch:

```bash
git checkout release-[RELEASE_VERSION]
git merge --no-ff hotfix-[HOTFIX_VERSION]
```

Deleting the hotfix branch:

```bash
git branch -d hotfix-[HOTFIX_VERSION]
```
