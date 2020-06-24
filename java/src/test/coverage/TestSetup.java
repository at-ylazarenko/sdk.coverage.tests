package test.coverage;

import com.applitools.eyes.BatchInfo;
import com.applitools.eyes.EyesRunner;
import com.applitools.eyes.selenium.ClassicRunner;
import com.applitools.eyes.selenium.Eyes;
import com.applitools.eyes.selenium.StitchMode;
import com.applitools.eyes.visualgrid.services.VisualGridRunner;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.BeforeSuite;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

public class TestSetup {

    protected Eyes eyes;
    protected RemoteWebDriver driver;
    protected EyesRunner runner;

    private static BatchInfo batch;

    @BeforeSuite
    public void globalSetup() {
        String name = System.getenv("APPLITOOLS_BATCH_NAME");
        if (name == null) name = "JAVA coverage tests";
        batch = new BatchInfo(name);
        String id = System.getenv("APPLITOOLS_BATCH_ID");
        if (id != null) batch.setId(id);
    }

    public void initEyes(boolean isVisualGrid, boolean isCssStitching, String branchName) {
        runner = isVisualGrid ? new VisualGridRunner(10) : new ClassicRunner();
        eyes = new Eyes(runner);
        eyes.setStitchMode(isCssStitching ? StitchMode.CSS : StitchMode.SCROLL);
        eyes.setMatchTimeout(0);
        eyes.setApiKey(System.getenv("APPLITOOLS_API_KEY"));
        eyes.setBranchName(branchName);
        eyes.setParentBranchName("master");
        eyes.setBatch(batch);
        eyes.setSaveNewTests(false);
        eyes.setForceFullPageScreenshot(false);
    }

    public void buildDriver(DesiredCapabilities capabilities) {
        String serverUrl = "http://localhost:4444/wd/hub";
        try {
            driver = new RemoteWebDriver(new URL(serverUrl), capabilities);
        } catch (MalformedURLException ignored) {

        }
        driver.manage().timeouts().implicitlyWait(3, TimeUnit.SECONDS);
    }

    public void buildDriver(){
        buildDriver(DesiredCapabilities.chrome());
    }
}
