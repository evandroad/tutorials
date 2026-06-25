#include "ContentController.h"
#include "../lib/httplib.h"
#include "../lib/json.hpp"

using namespace httplib;
using namespace std;
using json = nlohmann::json;

ContentController::ContentController() {
  this->ROOT_DIR = "../tutorial/data/";
}

string ContentController::listContent(string tutorial) {
  vector<Content> contents = this->getContents(tutorial);
  return this->getJsonString(contents);
}

MyResponse ContentController::insertContent(string tutorial, int number, string title, string content) {
	vector<Content> contents = getContents(tutorial);

	Content _content;
	_content.number = number;
	_content.title = title;
	_content.content = content;
	contents.push_back(_content);

	sort(contents.begin(), contents.end(), [](const Content& a, const Content& b) { return a.number < b.number; });
  
	saveFile(this->getJsonString(contents), tutorial);

  json j;
  j["message"] = "Conteúdo salvo com sucesso.";
  return MyResponse(200, j.dump());
}

MyResponse ContentController::updateContent(string tutorial, int number, string title, string content, string oldTitle) {
  vector<Content> contents = getContents(tutorial);

  for (int i = 0; i < contents.size(); i++) {
    if (contents[i].title == oldTitle) {
      contents[i].number = number;
      contents[i].title = title;
      contents[i].content = content;
    }
  }

	sort(contents.begin(), contents.end(), [](const Content& a, const Content& b) { return a.number < b.number; });
  
	saveFile(this->getJsonString(contents), tutorial);

  json j;
  j["message"] = "Conteúdo salvo com sucesso.";
  return MyResponse(200, j.dump());
}

MyResponse ContentController::deleteContent(string tutorial, string title) {
  vector<Content> contents = getContents(tutorial);

  auto it = find_if(contents.begin(), contents.end(), [&title](const Content& obj) { return obj.title == title; });

  if (it != contents.end()) {
    contents.erase(it);
  }

	saveFile(this->getJsonString(contents) , tutorial);
	
  json j;
  j["message"] = "Conteúdo apagado com sucesso.";
  return MyResponse(200, j.dump());
}

void ContentController::saveFile(string content, string fileName) {
  ofstream output_file(this->ROOT_DIR + fileName + ".json");
  if (!output_file.is_open()) {
    cerr << "Erro ao abrir o arquivo JSON para escrita" << endl;
    return;
  }

  output_file << content << endl;
  output_file.close();
}

vector<Content> ContentController::getContents(string tutorial) {
  vector<Content> contents;
  
  ifstream file(this->ROOT_DIR + tutorial + ".json");
  if (!file.is_open()) {
    cerr << "Erro ao abrir o arquivo JSON" << endl;
    return contents;
  }

  json j = json::parse(file);
  file.close();

  for (const auto& item : j) {
    Content _content;
    _content.number = item["number"];
    _content.title = item["title"];
    _content.content = item["content"];
    contents.push_back(_content);
  }

  return contents;
}

string ContentController::getJsonString(const vector<Content>& list) {
  json output_json;
  for (const auto& content : list) {
    output_json.push_back(content.to_json());
  }

  return output_json.dump(2);
}