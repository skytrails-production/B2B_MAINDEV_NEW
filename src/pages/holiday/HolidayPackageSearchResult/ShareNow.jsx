import React from "react";
import { Dropdown } from "flowbite-react";
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";
import { Copy, Share2 } from "lucide-react";
const ShareNow = ({ id }) => {
  const shareWhatsApp = () => {
    const isMobileDevice = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
      navigator.userAgent
    );

    const url = isMobileDevice
      ? `whatsapp://send?text=${encodeURIComponent(
          `https://theskytrails.com/holidaypackages/packagedetails?packageId=${id}`
        )}`
      : `https://web.whatsapp.com/send?text=${encodeURIComponent(
          `https://theskytrails.com/holidaypackages/packagedetails?packageId=${id}`
        )}`;

    window.open(url, "_blank");
  };

  const shareTwitter = () => {
    const url = `http://twitter.com/share?url=https://theskytrails.com/holidaypackages/packagedetails?packageId=${id}`;
    window.open(url, "twitter-share-dialog", "width=650,height=auto");
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/shareArticle?mini=true&summary=youtube&title=f1&url=https://theskytrails.com/holidaypackages/packagedetails?packageId=${id}`;
    window.open(url, "linkedin-share-dialog", "width=650,height=auto");
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=https://theskytrails.com/holidaypackages/packagedetails?packageId=${id}`;
    window.open(url, "facebook-share-dialog", "width=650,height=auto");
  };

  const copyLinkToClipboard = () => {
    const linkToCopy = `https://theskytrails.com/holidaypackages/packagedetails?packageId=${id}`;
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        console.log("Link copied!");
      })
      .catch((err) => console.error("Unable to copy link", err));
  };

  const copy = <Copy />;

  return (
    <div>
      <Dropdown
        label=""
        className="pl-0"
        placement="left-start"
        renderTrigger={() => <Share2 size={16} className="text-gray-700" />}
      >
        <Dropdown.Item
          className="nowrap flex flex-row gap-2"
          onClick={() => shareWhatsApp()}
          //   icon={<i class="fa-brands fa-whatsapp text-green-500"></i>}
        >
          <i class="fa-brands fa-whatsapp text-green-500 text-base"></i>{" "}
          Whatsapp
        </Dropdown.Item>
        <Dropdown.Item
          className="nowrap flex flex-row gap-2"
          onClick={() => shareTwitter()}
          //   icon={HiCog}
        >
          <i class="fa-brands fa-x-twitter  text-base"></i> Twitter
        </Dropdown.Item>
        <Dropdown.Item
          className="nowrap flex flex-row gap-2"
          onClick={() => shareLinkedIn()}
          //   icon={HiCurrencyDollar}
        >
          <i class="fa-brands fa-linkedin-in text-base text-blue-600"></i>{" "}
          LinkedIn
        </Dropdown.Item>
        <Dropdown.Item
          className="nowrap flex flex-row gap-2"
          onClick={() => shareFacebook()}
          //   icon={HiCurrencyDollar}
        >
          <i class="fa-brands fa-facebook text-base text-blue-900"></i> Facebook
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          className="nowrap flex flex-row gap-2"
          onClick={() => copyLinkToClipboard()}
          //   icon={copy}
        >
          <Copy size={16} /> Copy Link
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default ShareNow;
