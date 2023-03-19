#include <bit>
#include <cmath>
#include <random>

struct math_t {
  const long double PI = 3.14159265358979323846;
  const long double E = 2.71828182845904523536;
  const long double LN2 = 0.6931471805599453;
  const long double LN10 = 2.302585092994046;
  const long double LOG2E = 1.4426950408889634;
  const long double LOG10E = 0.4342944819032518;

  constexpr long double abs(long double x) const noexcept {
    return std::abs(x);
  }

  constexpr long double ceil(long double x) const noexcept {
    return std::ceil(x);
  }

  constexpr long double floor(long double x) const noexcept {
    return std::floor(x);
  }

  constexpr long double trunc(long double x) const noexcept {
    return std::trunc(x);
  }

  constexpr long double round(long double x) const noexcept {
    return std::round(x);
  }

  constexpr long double cos(long double x) const noexcept {
    return std::cos(x);
  }

  constexpr long double exp(long double x) const noexcept {
    return std::exp(x);
  }

  constexpr long double log(long double x) const noexcept {
    return std::log(x);
  }

  constexpr long double max(long double x, long double y) const noexcept {
    return std::max(x, y);
  }

  constexpr long double min(long double x, long double y) const noexcept {
    return std::min(x, y);
  }

  constexpr long double pow(long double x, long double y) const noexcept {
    return std::pow(x, y);
  }


  constexpr long double sin(long double x) const noexcept {
    return std::sin(x);
  }

  constexpr long double sqrt(long double x) const noexcept {
    return std::sqrt(x);
  }

  constexpr long double acos(long double x) const noexcept {
    return std::acos(x);
  }

  constexpr long double acosh(long double x) const noexcept {
    return std::acosh(x);
  }

  constexpr long double asin(long double x) const noexcept {
    return std::asin(x);
  }

  constexpr long double asinh(long double x) const noexcept {
    return std::asinh(x);
  }

  constexpr long double atan(long double x) const noexcept {
    return std::atan(x);
  }

  constexpr long double atan2(long double y, long double x) const noexcept {
    return std::atan2(y, x);
  }

  constexpr long double atanh(long double x) const noexcept {
    return std::atanh(x);
  }

  constexpr long double cbrt(long double x) const noexcept {
    return std::cbrt(x);
  }

  constexpr std::size_t clz32(unsigned long long x) const noexcept {
    return std::countl_zero(x);
  }

  constexpr long double cosh(long double x) const noexcept {
    return std::cosh(x);
  }

  constexpr long double expm1(long double x) const noexcept {
    return std::expm1(x);
  }

  long double fround(long double x) const noexcept {
      if (not std::isfinite(x)) {
          return std::numeric_limits<long double>::quiet_NaN();
      }
      return std::nearbyintf(x);
  }

  constexpr long double hypot(long double x, long double y) const noexcept {
    return std::hypot(x, y);
  }
  constexpr long long imul(long long x, long long y) const noexcept {
    return x * y;
  }

  constexpr long double log10(long double x) const noexcept {
    return std::log10(x);
  }

  constexpr long double log1p(long double x) const noexcept {
    return std::log1p(x);
  }

  constexpr long double log2(long double x) const noexcept {
    return std::log2(x);
  }

  long double random() const noexcept {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    static std::uniform_real_distribution<long double> dis(0.0, 1.0);
    return dis(gen);
  }

  constexpr int sign(long double x) const noexcept {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }

  constexpr long double sinh(long double x) const noexcept {
    return std::sinh(x);
  }
};

inline const math_t Math{};
