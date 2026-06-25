#ifndef CONTENTCONTROLLER_H
#define CONTENTCONTROLLER_H

#include <string>
#include <vector>
#include "../lib/httplib.h"
#include "../lib/json.hpp"
#include "MyResponse.h"

using namespace httplib;
using namespace std;
using json = nlohmann::json;

class Content {
public:
  int number;
  string title;
  string content;

  json to_json() const {
    return json{{"number", number}, {"title", title}, {"content", content}};
  }
};

class ContentController {
public:
  ContentController();
  
  string listContent(string tutorial);
  MyResponse insertContent(string tutorial, int number, string title, string content);
  MyResponse updateContent(string tutorial, int number, string title, string content, string oldTitle);
  MyResponse deleteContent(string tutorial, string title);
  void saveFile(string content, string fileName);
  vector<Content> getContents(string tutorial);
  string getJsonString(const vector<Content>& list);

private:
  string ROOT_DIR;
};

#endif // CONTENTCONTROLLER_H