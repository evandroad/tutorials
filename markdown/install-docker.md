# Install docker

[Home](../README.md)

Atualizar pacotes do linux
```
sudo apt-get update
```
instalar o docker
```
sudo apt install docker*
```
Iniciando docker
```
sudo systemctl start docker
```
Verificar docker
```
systemctl status docker
```
Versão do docker
```
docker --version
```
Rodando container de teste
```
sudo docker run hello-world
```
Adicionar usuario ao grupo de admin
```
sudo usermod -aG docker $USER
```
Executar o comando a seguir para ativar as mudanças no grupo
```
newgrp docker
```