const Ad = require("../models/ad");
const AdSpace = require("../models/adSpace");
const Domain = require("../models/domain");
const axios = require("axios");
const mongoose = require("mongoose");

// GET ALL ADS
const GetAds = async (req, res) => {
  console.log("Get all ads");
  try {
    const ad = await Ad.find();
    return res.status(200).send(ad);
  } catch (err) {
    return res.send(err);
  }
};

// GET SINGLE AD
const GetAdByID = async (req, res) => {
  console.log("Get a single ad");
  try {
    const ad = await Ad.findById(req.params.id);
    return res.status(200).send(ad);
  } catch (err) {
    return res.send(err);
  }
};

// CREATE NEW AD
const CreateAd = async (req, res) => {
  console.log("Create an ad");
  const ad = new Ad(req.body);
  try {
    await ad.save();
    return res.status(200).json(ad);
  } catch (err) {
    return res.send(err);
  }
};

// UPDATE AD
const UpdateAd = async (req, res) => {
  console.log("Update an ad");

  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(ad);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// DELETE AD
const DeleteAd = async (req, res) => {
  console.log("Delete an ad");

  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    return res.status(200).json(ad);
  } catch (err) {
    return res.send(err);
  }
};

// INCREMENT AD IMPRESSIONS
const TrackImpression = async (req, res) => {
  console.log("Track Impressions");

  try {
    await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { impressions: 1 } },
      {
        new: true,
      }
    );
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).send(err);
  }
};

// INCREMENT AD CLICKS
const TrackClick = async (req, res) => {
  console.log("Track Clicks");
  try {
    await Ad.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      {
        new: true,
      }
    );
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).send(err);
  }
};

// FIND SUITABLE AD SPACE (PUBLISHER) FOR AD
const FindSuitableAdSpaces = async (req, res) => {
  try {
    let foundAdSpace = false;
    const maxAdSpaces = 2;
    const adId = mongoose.Types.ObjectId(req.params.id);

    const ad = await Ad.findById(adId);
    if (ad.pricePlan.success) {
      if (ad.adSpace.length < maxAdSpaces) {
        const domains = await Domain.find({
          category: ad.targetCategory,
          adSpaces: { $exists: true, $not: { $size: 0 } },
        }).populate("adSpaces");

        if (domains.length > 0) {
          console.log("Domains and AdSpaces Found");
          const response = await axios.get(
            `http://localhost:5000/web_analytics/users_by_single_country/${ad.targetLocation}`
          );
          const domainsWithCountries = response.data;
          console.log(domains);

          domainsWithCountries.sort((a, b) => b.percentage - a.percentage);
          domains.sort((a, b) => {
            const indexA = domainsWithCountries.findIndex(
              (item) => item.domainId.toString() === a._id.toString()
            );
            const indexB = domainsWithCountries.findIndex(
              (item) => item.domainId.toString() === b._id.toString()
            );
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            if (indexA !== -1) {
              return -1;
            }
            if (indexB !== -1) {
              return 1;
            }
            return 0;
          });

          const adSpaces = domains
            .flatMap((domain) => domain.adSpaces)
            .filter((adSpace) => adSpace !== null);
          let counter = ad.adSpace.length;
          adSpaces.forEach((adSpace) => {
            if (
              counter < maxAdSpaces &&
              ad.size == adSpace.adSize &&
              ad.type == adSpace.adType
            ) {
              console.log("Size match");
              if (!adSpace.ad) {
                AdSpace.findByIdAndUpdate(adSpace._id, {
                  $addToSet: { requestedAds: ad._id },
                }).catch((err) => {
                  console.log(err);
                });
                foundAdSpace = true;
                counter++;
              } else {
                console.log(adSpace._id + " already has an ad placed on it");
              }
            } else {
              console.log(
                "Ad Size: " + ad.size + " || Ad Space Size: " + adSpace.adSize
              );
              console.log(
                "Ad Type: " + ad.type + " || Ad Space Type: " + adSpace.adType
              );
            }
          });
          if (foundAdSpace) {
            console.log("AdSpaces found and updated successfully");
            return res.status(200).send("Successful");
          } else {
            throw new Error("No adSpaces found with matching attributes");
          }
        } else {
          throw new Error("No domains were found with matching categories");
        }
      } else {
        throw new Error(
          "Ad has already been placed on maximum number of adSpaces"
        );
      }
    } else {
      throw new Error("Ad's Payment has not yet been completed");
    }
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

// ADD AN AD SPACE ID TO THE AD (Accept an ad)
const AddAdSpace = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { $push: { adSpace: req.body.adSpaceId } },
      {
        new: true,
      }
    );
    return res.status(200).json(ad);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.GetAds = GetAds;
exports.GetAdByID = GetAdByID;
exports.CreateAd = CreateAd;
exports.UpdateAd = UpdateAd;
exports.DeleteAd = DeleteAd;

exports.TrackImpression = TrackImpression;
exports.TrackClick = TrackClick;
exports.FindSuitableAdSpaces = FindSuitableAdSpaces;
exports.AddAdSpace = AddAdSpace;
