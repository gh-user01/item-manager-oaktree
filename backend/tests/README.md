# Backend Tests ✅

Simple and effective test suite for the Flask API backend.

## Setup

Install pytest:
```bash
pip install pytest
```

## Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test
pytest tests/test_basic.py::test_user_registration
```

## Test Results

✅ **All 10 tests passing!**

## Test Coverage

The tests comprehensively cover:

- ✅ App startup and health check
- ✅ User registration and login
- ✅ Authentication requirements  
- ✅ Item CRUD operations (Create, Read, Update, Delete)
- ✅ Error handling for invalid data
- ✅ Authorization checks

## Test Structure

- `test_basic.py` - Main test file with 10 essential functionality tests
- `conftest.py` - Test configuration and fixtures

Each test uses an isolated temporary database to ensure clean test runs.

## Sample Test Run

```
============================================================= test session starts ==============================================================
tests/test_basic.py::test_app_runs PASSED                     [ 10%]
tests/test_basic.py::test_user_registration PASSED            [ 20%]
tests/test_basic.py::test_user_login PASSED                   [ 30%]
tests/test_basic.py::test_get_items_requires_auth PASSED      [ 40%]
tests/test_basic.py::test_create_item_success PASSED          [ 50%]
tests/test_basic.py::test_get_items_with_auth PASSED          [ 60%]
tests/test_basic.py::test_update_item PASSED                  [ 70%]
tests/test_basic.py::test_delete_item PASSED                  [ 80%]
tests/test_basic.py::test_invalid_login PASSED                [ 90%]
tests/test_basic.py::test_invalid_item_data PASSED            [100%]

========================================================== 10 passed in 2.35s ==========================================================
```

Perfect for assessment demonstrations! 🚀
