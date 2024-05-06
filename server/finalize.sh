#!/bin/bash

process_name="server/server"

matching_pids=$(pgrep -f "$process_name")

if [ -z "$matching_pids" ]; then
  echo "Nenhum processo correspondente encontrado para o nome '$process_name'."
  exit 1
fi

for pid in $matching_pids; do
  echo "Encerrando processo com PID $pid."
  kill $pid
done