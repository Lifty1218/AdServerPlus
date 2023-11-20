const WebAnalytics = require("../models/webAnalytics");
const mongoose = require("mongoose");
const DeviceDetector = require("device-detector-js");
const multer = require("multer");
const geoip = require("geoip-lite");
const countriesAndTimezones = require("countries-and-timezones");

const upload = multer();

// GET ALL WEB_ANALYTICS
const GetWebAnalytics = async (req, res) => {
  console.log("Get all webAnalytics");
  try {
    const webAnalytics = await WebAnalytics.find();
    return res.status(200).send(webAnalytics);
  } catch (err) {
    return res.send(err);
  }
};

// GET SINGLE WEB_ANALYTICS
const GetWebAnalyticsByID = async (req, res) => {
  console.log("Get a single webAnalytics");
  try {
    const webAnalytics = await WebAnalytics.findById(req.params.id);
    return res.status(200).send(webAnalytics);
  } catch (err) {
    return res.send(err);
  }
};

// CREATE NEW WEB_ANALYTICS
const CreateWebAnalytics = async (req, res) => {
  console.log("Create a webAnalytics");
  const webAnalytics = new WebAnalytics(req.body);
  try {
    await webAnalytics.save();
    return res.status(200).json(webAnalytics);
  } catch (err) {
    return res.send(err);
  }
};

// UPDATE WEB_ANALYTICS
const UpdateWebAnalytics = async (req, res) => {
  console.log("Update a webAnalytics");
  try {
    const webAnalytics = await WebAnalytics.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json(webAnalytics);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// DELETE WEB_ANALYTICS
const DeleteWebAnalytics = async (req, res) => {
  console.log("Delete a webAnalytics");

  try {
    const webAnalytics = await WebAnalytics.findByIdAndDelete(req.params.id);
    return res.status(200).json(webAnalytics);
  } catch (err) {
    return res.send(err);
  }
};

// Convert the form data into readable format and store it into req.body
const getFormData = upload.none();

// Convert the data into storable format and create a new webAnalytics
const createNewWebAnalytics = async (req, res) => {
  console.log("Data Store in Mongo");
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.parse(req.body.userAgent);
  const location = req.body.location ? JSON.parse(req.body.location) : null;
  const analytics = new WebAnalytics({
    domain: req.body.domain,
    timestamp: req.body.timestamp,
    page: req.body.page,
    referrer: req.body.referrer,
    location: location,
    os: device.os.name + (device.os.version ? " " + device.os.version : ""),
    device: device.device.type,
    browser: device.client.name,
    sessionDuration: req.body.sessionDuration,
  });
  try {
    await analytics.save();
    return res.status(200).send({ message: "Successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "MongoDB storage Unsuccessful" });
  }
};

// Calculate average user traffic per day for a specific domain
const calculateAverageTrafficPerDay = async (req, res) => {
  try {
    const { domainId } = req.params;
    const convertedDomainId = mongoose.Types.ObjectId(domainId);
    const result = await WebAnalytics.aggregate([
      {
        $match: { domain: convertedDomainId },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          earliestTimestamp: { $min: "$timestamp" },
          latestTimestamp: { $max: "$timestamp" },
        },
      },
      {
        $project: {
          _id: 0,
          averageTraffic: {
            $cond: [
              { $gt: ["$count", 0] },
              {
                $divide: [
                  "$count",
                  {
                    $divide: [
                      { $subtract: [new Date(), "$earliestTimestamp"] },
                      86400000, // Number of milliseconds in a day
                    ],
                  },
                ],
              },
              0, // Default value when count is 0
            ],
          },
        },
      },
    ]);
    if (result.length == 0) {
      return res.json([
        {
          averageTraffic: 0,
        },
      ]);
    } else {
      return res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
};

// Calculate percentage of users by country for a specific domain
const calculateUsersByCountry = async (req, res) => {
  try {
    const { domainId } = req.params;
    const convertedDomainId = mongoose.Types.ObjectId(domainId);

    const result = await WebAnalytics.aggregate([
      {
        $match: { domain: convertedDomainId },
      },
      {
        $group: {
          _id: "$location.country",
          count: { $sum: 1 },
        },
      },
      {
        $facet: {
          totalCount: [
            {
              $group: {
                _id: null,
                total: { $sum: "$count" },
              },
            },
          ],
          countries: [
            {
              $project: {
                _id: 0,
                country: "$_id",
                count: "$count",
              },
            },
          ],
        },
      },
      {
        $unwind: "$countries",
      },
      {
        $project: {
          country: "$countries.country",
          percentage: {
            $multiply: [
              {
                $divide: [
                  "$countries.count",
                  { $arrayElemAt: ["$totalCount.total", 0] },
                ],
              },
              100,
            ],
          },
        },
      },
    ]);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
};

// Calculate average user traffic by hour for a specific domain
const calculateAverageTrafficByHour = async (req, res) => {
  try {
    const { domainId } = req.params;
    const convertedDomainId = mongoose.Types.ObjectId(domainId);

    const result = await WebAnalytics.aggregate([
      {
        $match: { domain: convertedDomainId },
      },
      {
        $group: {
          _id: {
            hour: { $hour: "$timestamp" },
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.hour",
          averageTraffic: { $avg: "$count" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          hour: "$_id",
          averageTraffic: "$averageTraffic",
        },
      },
    ]);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
};

// Calculate percentage of users by device for a specific domain
const calculateUsersByDevice = async (req, res) => {
  try {
    const { domainId } = req.params;
    const convertedDomainId = mongoose.Types.ObjectId(domainId);

    const result = await WebAnalytics.aggregate([
      {
        $match: { domain: convertedDomainId },
      },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: "$count" },
          devices: { $push: { device: "$_id", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          devices: {
            $map: {
              input: "$devices",
              as: "device",
              in: {
                device: "$$device.device",
                percentage: {
                  $multiply: [
                    { $divide: ["$$device.count", "$totalCount"] },
                    100,
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    if (result.length == 0) {
      return res.json([]);
    } else {
      return res.json(result[0].devices);
    }
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
};

// Calculate percentage of users by browsers for a specific domain
const calculateUsersByBrowser = async (req, res) => {
  try {
    const { domainId } = req.params;
    const convertedDomainId = mongoose.Types.ObjectId(domainId);

    const result = await WebAnalytics.aggregate([
      {
        $match: { domain: convertedDomainId },
      },
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: "$count" },
          browsers: { $push: { browser: "$_id", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          browsers: {
            $map: {
              input: "$browsers",
              as: "browser",
              in: {
                browser: "$$browser.browser",
                percentage: {
                  $multiply: [
                    { $divide: ["$$browser.count", "$totalCount"] },
                    100,
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    res.json(result[0].browsers);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

// Calculate average user traffic for the last seven days
const getUserTrafficFor7Days = async (req, res) => {
  try {
    const { domainId } = req.params;
    const convertedDomainId = mongoose.Types.ObjectId(domainId);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const userCounts = await WebAnalytics.aggregate([
      {
        $match: {
          domain: convertedDomainId,
          timestamp: { $gt: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          userCount: { $sum: 1 },
        },
      },
    ]);

    const dateSet = new Set(userCounts.map((count) => count._id));
    const missingDates = [];
    const currentDate = new Date(endDate);
    currentDate.setDate(currentDate.getDate() - 6);
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      if (!dateSet.has(formattedDate)) {
        missingDates.push({ _id: formattedDate, userCount: 0 });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const result = [...userCounts, ...missingDates]; // Append missingDates after userCounts

    result.sort((a, b) => {
      if (a._id < b._id) return -1;
      if (a._id > b._id) return 1;
      return 0;
    });
    const allUserCountsZero = result.every((item) => item.userCount === 0);

    if (allUserCountsZero) {
      return res.json([]);
    }
    return res.json(result);
  } catch (error) {
    console.error("Error retrieving user counts:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

// calculate average session duration of a user on a website
const getAverageSessionDuration = async (req, res) => {
  try {
    const domainId = req.params.domainId;

    // Use the aggregation framework to group data by domain and calculate the average session duration
    const result = await WebAnalytics.aggregate([
      { $match: { domain: mongoose.Types.ObjectId(domainId) } },
      {
        $group: {
          _id: "$domain",
          averageSessionDuration: { $avg: "$sessionDuration" },
        },
      },
    ]);

    if (result.length > 0) {
      // Convert average session duration from milliseconds to minutes
      const averageSessionDurationMinutes =
        result[0].averageSessionDuration / 60000;
      return res.json({ averageSessionDurationMinutes });
    } else {
      return res.json({
        averageSessionDurationMinutes: 0,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Calculate users percentage for each domain for a specific country
const calculateUsersBySpecificCountry = async (req, res) => {
  const { country } = req.params;

  try {
    const result = await WebAnalytics.aggregate([
      {
        $match: { "location.country": country },
      },
      {
        $group: {
          _id: "$domain",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "domains",
          localField: "_id",
          foreignField: "_id",
          as: "domain",
        },
      },
      {
        $unwind: "$domain",
      },
      {
        $lookup: {
          from: "webanalytics",
          localField: "domain._id",
          foreignField: "domain",
          as: "webAnalytics",
        },
      },
      {
        $project: {
          _id: 0,
          domainId: "$domain._id",
          domain: "$domain.name",
          webAnalyticsCount: { $size: "$webAnalytics" },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$webAnalytics" }, 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$count", { $size: "$webAnalytics" }] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    return res.status(200).send(result);
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(400).send(error);
  }
};

const getLocation = async (req, res) => {
  const clientIp = req.clientIp;
  const ip = clientIp.replace("::ffff:", "");
  // const ip = req.ip;
  console.log("Ip Address: ", ip);

  const geo = geoip.lookup(ip);

  const countryName = countriesAndTimezones.getCountry(geo.country)?.name;
  const regionName = countriesAndTimezones.getTimezone(
    geo.country,
    geo.region
  )?.region;

  console.log(geo.country);
  if (geo) {
    const location = {
      country: geo.country != "US" ? countryName || geo.country : "USA",
      region: regionName || geo.region,
      city: geo.city,
      latitude: geo.ll[0],
      longitude: geo.ll[1],
    };
    console.log(location);
    res.json({ location });
  } else {
    res.status(500).json({ error: "Failed to retrieve user's location" });
  }
};

exports.GetWebAnalytics = GetWebAnalytics;
exports.GetWebAnalyticsByID = GetWebAnalyticsByID;
exports.CreateWebAnalytics = CreateWebAnalytics;
exports.UpdateWebAnalytics = UpdateWebAnalytics;
exports.DeleteWebAnalytics = DeleteWebAnalytics;

exports.getFormData = getFormData;
exports.createNewWebAnalytics = createNewWebAnalytics;
exports.calculateAverageTrafficPerDay = calculateAverageTrafficPerDay;
exports.calculateAverageTrafficByHour = calculateAverageTrafficByHour;
exports.getUserTrafficFor7Days = getUserTrafficFor7Days;
exports.calculateUsersByCountry = calculateUsersByCountry;
exports.calculateUsersByDevice = calculateUsersByDevice;
exports.calculateUsersByBrowser = calculateUsersByBrowser;
exports.getAverageSessionDuration = getAverageSessionDuration;
exports.getLocation = getLocation;

exports.calculateUsersBySpecificCountry = calculateUsersBySpecificCountry;
