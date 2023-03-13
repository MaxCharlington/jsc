#include <iostream>
#include <cmath>

struct math_t {
  const double PI = 3.14159265358979323846;
  const double E = 2.71828182845904523536;

  constexpr double abs(double x) const noexcept {
    return std::abs(x);
  }


  constexpr double ceil(double x) const noexcept {
    return std::ceil(x);
  }

  constexpr double floor(double x) const noexcept {
    return std::floor(x);
  }

  constexpr double trunc(double x) const noexcept {
    return std::trunc(x);
  }

  constexpr double round(double x) const noexcept {
    return std::round(x);
  }


  constexpr double cos(double x) const noexcept {
    return std::cos(x);
  }

  constexpr double exp(double x) const noexcept {
    return std::exp(x);
  }

  constexpr double log(double x) const noexcept {
    return std::log(x);
  }

  constexpr double max(double x, double y) const noexcept {
    return std::max(x, y);
  }

  constexpr double min(double x, double y) const noexcept {
    return std::min(x, y);
  }

  constexpr double pow(double x, double y) const noexcept {
    return std::pow(x, y);
  }


  constexpr double sin(double x) const noexcept {
    return std::sin(x);
  }

  constexpr double sqrt(double x) const noexcept {
    return std::sqrt(x);
  }

  constexpr double tan(double x) const noexcept {
    return std::tan(x);
  }
};

inline const math_t Math{};
