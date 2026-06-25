#include "TutorialController.h"
#include "../lib/httplib.h"
#include "../lib/json.hpp"
#include <algorithm>
#include <stdio.h>

using namespace httplib;
using namespace std;
using json = nlohmann::json;

TutorialController::TutorialController() {
  this->ROOT_DIR = "../tutorial/";
}

string TutorialController::listTutorial() {
  vector<Tutorial> tutorials = this->getTutorials();
  return this->getJsonString(tutorials);
}

MyResponse TutorialController::insertTutorial(const string& number, const string& tutorial, const string& image, const vector<char>& imageData) {
  string ext = image.substr(image.find_last_of('.'));
  filesystem::path imagePath = this->ROOT_DIR + "img/" + tutorial + ext;
  saveImage(imagePath, imageData);

  vector<Tutorial> tutorials = this->getTutorials();

  Tutorial _tutorial;
  _tutorial.number = stoi(number);
  _tutorial.title = tutorial;
  _tutorial.image = tutorial + ext;
  tutorials.push_back(_tutorial);

  sort(tutorials.begin(), tutorials.end(), [](const Tutorial& a, const Tutorial& b) { return a.number < b.number; });

  this->saveFile(this->getJsonString(tutorials), "tutorials");
  this->saveFile("[]", tutorial);

  json j;
  j["message"] = "Tutorial salvo com sucesso.";
  return MyResponse(200, j.dump());
}

MyResponse TutorialController::updateTutorial(const string &currentTutorial, const string &currentImage, const string &number, const string &tutorial, const string &image, const vector<char> &imageData) {
  filesystem::path oldTutorialPath = this->ROOT_DIR + "data/" + currentTutorial + ".json";
	filesystem::path newTutorialPath = this->ROOT_DIR + "data/" + tutorial + ".json";
  filesystem::path oldImagePath = this->ROOT_DIR + "img/" + currentImage;
  string ext;

  if (image == "") {
    ext = currentImage.substr(currentImage.find_last_of('.'));
    filesystem::path newImagePath = this->ROOT_DIR + "img/" + tutorial + ext;
		rename(oldImagePath, newImagePath);
  } else {
		ext = image.substr(image.find_last_of('.'));
		filesystem::path newImagePath = this->ROOT_DIR + "img/" + tutorial + ext;
    remove(oldImagePath);
		saveImage(newImagePath, imageData);
  }

	rename(oldTutorialPath, newTutorialPath);

  vector<Tutorial> tutorials = this->getTutorials();
  
  for (int i = 0; i < tutorials.size(); i++) {
		if (tutorials[i].title == currentTutorial) {
			tutorials[i].number = stoi(number);
			tutorials[i].title = tutorial;
			tutorials[i].image = tutorial + ext;
			break;
		}
	}

  sort(tutorials.begin(), tutorials.end(), [](const Tutorial& a, const Tutorial& b) { return a.number < b.number; });

  this->saveFile(this->getJsonString(tutorials), "tutorials");

  json j;
  j["message"] = "Tutorial atualizado com sucesso.";
  return MyResponse(200, j.dump());
}

MyResponse TutorialController::deleteTutorial(const string& tutorial) {
  vector<Tutorial> tutorials = this->getTutorials();
  string image;
  
  for (Tutorial _tutorial : tutorials) {
		if (_tutorial.title == tutorial) {
			image = _tutorial.image;
			break;
		}
	}

  auto it = find_if(tutorials.begin(), tutorials.end(), [&tutorial](const Tutorial& obj) { return obj.title == tutorial; });

  if (it != tutorials.end()) {
    tutorials.erase(it);
  }

  this->saveFile(this->getJsonString(tutorials), "tutorials");
  
  filesystem::path jsonPath = this->ROOT_DIR + "data/" + tutorial + ".json";
	remove(jsonPath);
  
  filesystem::path imgPath = this->ROOT_DIR + "img/" + image;
	remove(imgPath);

  json j;
  j["message"] = "Tutorial apagado com sucesso.";
  return MyResponse(200, j.dump());
}

vector<Tutorial> TutorialController::getTutorials() {
  vector<Tutorial> tutorials;
  
  ifstream file(this->ROOT_DIR + "data/tutorials.json");
  if (!file.is_open()) {
    cerr << "Erro ao abrir o arquivo JSON" << endl;
    return tutorials;
  }

  json j = json::parse(file);
  file.close();

  for (const auto& item : j) {
    Tutorial _tutorial;
    _tutorial.number = item["number"];
    _tutorial.title = item["title"];
    _tutorial.image = item["image"];
    tutorials.push_back(_tutorial);
  }

  return tutorials;
}

string TutorialController::getJsonString(const vector<Tutorial>& list) {
  json output_json;
  for (const auto& tutorial : list) {
    output_json.push_back(tutorial.to_json());
  }

  return output_json.dump(2);
}

void TutorialController::saveFile(const string& content, const string& fileName) {
  ofstream output_file(this->ROOT_DIR + "data/" + fileName + ".json");
  if (!output_file.is_open()) {
    cerr << "Erro ao abrir o arquivo JSON para escrita" << endl;
    return;
  }

  output_file << content << endl;
  output_file.close();
}

void TutorialController::saveImage(filesystem::path imagePath, const vector<char> &image) {
  try {
    ofstream outfile(imagePath, ios::binary);
    outfile.write(image.data(), image.size());
    outfile.close();
  } catch (const exception& e) {
    cerr << "Erro ao salvar a imagem." << endl; 
  }
}