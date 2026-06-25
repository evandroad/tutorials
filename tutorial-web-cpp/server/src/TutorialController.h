#ifndef TUTORIALCONTROLLER_H
#define TUTORIALCONTROLLER_H

#include <string>
#include <vector>
#include "../lib/httplib.h"
#include "../lib/json.hpp"
#include "MyResponse.h"

using namespace httplib;
using namespace std;
using json = nlohmann::json;

class Tutorial {
public:
  int number;
  string title;
  string image;

  json to_json() const {
    return json{{"number", number}, {"title", title}, {"image", image}};
  }
};

class TutorialController {
public:
  TutorialController();
  
  string listTutorial();
  MyResponse insertTutorial(const string& number, const string& tutorial, const string& image, const vector<char>& imageData);
  MyResponse updateTutorial(const string& currentTutorial, const string& currentImage, const string& number, const string& tutorial, const string& image, const vector<char>& imageData);
  MyResponse deleteTutorial(const string& tutorial);
  vector<Tutorial> getTutorials();
  string getJsonString(const vector<Tutorial>& list);
  void saveFile(const string& content, const string& fileName);
  void saveImage(filesystem::path imagePath, const vector<char>& image);

private:
  string ROOT_DIR;
};

#endif // TUTORIALCONTROLLER_H