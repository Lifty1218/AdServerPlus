const Domain = require("../models/domain");
const AdSpace = require("../models/adSpace");
const axios = require("axios");

// GET ALL ADS
const GetDomains = async (req, res) => {
  console.log("Get all domains");
  try {
    const domain = await Domain.find();
    return res.status(200).send(domain);
  } catch (err) {
    return res.send(err);
  }
};

// GET SINGLE AD
const GetDomainByID = async (req, res) => {
  console.log("Get a single domain");
  try {
    const domain = await Domain.findById(req.params.id);
    return res.status(200).send(domain);
  } catch (err) {
    return res.send(err);
  }
};

// CREATE NEW AD
const CreateDomain = async (req, res) => {
  console.log("Create a domain");
  const domain = new Domain(req.body);
  try {
    await domain.save();
    return res.status(200).json(domain);
  } catch (err) {
    return res.send(err);
  }
};

// UPDATE AD
const UpdateDomain = async (req, res) => {
  console.log("Update a domain");

  try {
    const domain = await Domain.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(domain);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// DELETE AD
const DeleteDomain = async (req, res) => {
  console.log("Delete a domain");

  try {
    const domain = await Domain.findByIdAndDelete(req.params.id);
    return res.status(200).json(domain);
  } catch (err) {
    return res.send(err);
  }
};

// Calculate a domain score based on their web analytics
const CalculateDomainScore = async (req, res) => {
  const domainId = req.params.domainId;
  // console.log("Domain Id: ", domainId);

  try {
    // Retrieve data
    const avgTrafficResponse = await axios.get(
      `http://localhost:5000/web_analytics/average_traffic/${domainId}`
    );

    const usersByCountryResponse = await axios.get(
      `http://localhost:5000/web_analytics/users_by_country/${domainId}`
    );

    const usersByDeviceResponse = await axios.get(
      `http://localhost:5000/web_analytics/users_by_device/${domainId}`
    );

    const avgSessionDurationResponse = await axios.get(
      `http://localhost:5000/web_analytics/average_session/${domainId}`
    );

    const avgTraffic = avgTrafficResponse.data[0].averageTraffic;
    const usersByCountry = usersByCountryResponse.data;
    const usersByDevice = usersByDeviceResponse.data;
    const avgSessionDuration =
      avgSessionDurationResponse.data.averageSessionDurationMinutes;

    // console.log("Average Session Duration: ", avgSessionDuration);

    // Assign weights
    const trafficWeight = 0.5;
    const countryWeight = 0.15;
    const deviceWeight = 0.1;
    const sessionWeight = 0.25;

    // Define "best" values
    const maxTraffic = 5000;
    const maxSessionDuration = 30;

    // Country scores
    const countryScores = {
      Luxembourg: 1.0,
      Switzerland: 0.95,
      Norway: 0.9,
      Ireland: 0.85,
      Iceland: 0.8,
      Qatar: 0.75,
      USA: 0.7,
      Singapore: 0.65,
      Denmark: 0.6,
      Australia: 0.55,
      Sweden: 0.5,
      Netherlands: 0.45,
      Austria: 0.4,
      Finland: 0.35,
      Germany: 0.3,
      Canada: 0.25,
      Belgium: 0.2,
      "United Kingdom": 0.15,
      France: 0.1,
      Japan: 0.05,
      "New Zealand": 0.04,
      "United Arab Emirates": 0.03,
      Israel: 0.02,
      "South Korea": 0.01,
      Italy: 0.005,
    };

    // Define minimum country score
    const minCountryScore = 0.001;

    // Device scores (These values are just examples and need to be adjusted)
    const deviceScores = {
      desktop: 1.0,
      smartphone: 0.8,
      tablet: 0.6,
    };

    // Calculate raw scores
    const trafficScore = avgTraffic / maxTraffic;
    const countryScore = usersByCountry.reduce(
      (sum, user) =>
        sum +
        ((countryScores[user.country] || minCountryScore) * user.percentage) /
          100,
      0
    );
    const deviceScore = usersByDevice.reduce(
      (sum, user) =>
        sum + ((deviceScores[user.device] || 0) * user.percentage) / 100,
      0
    );
    const sessionScore =
      avgSessionDuration < maxSessionDuration
        ? avgSessionDuration / maxSessionDuration
        : 1;

    // Apply weights
    const weightedTrafficScore = trafficScore * trafficWeight;
    const weightedCountryScore = countryScore * countryWeight;
    const weightedDeviceScore = deviceScore * deviceWeight;
    const weightedSessionScore = sessionScore * sessionWeight;

    // Calculate total score and normalize to range 0-100
    const totalScore =
      (weightedTrafficScore +
        weightedCountryScore +
        weightedDeviceScore +
        weightedSessionScore) *
      100;

    const totalScoreFixed = totalScore.toFixed(4);

    console.log(domainId, " Total Score:  ", totalScoreFixed);

    await axios.patch(`http://localhost:5000/domain/${domainId}`, {
      score: totalScoreFixed,
    });

    return res.status(200).json(totalScore);
  } catch (error) {
    console.error(error.data || error.message);
    return res.status(500).send(error);
  }
};

const UpdateDomainRankings = async (req, res) => {
  try {
    const domains = await Domain.find();

    const scorePromises = domains.map((domain) => {
      const domainId = domain._id;
      return axios.get(`http://localhost:5000/domain/score/${domainId}`);
    });
    await Promise.all(scorePromises);

    const rankedDomains = await Domain.find().sort({ score: -1 });
    let currentRanking = 1;

    for (const domain of rankedDomains) {
      if (domain.score === 0) {
        domain.ranking = currentRanking;
        currentRanking++;
      } else {
        domain.ranking = currentRanking;
        currentRanking++;
      }
    }
    const updatePromises = rankedDomains.map((domain) => domain.save());
    console.log(updatePromises);
    await Promise.all(updatePromises);

    const adSpaces = await AdSpace.find().populate("domain");

    for (const adSpace of adSpaces) {
      const domainScore = adSpace.domain.score;

      if (domainScore > 90) {
        adSpace.cpc = 0.34;
        adSpace.cpm = 0.5;
      } else if (domainScore > 80) {
        adSpace.cpc = 0.32;
        adSpace.cpm = 0.47;
      } else if (domainScore > 70) {
        adSpace.cpc = 0.3;
        adSpace.cpm = 0.44;
      } else if (domainScore > 60) {
        adSpace.cpc = 0.28;
        adSpace.cpm = 0.41;
      } else if (domainScore > 50) {
        adSpace.cpc = 0.26;
        adSpace.cpm = 0.38;
      } else if (domainScore > 40) {
        adSpace.cpc = 0.24;
        adSpace.cpm = 0.35;
      } else if (domainScore > 30) {
        adSpace.cpc = 0.22;
        adSpace.cpm = 0.32;
      } else if (domainScore > 20) {
        adSpace.cpc = 0.2;
        adSpace.cpm = 0.29;
      } else if (domainScore > 10) {
        adSpace.cpc = 0.18;
        adSpace.cpm = 0.26;
      } else {
        adSpace.cpc = 0.16;
        adSpace.cpm = 0.23;
      }
      // Save the adSpace
      await adSpace.save();
    }
    console.log("Done");

    return res.status(200).json({
      message: "Scores and rankings calculated and stored successfully",
    });
  } catch (error) {
    console.error(error.data || error.message);
    return res.status(500).json({
      error: "An error occurred while calculating and storing domain scores",
    });
  }
};

exports.GetDomains = GetDomains;
exports.GetDomainByID = GetDomainByID;
exports.CreateDomain = CreateDomain;
exports.UpdateDomain = UpdateDomain;
exports.DeleteDomain = DeleteDomain;

exports.CalculateDomainScore = CalculateDomainScore;
exports.UpdateDomainRankings = UpdateDomainRankings;
