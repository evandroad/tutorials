#include "Util.h"

unordered_map<string, string> Util::getBody(string content) {
  vector<string> result;
  unordered_map<string, string> body;
  bool isKey = true;
  string key, value;

  for (int i = 0; i < content.size(); i++) {
    if (content[i] == '&') {
      result.push_back(value);
      value = "";
      i++;
    }

    if (i == content.size() - 1) {
      value += content[i];
      result.push_back(value);
    }

    value += content[i];
  }

  for (string item : result) {
    key = "";
    value = "";
    isKey = true;
    
    for (int i = 0; i < item.size(); i++) {
      if (item[i] == '=') {
        isKey = false;
        i++;
      }

      if (isKey) {
        key += item[i];
      } else {
        if (item[i] == '+') {
          value += ' ';
        } else {
          value += item[i];
        }
      }
    }

    body.insert({key, Util::urlDecode(value)});
  }

  return body;
}

string Util::urlDecode(string param) {
  string ret;
  char ch;
  int i, ii;
  
  for (i = 0; i < param.length(); i++) {
    if (param[i] == '%') {
      sscanf(param.substr(i + 1, 2).c_str(), "%x", &ii);
      ch = static_cast<char>(ii);
      ret += ch;
      i = i + 2;
    } else {
      ret += param[i];
    }
  }

  return ret;
}