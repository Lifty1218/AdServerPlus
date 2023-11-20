import { createBrowserRouter } from "react-router-dom";

import Home from "./common/pages/home";
import NotFound from "./common/pages/NotFound";

import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminDashboardChild from "./pages/admin/adminDashboardChild";
import AdminDashboardAdvertisers from "./pages/admin/advertisers";
import AdminDashboardPublishers from "./pages/admin/publishers";
import AdminDashboardAds from "./pages/admin/ads";
import AdminDashboardAdSpaces from "./pages/admin/adSpaces";
import AdminDashboardDomains from "./pages/admin/domains";
import AdminDashboardAdvertiserPayments from "./pages/admin/advertiserPayments";
import AdminDashboardPublisherPayments from "./pages/admin/publisherPayments";
import AdminAssistanceAdvertisers from "./pages/admin/advertiserAssistance";
import AdminAssistanceAdvertisersList from "./pages/admin/advertiserAssistanceList";
import AdminAssistancePublishers from "./pages/admin/publisherAssistance";
import AdminAssistancePublisherList from "./pages/admin/publisherAssistanceList";

import AdvertiserLogin from "./pages/advertiser/login";
import AdvertiserSignup from "./pages/advertiser/signup";
import AdvertiserDashboard from "./pages/advertiser/dashboard";
import AdvertiserDashboardChild from "./pages/advertiser/dashboardChild";
import AdvertiserAds from "./pages/advertiser/ads";
import AdvertiserNewAdsCampaignType from "./pages/advertiser/adsNewCampaignType";
import AdvertiserNewAdsMain from "./pages/advertiser/adsNewMain";
import AdvertiserNewAdsPricePlans from "./pages/advertiser/adsNewPricePlans";
import AdMaker from "./pages/advertiser/adMaker";
import AdvertiserCheckoutSuccess from "./pages/advertiser/checkoutSuccess";
import AdvertiserCheckoutFailure from "./pages/advertiser/checkoutFailure";
import AdvertiserUserAssistance from "./pages/advertiser/assistance";
import AdvertiserProfileSettings from "./pages/advertiser/profileSettings";

import PublisherLogin from "./pages/publisher/login";
import PublisherSignup from "./pages/publisher/signup";
import PublisherDashboard from "./pages/publisher/dashboard";
import PublisherDashboardChild from "./pages/publisher/dashboardChild";
import PublisherNewAdSpace from "./pages/publisher/adSpacesNew";
import PublisherAdSpaces from "./pages/publisher/adSpaces";
import PublisherDomains from "./pages/publisher/domains";
import PublisherAdRequests from "./pages/publisher/adRequests";
import Analytics from "./pages/publisher/analytics";
import PublisherUserAssistance from "./pages/publisher/assistance";
import PublisherWithdraw from "./pages/publisher/withdraw";
import PublisherProfileSettings from "./pages/publisher/profileSettings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/advertiser/login",
    element: <AdvertiserLogin />,
  },
  {
    path: "/publisher/login",
    element: <PublisherLogin />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/publisher/register",
    element: <PublisherSignup />,
  },
  {
    path: "/advertiser/register",
    element: <AdvertiserSignup />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      {
        path: "",
        element: <AdminDashboardChild />,
      },
      {
        path: "dashboard",
        element: <AdminDashboardChild />,
      },
      {
        path: "advertisers",
        element: <AdminDashboardAdvertisers />,
      },
      {
        path: "publishers",
        element: <AdminDashboardPublishers />,
      },
      {
        path: "ads",
        element: <AdminDashboardAds />,
      },
      {
        path: "ad_spaces",
        element: <AdminDashboardAdSpaces />,
      },
      {
        path: "domains",
        element: <AdminDashboardDomains />,
      },
      {
        path: "advertiser_payments",
        element: <AdminDashboardAdvertiserPayments />,
      },
      {
        path: "publisher_payments",
        element: <AdminDashboardPublisherPayments />,
      },
      {
        path: "advertiser_assistance",
        element: <AdminAssistanceAdvertisersList />,
      },
      {
        path: "advertiser_assistance/chat",
        element: <AdminAssistanceAdvertisers />,
      },
      {
        path: "publisher_assistance",
        element: <AdminAssistancePublisherList />,
      },
      {
        path: "publisher_assistance/chat",
        element: <AdminAssistancePublishers />,
      },
    ],
  },
  {
    path: "/publisher",
    element: <PublisherDashboard />,
    children: [
      {
        path: "",
        element: <PublisherDashboardChild />,
      },
      {
        path: "dashboard",
        element: <PublisherDashboardChild />,
      },
      {
        path: "profile",
        element: <PublisherProfileSettings />,
      },
      {
        path: "ad_spaces_new",
        element: <PublisherNewAdSpace />,
      },
      {
        path: "ad_spaces",
        element: <PublisherAdSpaces />,
      },
      {
        path: "domains",
        element: <PublisherDomains />,
      },
      {
        path: "domains/analytics",
        element: <Analytics />,
      },
      {
        path: "ad_requests",
        element: <PublisherAdRequests />,
      },
      {
        path: "assistance",
        element: <PublisherUserAssistance />,
      },
      {
        path: "withdraw",
        element: <PublisherWithdraw />,
      },
    ],
  },
  {
    path: "/advertiser",
    element: <AdvertiserDashboard />,
    children: [
      {
        path: "",
        element: <AdvertiserDashboardChild />,
      },
      {
        path: "dashboard",
        element: <AdvertiserDashboardChild />,
      },
      {
        path: "profile",
        element: <AdvertiserProfileSettings />,
      },
      {
        path: "ads",
        element: <AdvertiserAds />,
      },
      {
        path: "ads_new",
        element: <AdvertiserNewAdsCampaignType />,
      },
      {
        path: "ads_new/main",
        element: <AdvertiserNewAdsMain />,
      },
      {
        path: "ads_new/price_plans",
        element: <AdvertiserNewAdsPricePlans />,
      },
      {
        path: "ads_new/checkout/success",
        element: <AdvertiserCheckoutSuccess />,
      },
      {
        path: "ads_new/checkout/failure",
        element: <AdvertiserCheckoutFailure />,
      },
      {
        path: "ad_maker",
        element: <AdMaker />,
      },
      {
        path: "assistance",
        element: <AdvertiserUserAssistance />,
      },
    ],
  },
]);

export default router;
