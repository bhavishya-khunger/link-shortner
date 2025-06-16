import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles } from "lucide-react";

const Landing = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-3 bg-white dark:bg-gray-900 transition-colors">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Tired of loooooooong links?
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Shorten them with{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Trimrr</span> and
            make sharing a breeze!{" "}
            <Sparkles className="inline-block text-yellow-400" />
          </p>
        </div>

        <form
          onSubmit={handleShorten}
          className="mx-auto flex flex-col sm:flex-row max-w-xl gap-2 mb-8"
        >
          <Input
            type="url"
            placeholder="Enter your URL here"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="h-12 flex-1 py-3 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button type="submit" className="h-12 font-semibold bg-indigo-700 dark:bg-indigo-800 active:scale-90 hover:bg-indigo-800 dark:hover:bg-indigo-900 text-white rounded">
            Shorten!
          </Button>
        </form>

        <div className="max-w-2xl mx-auto mt-12">
          <Accordion type="multiple" collapsible className="rounded-md px-5 dark:bg-gray-800 transition-colors">
            <AccordionItem value="item-1">
              <AccordionTrigger className="py-3 font-medium rounded-t-md focus-visible:ring-2 focus-visible:ring-indigo-500 text-gray-900 dark:text-white">
                How does the Trimrr URL shortener work?
              </AccordionTrigger>
              <AccordionContent className="py-3 text-gray-700 dark:text-gray-300">
                When you enter a long URL, our system generates a shorter, unique web address.
                Clicking this shortened URL will instantly redirect you to the original, longer link.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="py-3 font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 text-gray-900 dark:text-white">
                Do I need an account to use Trimrr?
              </AccordionTrigger>
              <AccordionContent className="py-3 text-gray-700 dark:text-gray-300">
                Yes, you require a account to shorten the links and keep them stored at one place!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="py-3 font-medium rounded-b-md focus-visible:ring-2 focus-visible:ring-indigo-500 text-gray-900 dark:text-white">
                What kind of analytics are available for my links?
              </AccordionTrigger>
              <AccordionContent className="py-3 text-gray-700 dark:text-gray-300">
                For each shortened URL, you can access detailed analytics such as the total number
                of clicks, the geographic locations where clicks originated, and the types of
                devices (desktop or mobile) used to access the links. This data helps you understand
                the reach and engagement of your shared links.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Landing;
