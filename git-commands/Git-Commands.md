# Git Commands

[Home](../README.md)

- ## Summary

  - [#1 git config](#1-git-config)
  - [#2 git init](#2-git-init)
  - [#3 git clone](#3-git-clone)
  - [#4 git status](#4-git-status)
  - [#5 git add](#5-git-add)
  - [#6 git commit](#6-git-commit)
  - [#7 git diff](#7-git-diff)
  - [#8 git restore](#8-git-restore)
  - [#9 git reset](#9-git-reset)
  - [#10 git rm](#10-git-rm)
  - [#11 git log](#11-git-log)
  - [#12 git show](#12-git-show)
  - [#13 git tag](#13-git-tag)
  - [#14 git branch](#14-git-branch)
  - [#15 git checkout](#15-git-checkout)
  - [#16 git merge](#16-git-merge)
  - [#17 git remote](#17-git-remote)
  - [#18 git push](#18-git-push)
  - [#19 git pull](#19-git-pull)
  - [#20 git stash](#20-git-stash)

## #1 git config

This command sets the author name and email address respectively to be used with your commits.

    git config –global user.name "[name]"  
    git config –global user.email "[email]"

![config](img_git_commands/config-1.png)

___

## #2 git init

This command is used to start a new repository.

    git init [repository name]

![init](img_git_commands/init-1.png)

___

## #3 git clone

This command is used to obtain a repository from an existing URL.

    git clone [url]

![clone](img_git_commands/clone-1.png)

___

## #4 git status

This command lists all the files that have to be committed.

    git status

![status](img_git_commands/status-1.png)

___

## #5 git add

- This command adds a file to the staging area.

        git add [file]

![add-1](img_git_commands/add-1.png)

___

- This command adds one or more to the staging area.

        git add *

![add-2](img_git_commands/add-2.png)

___

## #6 git commit

- This command records or snapshots the file permanently in the version history.

        git commit -m "[Type in the commit message]"

![commit-1](img_git_commands/commit-1.png)

___

- This command commits any files you’ve added with the git add command and also commits any files you’ve changed since then.

        git commit -a

![commit-2](img_git_commands/commit-2.png)

___

## #7 git diff

- This command shows the file differences which are not yet staged.

        git diff

![diff-1](img_git_commands/diff-1.png)

___

- This command shows the differences between the files in the staging area and the latest version present.

        git diff –staged 

![diff-2](img_git_commands/diff-2.png)

___

- This command shows the differences between the two branches mentioned.

        git diff [first branch] [second branch]

![diff-3](img_git_commands/diff-3.png)

___

## #8 git restore

- This command restores the contents of the file to that of the last commit.

        git restore [file]

___

## #9 git reset

- This command unstages the file, but it preserves the file contents.

        git reset [file]  

![reset-1](img_git_commands/reset-1.png)

___

- This command undoes the last commit and moves changes locally to staged.

        git reset --soft HEAD~  

![reset-2](img_git_commands/reset-2.png)

___

- This command discards the last commit and its contents.

        git reset -–hard HEAD~

![reset-3](img_git_commands/reset-3.png)

___

## #10 git rm

This command deletes the file from your working directory and stages the deletion.

    git rm [file]

![rm](img_git_commands/rm-1.png)

___

## #11 git log

- This command is used to list the version history for the current branch.

        git log

![log-1](img_git_commands/log-1.png)

___

- This command lists the commit history of the current branch in just one line.

        git log -–oneline

![log-2](img_git_commands/log-2.png)

___

- This command is used to list the commit history of the current branch formatted in one line.

        git log --pretty=format:"%C(yellow)%ad%Creset | %C(blue)%an%Creset | %Cgreen%s%Creset %Cred%d%Creset" --date=short

___

## #12 git show

This command shows the metadata and content changes of the specified commit.

    git show [commit]

![show](img_git_commands/show-1.png)

___

## #13 git tag

This command is used to give tags to the specified commit.

    git tag [commitID]

![tag](img_git_commands/tag-1.png)

___

## #14 git branch

- This command lists all the local branches in the current repository.

        git branch

![branch-1](img_git_commands/branch-1.png)

___

- This command creates a new branch.

        git branch [branch name]

![branch-2](img_git_commands/branch-2.png)

___

- This command deletes the feature branch.

        git branch -d [branch name]

![branch-3](img_git_commands/branch-3.png)

___

## #15 git checkout

- This command is used to switch from one branch to another.

        git checkout [branch name]

![checkout-1](img_git_commands/checkout-1.png)

___

- This command creates a new branch and also switches to it.

        git checkout -b [branch name]

![checkout-2](img_git_commands/checkout-2.png)

___

## #16 git merge

This command merges the specified branch’s history into the current branch.

    git merge [branch name]

![merge](img_git_commands/merge-1.png)

___

## #17 git remote

This command is used to connect your local repository to the remote server.

    git remote add [variable name] [Remote Server Link]

![remote](img_git_commands/remote-1.png)

___

## #18 git push

- This command sends the committed changes of master branch to your remote repository.

        git push [variable name] master

![push-1](img_git_commands/push-1.png)

___

- This command sends the branch commits to your remote repository.

        git push [variable name] [branch]

![push-2](img_git_commands/push-2.png)

___

- This command pushes all branches to your remote repository.

        git push –all [variable name]

![push-3](img_git_commands/push-3.png)

___

- This command deletes a branch on your remote repository.

        git push [variable name] :[branch name]

![push-4](img_git_commands/push-4.png)

___

## #19 git pull

This command fetches and merges changes on the remote server to your working directory.

    git pull [Repository Link]

![pull](img_git_commands/pull-1.png)

___

## #20 git stash

- This command temporarily stores all the modified tracked files.

        git stash save "message"

![stash-1](img_git_commands/stash-1.png)

___

- This command restores the most recently stashed files.

        git stash pop

![stash-2](img_git_commands/stash-2.png)

___

- This command lists all stashed changesets.

        git stash list

![stash-3](img_git_commands/stash-3.png)

___

- This command discards the most recently stashed changeset.

        git stash drop

![stash-4](img_git_commands/stash-4.png)
