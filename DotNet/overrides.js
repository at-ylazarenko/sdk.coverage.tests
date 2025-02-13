module.exports = {
	// api
	'should throw if no checkpoints before close' : { skip: true }, // where did this requirement come from?
	// window
	//'check window with layout breakpoints in config': { skip: true }, // layout breakpoints are not implemented
	//'check window with layout breakpoints': { skip: true }, // layout breakpoints are not implemented
	'check window fully with fixed scroll root element': { config: {branchName: 'current1'}  },   //diffs if compare to common baseline
	'check window on page with sticky header with vg': { skip: true },   //diff
	'should set viewport size': { skip: true },   //Actual region with Width=800 Height=600 don't equal to expected region with Width = 600 Height = 600
	'should set viewport size on edge legacy': { skip: true },   //Actual region with Width=1024 Height=695 don't equal to expected region with Width = 600 Height = 600
	'should return actual viewport size': { skip: true },   //Chrome failed to start: exited abnormally
	//region
	'check regions by coordinates in frame with css stitching': { skip: true }, //Unable to locate element: {"method":"css selector","selector":"#modal2"}
	'check regions by coordinates in frame with scroll stitching': { skip: true }, //Unable to locate element: {"method":"css selector","selector":"#modal2"}
	'check regions by coordinates in overflowed frame with css stitching': { skip: true }, //Unable to locate element: {"method":"css selector","selector":"#modal3"}
	'check regions by coordinates in overflowed frame with scroll stitching': { skip: true }, //Unable to locate element: {"method":"css selector","selector":"#modal3"}
	'should find regions by visual locator': { skip: true }, //VisualLocators are not implemented in DotNet SDK
	'should find regions by visual locator with vg': { skip: true }, //VisualLocators are not implemented in DotNet SDK
	'check window after manual scroll with vg': { skip: true },   //diff
	'check window after manual scroll on safari 12': { skip: true },   //diff
	'should send accessibility regions by selector with css stitching': { skip: true },   //actual region AccessibilityRegionByRectangle (10, 286) 285x165 - LargeText not found in expected regions list. - It's other regions in original specific test TestAccessibilityRegions for CSS and Scroll
	'should send accessibility regions by selector with scroll stitching': { skip: true },   //actual region AccessibilityRegionByRectangle (10, 286) 285x165 - LargeText not found in expected regions list. - It's other regions in original specific test TestAccessibilityRegions for CSS and Scroll
	'should send ignore regions by selector with css stitching': { skip: true },   //actual Region region (10, 286) 285x165 not found in expected regions list.   It's other regions in original specific test TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent for CSS and Scroll
	'should send ignore regions by selector with scroll stitching': { skip: true },   //actual Region region (10, 286) 285x165 not found in expected regions list.   It's other regions in original specific test TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent for CSS and Scroll
	'should send ignore region by the same selector as target region with vg': { skip: true }, //actual Region region (0, 0) 304x184 not found in expected regions list
	//frame
	'check frame fully with css stitching': { config: {branchName: 'current_ruby'} },   //diffs if compare to common baseline
	'check frame fully with vg': { skip: true },   //diff
	'check region by selector in overflowed frame fully with css stitching': { skip: true },   //diff
	'check region by selector in overflowed frame fully with scroll stitching': { skip: true },   //diff
	//unknown issue
	'check window after manual scroll on safari 11': { skip: true },   //NoSuchWindowException : A request to use a window could not be satisfied because the window could not be found
	'should extract text from regions': { skipEmit: true },   //test not implemented yet. It exists for JS only now
	'should extract text regions from image': {skipEmit: true},   // Not implemented yet
	'should extract text from regions without a hint': { skipEmit: true }, // skipping since the other OCR tests are skipped
	// can be quick fixed
	'check region by native selector': { skip: true }, //To fit in existing baseline for C# should have test name "Appium_Android_CheckRegion"
	'check frame in frame fully with vg': { skip: true },  //baseline NEW. Need compare with JS tests, maybe add baseline.
	// check many
	'acme login with css stitching': { skip: true }, // original test tested fluent API's check many. This test doesn't.
	'acme login with scroll stitching': { skip: true }, // original test tested fluent API's check many. This test doesn't.
	'acme login with vg': { skip: true }, // original test tested fluent API's check many. This test doesn't.
	// location
	// 'should send dom and location when check window': { skipEmit: true },
	'should send dom and location when check window with vg': { skipEmit: true },
	// 'should send dom and location when check window fully': { skipEmit: true },
	// 'should send dom and location when check window fully with vg': { skipEmit: true },
	// 'should send dom and location when check frame': { skipEmit: true },
	// 'should send dom and location when check frame with vg': { skipEmit: true },
	// 'should send dom and location when check frame fully': { skipEmit: true },
	// 'should send dom and location when check frame fully with vg': { skipEmit: true },
	// 'should send dom and location when check region by selector': { skipEmit: true },
	// 'should send dom and location when check region by selector with vg': { skipEmit: true },
	// 'should send dom and location when check region by selector fully': { skipEmit: true },
	// 'should send dom and location when check region by selector fully with vg': { skipEmit: true },
	//'should send dom and location when check region by selector in frame': { skipEmit: true },
	// 'should send dom and location when check region by selector with custom scroll root': { skipEmit: true },
	// 'should send dom and location when check region by selector with custom scroll root with vg': { skipEmit: true },
  'should send dom and location when check region by selector fully with custom scroll root': { skipEmit: true }, // test is wrong!
	'should send dom and location when check region by selector fully with custom scroll root with vg': { skipEmit: true }, // test is wrong!
	// 'should send dom of version 11': { skipEmit: true },
	'should not fail if scroll root is stale on android': {skipEmit: true},
	'check region by selector in frame fully on firefox legacy': { skipEmit: true },
	'should send custom batch properties': {skipEmit: true},
	'adopted styleSheets on chrome': {skipEmit: true},
	'adopted styleSheets on firefox': {skipEmit: true},
	'check region by selector within shadow dom with vg': {skipEmit: true},
	'check region by element within shadow dom with vg': {skipEmit: true},
	'pageCoverage data is correct': {skipEmit: true},
  'pageCoverage data is correct with vg': {skipEmit: true},
  'appium iOS check fully window with scroll and pageCoverage': {skipEmit: true},
  'appium iOS check window region with scroll and pageCoverage': {skipEmit: true},
	'should abort after close': {skipEmit: true},
	'should abort unclosed tests': {skipEmit: true},
  'should abort unclosed tests with vg': {skipEmit: true},
  'should return aborted tests in getAllTestResults': {skipEmit: true},
  'should return aborted tests in getAllTestResults with vg': {skipEmit: true},
  'should return browserInfo in getAllTestResults': {skipEmit: true},
  'should waitBeforeCapture in open': {skipEmit: true},
  'should waitBeforeCapture in check': {skipEmit: true},
	'should waitBeforeCapture with breakpoints in check': {skipEmit: true},
	'should waitBeforeCapture with breakpoints in open': {skipEmit: true},
	'should be empty if page delayed by 1500': {skipEmit: true},

	// TODO verify and enable
  'should send agentRunId': {skipEmit: true},
  "appium iOS nav bar check regio": {skipEmit: true},
  "appium android landscape mode check window": {skip: true},
  "appium android landscape mode check region": {skip: true},
  "should work with beforeCaptureScreenshot hook": {skip: true}
}
