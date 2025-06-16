/* eslint-disable react/prop-types */
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteUrl } from "@/db/apiUrl";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/useFetch";

const LinkCard = ({ url = {}, fetchUrls }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title || "qr-code";

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <div className="flex flex-col md:flex-row gap-4 border border-gray-300 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      <img
        src={url?.qr}
        className="h-32 w-32 object-contain border border-blue-500 rounded-md"
        alt="QR Code"
      />

      <div className="flex flex-col justify-between flex-1">
        <div>
          <Link
            to={`/link/${url?.id}`}
            className="text-xl font-semibold text-gray-900 hover:underline"
          >
            {url?.title}
          </Link>

          <div className="mt-1">
            <a
              href={`/${url?.custom_url || url?.short_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-words font-medium text-base"
            >
              {import.meta.env.FRONTEND_URI}/{url?.custom_url || url?.short_url}
            </a>
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-1 mt-1 break-words">
            <LinkIcon size={16} />
            {url?.original_url}
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          Created on: {new Date(url?.created_at).toLocaleString()}
        </div>
      </div>

      <div className="flex md:flex-col gap-2 items-center md:justify-start">
        <Button
          variant="ghost"
          title="Copy link"
          onClick={() =>
            navigator.clipboard.writeText(`https://trimrr.in/${url?.short_url}`)
          }
        >
          <Copy size={18} />
        </Button>

        <Button variant="ghost" title="Download QR" onClick={downloadImage}>
          <Download size={18} />
        </Button>

        <Button
          variant="ghost"
          title="Delete link"
          onClick={() => fnDelete().then(() => fetchUrls())}
          disabled={loadingDelete}
        >
          {loadingDelete ? <BeatLoader size={6} color="black" /> : <Trash size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
