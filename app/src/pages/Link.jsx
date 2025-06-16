import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClick";
import { deleteUrl, getUrl } from "@/db/apiUrl";
import useFetch from "@/hooks/useFetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) navigate("/dashboard");

  const link = url?.custom_url || url?.short_url;

  return (
    <div className="flex flex-col gap-8 text-gray-800">
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#2563eb" />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="flex flex-col items-start gap-6 w-full lg:w-2/5 p-6 bg-white rounded-lg shadow border">
          <h1 className="text-4xl font-bold">{url?.title}</h1>

          <a
            href={`/${link}`}
            target="_blank"
            className="text-blue-600 font-semibold break-all hover:underline"
          >
            {import.meta.env.FRONTEND_URI}/{link}
          </a>

          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 text-sm text-gray-600 hover:underline"
          >
            <LinkIcon className="w-4 h-4" />
            {url?.original_url}
          </a>

          <span className="text-xs text-gray-500">
            Created on: {new Date(url?.created_at).toLocaleString()}
          </span>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() =>
                navigator.clipboard.writeText(`https://trimrr.in/${link}`)
              }
            >
              <Copy className="mr-1 w-4 h-4" /> Copy
            </Button>

            <Button variant="outline" onClick={downloadImage}>
              <Download className="mr-1 w-4 h-4" /> Download QR
            </Button>

            <Button
              variant="destructive"
              onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard");
                })
              }
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <>
                  <Trash className="mr-1 w-4 h-4" /> Delete
                </>
              )}
            </Button>
          </div>

          <img
            src={url?.qr}
            className="w-full max-w-xs ring-2 ring-blue-400 p-2 rounded-lg object-contain"
            alt="QR Code"
          />
        </div>

        {/* Stats Panel */}
        <Card className="w-full lg:w-3/5 p-2 shadow-md border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Statistics</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {stats && stats.length > 0 ? (
              <>
                <Card className="bg-gray-100">
                  <CardHeader>
                    <CardTitle className="text-xl font-medium">
                      Total Clicks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stats.length}</p>
                  </CardContent>
                </Card>

                <div>
                  <CardTitle className="text-lg mb-2 text-gray-700">
                    Location Stats
                  </CardTitle>
                  <Location stats={stats} />
                </div>

                <div>
                  <CardTitle className="text-lg mb-2 text-gray-700">
                    Device Stats
                  </CardTitle>
                  <DeviceStats stats={stats} />
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                {loadingStats ? "Loading statistics..." : "No statistics yet."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinkPage;
