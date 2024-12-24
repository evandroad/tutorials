#!/bin/bash

process_name="web-server"

# Verifica se o processo está rodando
if pgrep -x "$process_name" > /dev/null
then
  echo "O processo $process_name está rodando. Matando o processo..."
  # Mata o processo
  pkill -x "$process_name"
  if [ $? -eq 0 ]; then
    echo "O processo $process_name foi terminado com sucesso."
  else
    echo "Falha ao terminar o processo $process_name."
  fi
else
  echo "O processo $process_name não está rodando."
fi