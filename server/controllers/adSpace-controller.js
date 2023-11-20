const AdSpace = require("../models/adSpace");
const axios = require("axios");

// GET ALL AD_SPACES
const GetAdSpaces = async (req, res) => {
  console.log("Get all adSpaces");
  try {
    const adSpace = await AdSpace.find();
    return res.status(200).send(adSpace);
  } catch (err) {
    return res.send(err);
  }
};

// GET SINGLE AD_SPACE
const GetAdSpaceByID = async (req, res) => {
  console.log("Get a single adSpace");
  try {
    const adSpace = await AdSpace.findById(req.params.id).populate("ad").exec();
    return res.status(200).send(adSpace);
  } catch (err) {
    return res.send(err);
  }
};

// CREATE NEW AD_SPACE
const CreateAdSpace = async (req, res) => {
  console.log("Create an adSpace");
  const adSpace = new AdSpace(req.body);
  try {
    await adSpace.save();
    return res.status(200).json(adSpace);
  } catch (err) {
    return res.send(err);
  }
};

// UPDATE AD_SPACE
const UpdateAdSpace = async (req, res) => {
  console.log("Update an adSpace");

  try {
    const adSpace = await AdSpace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(adSpace);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// DELETE AD_SPACE
const DeleteAdSpace = async (req, res) => {
  console.log("Delete an adSpace");

  try {
    const adSpace = await AdSpace.findByIdAndDelete(req.params.id);
    return res.status(200).json(adSpace);
  } catch (err) {
    return res.send(err);
  }
};

// REMOVE AN AD_REQUEST FROM AN AD_SPACE
const RemoveAdRequest = async (req, res) => {
  console.log("Remove ad: " + req.body.adId);
  try {
    const adSpace = await AdSpace.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          requestedAds: req.body.adId,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json(adSpace);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// INCREMENT AD_SPACE IMPRESSIONS
const TrackImpression = async (req, res) => {
  console.log("Track AdSpace Impressions");

  try {
    const adSpace = await AdSpace.findByIdAndUpdate(
      req.params.id,
      { $inc: { impressions: 1 } },
      {
        new: true,
      }
    ).populate("publisher");
    if (adSpace.impressions % 3000 == 0) {
      console.log("AdSpace Impressions reached ", adSpace.impressions);
      console.log("Publisher will receive: ", adSpace.cpm * 3);

      await axios.post("http://localhost:5000/payment/publisher/transfer", {
        stripeId: adSpace.publisher.stripeId,
        publisherId: adSpace.publisher._id,
        adSpaceId: adSpace._id,
        product: "3000 Impressions",
        amount: adSpace.cpm * 3,
      });
    }
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).send(err);
  }
};

// INCREMENT AD_SPACE CLICKS
const TrackClick = async (req, res) => {
  console.log("Track AdSpace Clicks");
  try {
    const adSpace = await AdSpace.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      {
        new: true,
      }
    ).populate("publisher");
    if (adSpace.clicks % 5 == 0) {
      console.log("AdSpace Clicks reached ", adSpace.clicks);
      console.log("Publisher will receive: ", adSpace.cpc * 5);
      await axios.post("http://localhost:5000/payment/publisher/transfer", {
        stripeId: adSpace.publisher.stripeId,
        publisherId: adSpace.publisher._id,
        adSpaceId: adSpace._id,
        product: "5 Clicks",
        amount: adSpace.cpc * 5,
      });
    }
    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.GetAdSpaces = GetAdSpaces;
exports.GetAdSpaceByID = GetAdSpaceByID;
exports.CreateAdSpace = CreateAdSpace;
exports.UpdateAdSpace = UpdateAdSpace;
exports.DeleteAdSpace = DeleteAdSpace;

exports.RemoveAdRequest = RemoveAdRequest;
exports.TrackImpression = TrackImpression;
exports.TrackClick = TrackClick;
