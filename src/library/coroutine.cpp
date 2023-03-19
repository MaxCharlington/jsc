#include <iostream>
#include <coroutine>
#include <thread>
#include <vector>

struct Task {
  struct promise_type {
    auto initial_suspend() { return std::suspend_never{}; }
    auto final_suspend() noexcept { return std::suspend_never{}; }
    void unhandled_exception() {}
    std::suspend_always yield_value(int value) { result = value; return {}; }
    auto get_return_object() { return Task{handle_type::from_promise(*this)}; }
    void return_void() {}

    int result;
  };
  using handle_type = std::coroutine_handle<promise_type>;
  handle_type handle;
  int get_result() { return handle.promise().result; }
  bool await_ready() const { return false; }
  void await_suspend(std::coroutine_handle<> h) {
    std::thread([this, h]() mutable {
      handle.resume();
      h.resume();
    }).detach();
  }
  void await_resume() const {}
};

Task foo() {
  co_yield 1;
}

Task bar() {
  co_yield 2;
}

int main() {
  std::vector<Task> tasks;
  tasks.emplace_back(foo());
  tasks.emplace_back(bar());
  for (auto& task : tasks) {
    int res = task.get_result();
    std::cout << res << '\n';
  }
}
