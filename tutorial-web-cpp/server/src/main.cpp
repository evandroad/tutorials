#include <iostream>
#include <vector>

#include "../lib/httplib.h"
#include "../lib/json.hpp"

#include "TutorialController.h"
#include "ContentController.h"
#include "Util.h"

using namespace httplib;
using json = nlohmann::json;
using namespace std;
const string JSON = "application/json";

TutorialController tutorialController;
ContentController contentController;
thread t;

void chamadaAoSistema() {
  try {
    system("cd ..; git add .; git commit -m \"feat: add content\"; git push");
  } catch (const exception& e) {
    cerr << "Exceção capturada: " << e.what() << endl;
  }
}

void status(const httplib::Request&, httplib::Response& res) {
  json j;
  j["code"] = 200;
  j["message"] = "ok";

  res.set_content(j.dump(), JSON);
}

void listTutorial(const httplib::Request&, httplib::Response& res) {
  res.set_content(tutorialController.listTutorial(), JSON);
}

void insertTutorial(const httplib::Request& req, httplib::Response& res) {
  auto number = req.get_file_value("number");
  auto tutorial = req.get_file_value("tutorial");
  auto image = req.get_file_value("image");
  vector<char> image_data(image.content.data(), image.content.data() + image.content.size());
  
  MyResponse myResponse = tutorialController.insertTutorial(number.content, tutorial.content, image.filename, image_data);

  res.status = myResponse.code;
  res.set_content(myResponse.message, JSON);
}

void updateTutorial(const httplib::Request& req, httplib::Response& res) {
  auto currentTutorial = req.get_file_value("currentTutorial");
  auto currentImage = req.get_file_value("currentImage");
  auto number = req.get_file_value("number");
  auto tutorial = req.get_file_value("tutorial");
  auto image = req.get_file_value("image");
  vector<char> image_data(image.content.data(), image.content.data() + image.content.size());

  MyResponse myResponse = tutorialController.updateTutorial(currentTutorial.content, currentImage.content, number.content, tutorial.content, image.filename, image_data);

  res.status = myResponse.code;
  res.set_content(myResponse.message, JSON);
}

void deleteTutorial(const httplib::Request& req, httplib::Response& res) {
  auto tutorial = req.path_params.at("tutorial");

  MyResponse myResponse = tutorialController.deleteTutorial(tutorial);

  res.status = myResponse.code;
  res.set_content(myResponse.message, JSON);
}

void listContent(const httplib::Request& req, httplib::Response& res) {
  auto _tutorial = req.path_params.at("tutorial");
  res.set_content(contentController.listContent(_tutorial), JSON);
}

void insertContent(const httplib::Request& req, httplib::Response& res) {
  unordered_map<string, string> body = Util::getBody(req.body);
  
  string tutorial = body["tutorial"];
  int number = stoi(body["number"]);
  string title = body["title"];
  string content = body["content"];

  MyResponse myResponse = contentController.insertContent(tutorial, number, title, content);

  res.status = myResponse.code;
  res.set_content(myResponse.message, JSON);
}

void updateContent(const httplib::Request& req, httplib::Response& res) {
  unordered_map<string, string> body = Util::getBody(req.body);
  
  string tutorial = body["tutorial"];
  int number = stoi(body["number"]);
  string title = body["title"];
  string oldTitle = body["oldTitle"];
  string content = body["content"];

  MyResponse myResponse = contentController.updateContent(tutorial, number, title, content, oldTitle);

  res.status = myResponse.code;
  res.set_content(myResponse.message, JSON);
}

void deleteContent(const httplib::Request& req, httplib::Response& res) {
  auto tutorial = req.path_params.at("tutorial");
  auto title = req.path_params.at("title");

  MyResponse myResponse = contentController.deleteContent(tutorial, title);

  res.status = myResponse.code;
  res.set_content(myResponse.message, JSON);
}

int main() {
  cout << "Servidor rodando em \033[34mhttp://localhost:8080\033[0m" << endl;
  cout << "Servidor rodando em \033[34mhttp://localhost:8080/generate\033[0m" << endl;

  Server server;
  server.set_base_dir("../");

  server.Get("/", [](const httplib::Request&, httplib::Response& res) {
    res.set_redirect("tutorial/index.html", 301);
  });

  server.Get("/generate", [](const httplib::Request&, httplib::Response& res) {
    res.set_redirect("generate/index.html", 301);
  });

  server.Get("/status", status);
  server.Get("/tutorial", listTutorial);
  server.Post("/tutorial", insertTutorial);
  server.Put("/tutorial", updateTutorial);
  server.Delete("/tutorial/:tutorial", deleteTutorial);
  server.Get("/content/:tutorial", listContent);
  server.Post("/content", insertContent);
  server.Put("/content", updateContent);
  server.Delete("/content/:tutorial/:title", deleteContent);

  server.listen("localhost", 8080);
}