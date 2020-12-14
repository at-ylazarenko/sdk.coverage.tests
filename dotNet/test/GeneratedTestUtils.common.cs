﻿using Applitools.Utils.Geometry;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using Applitools.Tests.Utils;

namespace Applitools.Generated.Utils
{
    internal partial class GeneratedTestUtils
    {
        public static void compareProcedure(Region actualRegion, Region expectedRegion, string type=null)
        {
            Region[] actualRegions = new Region[] { actualRegion };
            HashSet<Region> expectedRegions = new HashSet<Region> { expectedRegion };
            TestUtils.CompareSimpleRegionsList_(actualRegions, expectedRegions, "Region");
        }

        public static void compareProcedure(Dictionary<string, object> actualRegion, RectangleSize expectedRegion, string type)
        {
            RectangleSize actual = new RectangleSize((int)(long)actualRegion["width"], (int)(long)actualRegion["height"]);
            Assert.IsTrue(RectangleSize.AreEqual(expectedRegion, actual), "Actual region with Width="+ actual.Width.ToString()+" Height="+ actual.Height.ToString()+ " don't equal to expected region with Width = "+ expectedRegion.Width.ToString()+" Height = "+ expectedRegion.Height.ToString());
        }

        public static void compareProcedure(int actual, object expected, string type = null)
        {
            Assert.AreEqual((int)expected, actual);
        }

        public static void compareProcedure(FloatingMatchSettings actualRegion, FloatingMatchSettings expectedRegion, string type= "Floating")
        {
            FloatingMatchSettings[] actualRegions = new FloatingMatchSettings[] { actualRegion };
            HashSet<FloatingMatchSettings> expectedRegions = new HashSet<FloatingMatchSettings> { expectedRegion };
            HashSet<FloatingMatchSettings> expectedRegionsClone = new HashSet<FloatingMatchSettings>(expectedRegions);
            if (expectedRegions.Count > 0)
            {
                foreach (FloatingMatchSettings region in actualRegions)
                {
                    if (!expectedRegionsClone.Remove(region))
                    {
                        Assert.Fail("actual {0} region {1} not found in expected regions list", type, region);
                    }
                }
                Assert.IsEmpty(expectedRegionsClone, "not all expected regions found in actual regions list.", type);
            }
        }

        public static void compareProcedure(AccessibilityRegionByRectangle actualRegion, AccessibilityRegionByRectangle expectedRegion, string type="")
        {
            AccessibilityRegionByRectangle[] actualRegions = new AccessibilityRegionByRectangle[] { actualRegion };
            HashSet<AccessibilityRegionByRectangle> expectedRegions = new HashSet<AccessibilityRegionByRectangle> { expectedRegion };
            HashSet<AccessibilityRegionByRectangle> expectedRegionsClone = new HashSet<AccessibilityRegionByRectangle>(expectedRegions);
            if (expectedRegions.Count > 0)
            {
                foreach (AccessibilityRegionByRectangle region in actualRegions)
                {
                    if (!expectedRegionsClone.Remove(region))
                    {
                        Assert.Fail("actual {0} region {1} not found in expected regions list", type, region);
                    }
                }
                Assert.IsEmpty(expectedRegionsClone, "not all expected regions found in actual regions list.", type);
            }
        }

        public static void compareProcedure(AccessibilityLevel actualLevel, AccessibilityLevel expectedLevel, string type=null)
        {
            Assert.IsTrue(actualLevel == expectedLevel, "Actual Level '"+actualLevel.ToString()+"' don't equal to Expected Level '" + expectedLevel.ToString() + "'");
        }

        public static void compareProcedure(AccessibilityGuidelinesVersion actualVersion, AccessibilityGuidelinesVersion expectedVersion, string type = null)
        {
            Assert.IsTrue(actualVersion == expectedVersion, "Actual Version '" + actualVersion.ToString() + "' don't equal to Expected Version '" + expectedVersion.ToString() + "'");
        }

        public static void compareProcedure(Boolean actual, Boolean expected, string type = null)
        {
            Assert.AreEqual(expected, actual);
        }
    }
}