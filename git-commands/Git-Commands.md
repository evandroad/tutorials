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


## #2 git init

This command is used to start a new repository.

    git init [repository name]


## #3 git clone

This command is used to obtain a repository from an existing URL.

    git clone [url]

## #4 git status

This command lists all the files that have to be committed.

    git status

## #5 git add

- This command adds a file to the staging area.

        git add [file]

- This command adds one or more to the staging area.

        git add *

## #6 git commit

- This command records or snapshots the file permanently in the version history.

        git commit -m "[Type in the commit message]"

- This command commits any files you’ve added with the git add command and also commits any files you’ve changed since then.

        git commit -a

## #7 git diff

- This command shows the file differences which are not yet staged.

        git diff

- This command shows the differences between the files in the staging area and the latest version present.

        git diff –staged 

- This command shows the differences between the two branches mentioned.

        git diff [first branch] [second branch]

## #8 git restore

- This command restores the contents of the file to that of the last commit.

        git restore [file]

## #9 git reset

- This command unstages the file, but it preserves the file contents.

        git reset [file]  

- This command undoes the last commit and moves changes locally to staged.

        git reset --soft HEAD~  

- This command discards the last commit and its contents.

        git reset -–hard HEAD~

## #10 git rm

This command deletes the file from your working directory and stages the deletion.

    git rm [file]

## #11 git log

- This command is used to list the version history for the current branch.

        git log

- This command lists the commit history of the current branch in just one line.

        git log -–oneline

- This command is used to list the commit history of the current branch formatted in one line.

        git log --pretty=format:"%C(yellow)%ad%Creset | %C(blue)%an%Creset | %Cgreen%s%Creset %Cred%d%Creset" --date=short

## #12 git show

This command shows the metadata and content changes of the specified commit.

    git show [commit]

## #13 git tag

This command is used to give tags to the specified commit.

    git tag [commitID]

## #14 git branch

- This command lists all the local branches in the current repository.

        git branch

- This command creates a new branch.

        git branch [branch name]

- This command deletes the feature branch.

        git branch -d [branch name]

## #15 git checkout

- This command is used to switch from one branch to another.

        git checkout [branch name]

- This command creates a new branch and also switches to it.

        git checkout -b [branch name]

## #16 git merge

This command merges the specified branch’s history into the current branch.

    git merge [branch name]

## #17 git remote

This command is used to connect your local repository to the remote server.

    git remote add [variable name] [Remote Server Link]

## #18 git push

- This command sends the committed changes of master branch to your remote repository.

        git push [variable name] master

- This command sends the branch commits to your remote repository.

        git push [variable name] [branch]

- This command pushes all branches to your remote repository.

        git push –all [variable name]

- This command deletes a branch on your remote repository.

        git push [variable name] :[branch name]

## #19 git pull

This command fetches and merges changes on the remote server to your working directory.

    git pull [Repository Link]

## #20 git stash

- This command temporarily stores all the modified tracked files.

        git stash save "message"

- This command restores the most recently stashed files.

        git stash pop

- This command lists all stashed changesets.

        git stash list

- This command discards the most recently stashed changeset.

        git stash drop
