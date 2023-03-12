#include <vector>
#include <stdexcept>

template <typename T>
class Array {
public:
    // Constructor
    Array() {}

    // Destructor
    ~Array() {}

    // Get the length of the array
    size_t length() const {
        return data_.size();
    }

    // Get the element at the specified index
    T& at(size_t index) {
        if (index >= data_.size()) {
            throw std::out_of_range("Index out of range");
        }
        return data_[index];
    }

    // Get the element at the specified index
    T& operator[](size_t index) {
        return at(index);
    }

    // Add one or more elements to the end of the array
    size_t push(const T& element) {
        data_.push_back(element);
        return data_.size();
    }

    // Remove the last element from the array and return it
    T pop() {
        if (data_.empty()) {
            throw std::out_of_range("Array is empty");
        }
        T element = data_.back();
        data_.pop_back();
        return element;
    }

    // Call a provided function on each element of the array
    void forEach(void (*callback)(T& element)) {
        for (T& element : data_) {
            callback(element);
        }
    }

    // Create a new array with all elements that pass the test implemented by the provided function
    Array filter(bool (*callback)(T& element)) {
        Array<T> result;
        for (T& element : data_) {
            if (callback(element)) {
                result.push(element);
            }
        }
        return result;
    }

    // Create a new array with the results of calling a provided function on every element in the array
    Array map(T (*callback)(T& element)) {
        Array<T> result;
        for (T& element : data_) {
            result.push(callback(element));
        }
        return result;
    }

    // Apply a function against an accumulator and each element in the array (from left to right) to reduce it to a single value
    T reduce(T (*callback)(T& accumulator, T& element), T initialValue) {
        T accumulator = initialValue;
        for (T& element : data_) {
            accumulator = callback(accumulator, element);
        }
        return accumulator;
    }

private:
    std::vector<T> data_;
};
