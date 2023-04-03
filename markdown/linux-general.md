# Linux Settings

[Home](../README.md)

## Oh my bash
https://ohmybash.nntoan.com/

Edit the .bashrc file.
```
nano .bashrc
```
Replace `OSH_THEME=font` with `OSH_THEME=agnoster`.

## Fonts
```
sudo apt install fonts-powerline
```
## logo-ls
https://github.com/Yash-Handa/logo-ls

## nerd fonts
https://www.nerdfonts.com/font-downloads

## create alias
```
nano ~/.bashrc
alias ls = "logo-ls"
```

# Generate SSH

Configure git before.
```
git config --global user.name "Fulano de Tal"
git config --global user.email fulanodetal@exemplo.br
```

To create the ssh key.
```
ssh-keygen -t ed25519 -C "your_email@example.com"
```
Start the ssh-agent in the background.
```
eval "$(ssh-agent -s)"
```
Add your SSH private key to the ssh-agent.
```
ssh-add ~/.ssh/id_ed25519
```
Copy the SSH public key to your clipboard.
```
cat ~/.ssh/id_ed25519.pub
