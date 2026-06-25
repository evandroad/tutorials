#!/bin/bash

echo "compilando..."

g++ -o server-cpp src/main.cpp src/TutorialController.cpp src/ContentController.cpp src/MyResponse.cpp src/Util.cpp

echo "finalizou!!!"
