#ifndef MYRESPONSE_H
#define MYRESPONSE_H

#include <string>

using namespace std;

class MyResponse {
public:
  int code;
  string message;

  MyResponse(int code, string message);
};

#endif // CONTENTCONTROLLER_H