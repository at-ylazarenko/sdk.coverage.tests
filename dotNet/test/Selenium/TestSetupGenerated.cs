﻿using Applitools.VisualGrid;
using NUnit.Framework;
using OpenQA.Selenium;
using System;
using OpenQA.Selenium.Chrome;
using Applitools.Selenium;
using Applitools.Tests.Utils;

namespace Applitools.Generated.Selenium.Tests
{
    public abstract class TestSetupGenerated : ReportingTestSuiteGenerrated
    {

        protected IWebDriver driver;
        protected EyesRunner runner;
        protected Eyes eyes;
        protected string testedPageUrl = "https://applitools.github.io/demo/TestPages/FramesTestPage/";
        public static readonly BatchInfo BatchInfo = new BatchInfo("DotNet Generated Tests");
		public static readonly string DRIVER_PATH = Environment.GetEnvironmentVariable("DRIVER_PATH");

        [SetUp]
        public void SetUpSelenium()
        {
            ChromeOptions options = new ChromeOptions();
            options.AddArgument("--headless");
            driver = DRIVER_PATH != null ? new ChromeDriver(DRIVER_PATH, options) : new ChromeDriver(options);
            driver.Navigate().GoToUrl(testedPageUrl);
        }

        protected void initEyes(bool isVisualGrid, bool isCSSMode)
        {
            runner = isVisualGrid ? (EyesRunner)(new VisualGridRunner(10)) : new ClassicRunner();
            eyes = new Eyes(runner);
            eyes.HostOS = "Linux";
            eyes.Batch = BatchInfo;
            if (!isVisualGrid) eyes.StitchMode = isCSSMode ? StitchModes.CSS : StitchModes.Scroll;
            eyes.BranchName = "master";
            eyes.ParentBranchName = "master";
			eyes.SaveNewTests = false;
            //eyes.AddProperty("ForceFPS", eyes.ForceFullPageScreenshot ? "true" : "false");
            //eyes.AddProperty("Agent ID", eyes.FullAgentId);
			//eyes.HideScrollbars = true;
        }

    }
}