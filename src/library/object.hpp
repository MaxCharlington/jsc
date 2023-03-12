#include <string>
#include <any>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <stdexcept>

class Object {
    std::unordered_map<std::string, std::any> obj;

public:
    template<typename T>
    void set(const std::string& key, T value) {
        obj[key] = value;
    }

    template<typename T>
    T get(const std::string& key) const {
        auto it = obj.find(key);
        if (it != obj.end()) {
            return std::any_cast<T>(it->second);
        }
        throw std::out_of_range("Key not found");
    }

    template<typename T>
    T get(const std::string& key, T default_value) const {
        auto it = obj.find(key);
        if (it != obj.end()) {
            return std::any_cast<T>(it->second);
        }
        return default_value;
    }

    std::vector<std::string> keys() const {
        std::vector<std::string> result;
        result.reserve(obj.size());
        std::transform(obj.begin(), obj.end(), std::back_inserter(result), [](const auto& pair) {
            return pair.first;
        });
        return result;
    }

    static Object create(const std::vector<std::pair<std::string, std::any>>& properties) {
        Object obj;
        obj.obj.reserve(properties.size());
        for (const auto& pair : properties) {
            obj.obj.emplace(pair.first, pair.second);
        }
        return obj;
    }
};
