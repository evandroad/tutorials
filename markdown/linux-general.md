# Linux Settings

[Home](../README.md)

## Git
```
sudo apt install git
```

## Oh my bash
In `https://ohmybash.nntoan.com/`
```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)"
```
Edit the .bashrc file.
```
nano .bashrc
```
Replace `OSH_THEME=font` with `OSH_THEME=agnoster`.

## Fonts
```
sudo apt install fonts-powerline

curl -fsSLo "UbuntuMonoNerdFont-Regular.ttf" \
  "https://github.com/ryanoasis/nerd-fonts/raw/master/patched-fonts/UbuntuMono/Regular/UbuntuMonoNerdFont-Regular.ttf"

cd ~/.local/share

rm -rf fonts/

mkdir fonts

mv UbuntuMonoNerdFont-Regular.ttf ~/.local/share/fonts/
```
## Get Profile ID
```
dconf list /org/gnome/terminal/legacy/profiles:/
```
## Select Font
```
gsettings set org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/<profile-id>/ font 'Ubuntu Mono Regular 12'
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
```
```
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
