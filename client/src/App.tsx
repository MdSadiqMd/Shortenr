import { useState } from 'react';
import { Copy, Check } from "lucide-react";
import './App.css';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import trpcClient from './trpc';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [retrievedUrl, setRetrievedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    try {
      const response = await trpcClient.createShortUrl.mutate({ url });
      setShortUrl(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRetrieveUrl = async () => {
    if (!shortUrl) return;
    try {
      const response = await trpcClient.getShortUrl.query(shortUrl);
      setRetrievedUrl(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="space-y-6 max-w-lg w-full">
        {/* URL Shortener Card */}
        <Card className="w-full bg-white shadow-lg rounded-lg">
          <CardHeader className="text-center p-6 border-b">
            <CardTitle className="text-2xl font-semibold">URL Shortener</CardTitle>
            <CardDescription className="text-gray-500 mt-1">Enter a long URL to get a shortened version</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="url" className="block text-sm font-medium text-gray-700">Long URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Shorten URL
              </Button>
            </form>
          </CardContent>
          {shortUrl && (
            <CardFooter className="p-6 border-t flex flex-col space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700">Shortened URL</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Input value={shortUrl} readOnly className="w-full border border-gray-300 rounded-md" />
                  <Button size="icon" variant="outline" onClick={handleCopy} className="border-gray-300 hover:bg-gray-100">
                    {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                    <span className="sr-only">Copy shortened URL</span>
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Retrieve Long URL Card */}
        <Card className="w-full bg-white shadow-lg rounded-lg">
          <CardHeader className="text-center p-6 border-b">
            <CardTitle className="text-2xl font-semibold">Retrieve Long URL</CardTitle>
            <CardDescription className="text-gray-500 mt-1">Enter a shortened URL to retrieve the original long URL</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="shortUrl" className="block text-sm font-medium text-gray-700">Short URL</Label>
                <Input
                  id="shortUrl"
                  type="url"
                  placeholder="https://short.ly/abc123"
                  value={shortUrl}
                  onChange={(e) => setShortUrl(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <Button onClick={handleRetrieveUrl} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Retrieve Long URL
              </Button>
            </div>
          </CardContent>
          {retrievedUrl && (
            <CardFooter className="p-6 border-t">
              <div>
                <Label className="block text-sm font-medium text-gray-700">Original Long URL</Label>
                <Input value={retrievedUrl} readOnly className="mt-1 w-full border border-gray-300 rounded-md" />
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;