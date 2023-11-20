import React, { useState, useEffect } from "react";
import axios from "axios";
import Heading from "../../common/components/headingIcon";
import { TailSpin } from "react-loader-spinner";
import { createUseStyles } from "react-jss";
import { Form, useLocation, useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { capitalize } from "lodash";
import { BsChevronDoubleDown } from "react-icons/bs";
import {
  categoriesArray,
  countriesArray,
  bannerImgSizeArray,
  sideImgSizeArray,
  innerImgSizeArray,
} from "../../data/localData";

export default function AdsNewMain() {
  const currentAdvertiser = JSON.parse(localStorage.getItem("advertiser"));
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const [company, setCompany] = useState("");
  const [adCategory, setAdCategory] = useState(
    categoriesArray[0] || "Arts & Entertainment"
  );
  const [adLocation, setAdLocation] = useState("Pakistan" || countriesArray[0]);
  const [adRedirectURL, setAdRedirectURL] = useState("");
  const [adImage, setAdImage] = useState(null);
  const [adSize, setAdSize] = useState("");
  const [adSizeField, setAdSizeField] = useState("");
  const [adType, setAdType] = useState();
  const [imgErrText, setImgErrText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adSizeArray, setAdSizeArray] = useState([]);

  const MAX_FILE_SIZE = 2097152; // 2 MB

  useEffect(() => {
    if (!location.state) {
      navigate("/advertiser/ads_new");
    } else {
      setAdType(location.state.adType);
    }
  }, []);

  useEffect(() => {
    if (adType == "banner") {
      setAdSizeArray(bannerImgSizeArray);
      setAdSizeField(bannerImgSizeArray[0]);
      setAdSize(bannerImgSizeArray[0].split("(")[1].slice(0, -4).trim());
    } else if (adType == "inner") {
      setAdSizeArray(innerImgSizeArray);
      setAdSizeField(innerImgSizeArray[0]);
      setAdSize(innerImgSizeArray[0].split("(")[1].slice(0, -4).trim());
    } else {
      setAdSizeArray(sideImgSizeArray);
      setAdSizeField(sideImgSizeArray[0]);
      setAdSize(sideImgSizeArray[0].split("(")[1].slice(0, -4).trim());
    }
  }, [adType]);

  const handleImageChange = (e) => {
    if (adSize) {
      const adWidth = adSize.split("x")[0].trim();
      const adHeight = adSize.split("x")[1].trim();
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setImgErrText("Image file size should be less than 2 MB.");
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            if (img.naturalWidth == adWidth && img.naturalHeight == adHeight) {
              setAdImage(file);
              setImgErrText("");
              console.log(img.baseURI);
            } else {
              setAdImage(null);
              setImgErrText(
                "Your image size must be " +
                  adWidth +
                  " x " +
                  adHeight +
                  " (px)   but it's " +
                  img.naturalWidth +
                  " x " +
                  img.naturalHeight +
                  " (px)"
              );
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    } else {
      setAdImage(null);
      setImgErrText("Please Select an Ad Image Size.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      company &&
      adCategory &&
      adLocation &&
      adRedirectURL &&
      adType &&
      adSize &&
      adImage
    ) {
      setImgErrText("");
      const formData = new FormData();
      formData.append("company", company);
      formData.append("adCategory", adCategory);
      formData.append("adLocation", adLocation);
      formData.append("adRedirectURL", adRedirectURL);
      formData.append("adType", adType);
      formData.append("adSize", adSize);
      formData.append("advertiserId", currentAdvertiser._id);
      formData.append("adImage", adImage);
      try {
        setIsLoading(true);
        const response = await axios.post(
          "http://localhost:5000/advertiser/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setIsLoading(false);
        navigate("/advertiser/ads_new/price_plans", {
          state: { adId: response.data.id },
        });
      } catch (error) {
        console.log(error.response.data);
      }
    } else {
      setImgErrText("Please fill all the above fields.");
    }
  };

  const HeadingTertiary = ({ text, icon }) => {
    return (
      <h4 className={classes.headingTertiary}>
        {text}
        <BsChevronDoubleDown style={{ marginLeft: ".6rem" }} />
      </h4>
    );
  };

  return (
    <div className={classes.app}>
      <Heading
        text="Create a new ad campaign"
        icon={<FaPlusCircle />}
        headingStyle={{
          fontSize: "2.6rem",
          marginBottom: "4rem",
          marginTop: "2rem",
        }}
      />
      <h3 className={classes.heading}>Fill the following fields:</h3>
      <Form
        onSubmit={handleFormSubmit}
        method="POST"
        encType="multipart/form-data"
        className={classes.form}
      >
        <HeadingTertiary text="Company Information" />
        <div className={classes.nestedContainer}>
          <div className={classes.nestedContainerItem}>
            <label htmlFor="company" className={classes.label}>
              Company/Organization Name:
            </label>
            <input
              type="text"
              required
              name="company"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={classes.input}
            />
          </div>
          <div className={classes.nestedContainerItem}>
            <label htmlFor="adRedirectURL" className={classes.label}>
              Company/Organization Website URL:
            </label>
            <input
              type="url"
              required
              name="adRedirectURL"
              id="adRedirectURL"
              value={adRedirectURL}
              onChange={(e) => setAdRedirectURL(e.target.value)}
              className={classes.input}
            />
          </div>
        </div>

        <HeadingTertiary text="Target Audience Information" />

        <div className={classes.nestedContainer}>
          <div className={classes.nestedContainerItem}>
            <label htmlFor="adCategory" className={classes.label}>
              Ad Category
            </label>
            <select
              id="adCategory"
              name="adCategory"
              required
              value={adCategory}
              onChange={(e) => {
                setAdCategory(e.target.value);
              }}
              className={`${classes.input}`}
            >
              {categoriesArray.map((category, index) => (
                <option key={index} value={category}>
                  {capitalize(category)}
                </option>
              ))}
            </select>
          </div>

          <div className={classes.nestedContainerItem}>
            <label htmlFor="adLocation" className={classes.label}>
              Target Country
            </label>
            <select
              id="adLocation"
              name="adLocation"
              required
              value={adLocation}
              onChange={(e) => {
                setAdLocation(e.target.value);
              }}
              className={`${classes.input}`}
            >
              {countriesArray.map((country, index) => (
                <option key={index} value={country}>
                  {capitalize(country)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <HeadingTertiary text="Ad Information" />
        <div className={classes.nestedContainer} style={{ gap: "2rem" }}>
          <div className={classes.nestedContainerItem}>
            <label htmlFor="adImage" className={classes.label}>
              Upload Ad Image
            </label>
            <input
              type="file"
              name="adImage"
              required
              id="adImage"
              // accept="image/x-png,image/jpeg"
              onChange={handleImageChange}
              className={classes.input}
            />
          </div>

          <div className={classes.nestedContainerItem}>
            <label htmlFor="adSize" className={classes.label}>
              Ad Image Size (px)
            </label>
            <select
              id="adSize"
              name="adSize"
              required
              value={adSizeField}
              onChange={(e) => {
                setAdSizeField(e.target.value);
                setAdSize(e.target.value.split("(")[1].slice(0, -4).trim());
              }}
              className={`${classes.input}`}
            >
              {adSizeArray.map((category, index) => (
                <option key={index} value={category}>
                  {capitalize(category)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {imgErrText && (
          <span
            style={{
              color: "orangered",
              margin: "0 0 1.5rem 1rem",
              fontSize: "1.4rem",
            }}
          >
            {imgErrText}
          </span>
        )}
        <button className={classes.button} type="submit">
          Create ad campaign
          {isLoading && (
            <span style={{ marginLeft: "2rem" }}>
              <TailSpin color="#fff" height={25} width={25} />
            </span>
          )}
        </button>
      </Form>
    </div>
  );
}

const useStyles = createUseStyles({
  app: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.5rem 5%",
  },
  heading: {
    fontSize: "1.8rem",
    // textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    width: "80%",
  },
  headingTertiary: {
    fontSize: "1.4rem",
    marginBottom: "1rem",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    marginTop: "2rem",
  },
  form: {
    padding: "10px",
    width: "80%",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "1.15rem",
    marginBottom: ".5rem",
    marginLeft: ".2rem",
    display: "inline-block",
    // width: '100%'
  },
  input: {
    marginBottom: "2rem",
    padding: "1.2rem 1.8rem",
    borderRadius: "3px",
    outline: "none",
    border: "1px solid #ddd",
    width: "100%",
  },
  nestedContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    gap: "4rem",
  },
  nestedContainerItem: {
    flex: "1",
  },
  button: {
    padding: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    outline: "none",
    backgroundColor: "#00ADB5",
    border: "none",
    color: "#f5f5f5",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "3px",
    textTransform: "uppercase",
    marginTop: "1rem",
    transition: "all .2s",
    "&:hover": {
      backgroundColor: "#374151",
    },
  },
});
