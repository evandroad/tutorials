#ifndef UTIL_H
#define UTIL_H

#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

class Util {
public:

  static unordered_map<string, string> getBody(string content);
  static string urlDecode(string param);
};

#endif // UTIL_H