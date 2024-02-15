// This is ROOT macro to generate the link URL
// For all histogramsin 4x4 matrix

#include <array>
#include <iostream>
#include <vector>

#include "TString.h"

void link_gen()
{
  const auto nMods = 1;
  const auto nChs = 64;

  const auto base_url =
      "http://172.18.4.77:8080/"
      "?nobrowser&monitoring=5000&layout=grid4x4";

  std::vector<std::array<std::string, 2>> links;

  for (auto iMod = 0; iMod < nMods; iMod++) {
    std::string buf;
    std::string name = Form("Brd%02d Ch%02d to %02d", iMod, 0, 15);
    int counter = 0;
    for (auto iCh = 0; iCh < nChs; iCh++) {
      buf += Form("Brd%02d/ADC%02d_%02d", iMod, iMod, iCh);
      counter++;

      if (counter == 16) {
        links.push_back({name, buf});
        buf.clear();
        counter = 0;
        name = Form("Brd%02d Ch%02d to %02d", iMod, iCh + 1, iCh + 16);
      } else if (iCh != nChs - 1) {
        buf += ",";
      }
    }
    if (buf.size() > 0) links.push_back({name, buf});
  }

  for (auto &&link : links) {
    std::cout << "{\n";
    std::cout << "\"name\": \"" << link[0] << "\",\n";
    std::cout << "\"url\": \"" << base_url << "&items=[" << link[1] << "]\"\n}";
    if (link != *(links.end() - 1)) std::cout << ",";
    std::cout << std::endl;
  }
}