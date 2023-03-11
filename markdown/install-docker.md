# Install docker

[Home](../README.md)

Atualizar pacotes do linux
```
sudo apt-get update
```
Remover instalações antigas
```
sudo apt-get remove docker-engine docker.io
```
instalar o docker
```
sudo apt install docker.io
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
obs.: Reiniciar o pc para reler as permissões.