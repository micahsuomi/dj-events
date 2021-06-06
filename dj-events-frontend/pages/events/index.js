import Layout from '@/components/Layout'

import { API_URL, PER_PAGE } from '@/config/index'
import EventItem from '@/components/EventItem'
import Pagination from '@/components/Pagination'


export default function EventsPage({ events, page, total }) {
  return (
    <Layout>
      <h1>Events</h1>
      { events.length < 1 && <h3>No Events to Show</h3>}
      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt}/>
      ))}
      <Pagination page={page} total={total} perPage={PER_PAGE} />
    </Layout>
  );
}

export async function getServerSideProps({query: {page = 1}}) {
  //old url API
  // const res = await fetch(`${API_URL}/api/events`);
  //url from STRAPI
  //calculate startpage
  const start = parseInt(page) === 1 ? 0 : ((parseInt(page) - 1) * PER_PAGE)
  //fetch total count
  const totalRes = await fetch(`${API_URL}/events/count`)
  const total = await totalRes.json();

  //fetch events
  const eventRes = await fetch(`${API_URL}/events?_sort=date:ASC&_limit=${PER_PAGE}&_start=${start}`)
  const events = await eventRes.json();
  return {
    props: { events, 
            page: parseInt(page),
          total },
    // revalidate: 1,
  };
}
