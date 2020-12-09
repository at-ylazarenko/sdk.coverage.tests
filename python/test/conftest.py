import os
import pytest
import time

from selenium import webdriver
from applitools.selenium import Eyes, Target, BatchInfo, ClassicRunner, StitchMode
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager


@pytest.fixture(scope="session")
def batch_info():
    return BatchInfo("Python Generated tests")


def pytest_generate_tests(metafunc):
    import uuid
    # setup environment variables once per test run if not settled up
    # needed for multi thread run
#     os.environ["APPLITOOLS_BATCH_ID"] = os.getenv(
#         "APPLITOOLS_BATCH_ID", str(uuid.uuid4())
#     )


@pytest.fixture(scope="function")
def eyes_runner_class():
    return None


@pytest.fixture(scope="function")
def options():
    return webdriver.ChromeOptions()


@pytest.fixture(scope="function")
def browser_type():
    return "Chrome"


@pytest.fixture(scope="function")
def legacy():
    return False


@pytest.fixture(name="driver", scope="function")
def driver_setup(options, browser_type):
    #options = webdriver.ChromeOptions()
    counter = 0
    sauce_url = (
            "https://{username}:{password}@ondemand.saucelabs.com:443/wd/hub".format(
                username=os.getenv("SAUCE_USERNAME", None),
                password=os.getenv("SAUCE_ACCESS_KEY", None),
            )
        )
    while counter < 5:
        try:
            print("----------------")
            print("browser_type=", browser_type)
            if browser_type == "Chrome":
                options.add_argument("--headless")
                driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), options=options,)
                break
            if browser_type == "Firefox":
                options.add_argument("--headless")
                driver = webdriver.Firefox(executable_path=GeckoDriverManager().install(), options=options,)
                break
            if browser_type == "IE11":
                capabilities = {
                    'browserName': 'internet explorer',
                    'browserVersion': '11.285',
                    'platformName': 'Windows 10',
                    }
                driver = webdriver.Remote(command_executor=sauce_url, desired_capabilities=capabilities)
                break
            if browser_type == "Edge":
                capabilities = {
                    'browserName': 'MicrosoftEdge',
                    'browserVersion': '18.17763',
                    'platformName': 'Windows 10',
                    'screenResolution': '1920x1080',
                    }
                driver = webdriver.Remote(command_executor=sauce_url, desired_capabilities=capabilities)
                break
            if browser_type == "Safari11":
                if (legacy):
                  capabilities = {}
                  capabilities['browserName'] = "safari"
                  capabilities['platform'] = "macOS 10.12"
                  capabilities['version'] = "11.0"
                else:
                  capabilities = {
                    'browserName': 'safari',
                    'browserVersion': '11.0',
                    'platformName': 'macOS 10.12',
                  }
                driver = webdriver.Remote(command_executor=sauce_url, desired_capabilities=capabilities)
                break
            if browser_type == "Safari12":
                if (legacy):
                  capabilities = {}
                  capabilities['browserName'] = "safari"
                  capabilities['platform'] = "macOS 10.13"
                  capabilities['version'] = "12.1"
                else:
                  capabilities = {
                    'browserName': 'safari',
                    'browserVersion': '12.1',
                    'platformName': 'macOS 10.13',
                  }
                driver = webdriver.Remote(command_executor=sauce_url, desired_capabilities=capabilities)
                break
            if browser_type == "ChromeEmulator":
                mobile_emulation = {
                        "deviceMetrics": { "width": 384, "height": 512, "pixelRatio": 2.0 },
                        "userAgent": "Mozilla/5.0 (Linux; Android 8.0.0; Android SDK built for x86_64 Build/OSR1.180418.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36" 
                      }
                options.add_experimental_option("mobileEmulation", mobile_emulation)
                options.add_argument("--headless")
                driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), options=options,)
                break
            if browser_type != "Chrome" and browser_type != "Firefox" and browser_type != "IE11" and browser_type != "Edge" and browser_type != "Safari11" and browser_type != "Safari12": raise ValueError           
        except Exception as e:
            if isinstance(e,ValueError): raise ValueError ("Wrong browser type " + browser_type)
            print("Tried to start browser. It was exception {}".format(e))
            time.sleep(1.0)
    yield driver
    # Close the browser.
    driver.quit()


@pytest.fixture(name="runner", scope="function")
def runner_setup(eyes_runner_class):
    runner = eyes_runner_class
    yield runner
#     all_test_results = runner.get_all_test_results()
#     print(all_test_results)

@pytest.fixture(scope="function")
def stitch_mode():
    return StitchMode.Scroll

@pytest.fixture(scope="function")
def emulation():
    is_emulation = False
    orientation = ""
    page = ""
    return is_emulation, orientation, page


@pytest.fixture(name="eyes", scope="function")
def eyes_setup(runner, batch_info, stitch_mode, emulation):
    """
    Basic Eyes setup. It'll abort test if wasn't closed properly.
    """
    eyes = Eyes(runner)
    # Initialize the eyes SDK and set your private API key.
    eyes.api_key = os.environ["APPLITOOLS_API_KEY"]
    eyes.configure.batch = batch_info
    eyes.configure.branch_name = "master"
    eyes.configure.parent_branch_name = "master"
    eyes.configure.set_stitch_mode(stitch_mode)
    eyes.configure.set_save_new_tests(False)
    eyes.configure.set_hide_caret(True)
    eyes.configure.set_hide_scrollbars(True)
    eyes.add_property(
        "ForceFPS", "true" if eyes.force_full_page_screenshot else "false"
    )
    is_emulation, orientation, page = emulation
    if is_emulation:
        eyes.add_property("Orientation", orientation)
        eyes.add_property("Page", page)
    yield eyes
    # If the test was aborted before eyes.close was called, ends the test as aborted.
    eyes.abort_if_not_closed()
