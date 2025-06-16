import { CreateLink } from '@/components/CreateLink'
import Error from '@/components/Error'
import LinkCard from '@/components/LinkCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { UrlState } from '@/context'
import { getClicksForUrl } from '@/db/apiClick'
import { getUrls } from '@/db/apiUrl'
import useFetch from '@/hooks/useFetch'
import { Filter } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = UrlState();
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user?.id);
  const { loading: loadingClicks, error: errorClicks, data: dataClicks, fn: fnClicks } = useFetch(getClicksForUrl, urls?.map((url) => url.id));

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  console.log(dataClicks);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className='flex flex-col gap-8'>
        {loading || loadingClicks && <BarLoader width={'100%'} color='blue' />}
        <div className='grid grid-cols-2 gap-4'>
          <Card className={'border border-black'}>
            <CardHeader>
              <CardTitle>Links Created</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{urls?.length || 0}</p>
            </CardContent>
          </Card>
          <Card className={'border border-black'}>
            <CardHeader>
              <CardTitle>Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{dataClicks?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-between'>
          <h1 className='font-extrabold'>My Links</h1>
          <CreateLink/>
        </div>

        <div className='relative'>
          <Input type='text' placeholder='Filter Links'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Filter className='cursor-pointer absolute top-2 right-2 p-1' />
        </div>

        {error && <Error message={error.message} />}

        {(filteredUrls || [])?.map((url, i) => (
           (<LinkCard key={i} url={url} fetchUrls={fnUrls} />)
        ))}
      </div>
    </>
  )
}

export default Dashboard
