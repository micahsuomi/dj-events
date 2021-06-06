import Layout from '@/components/Layout'
import Link from 'next/link'

import { API_URL } from '@/config/index'
import EventItem from '@/components/EventItem'

export default function HomePage({ events }) {
  return (
    <Layout>
      <h1>Upcoming Events</h1>
      { events.length < 1 && <h3>No Events to Show</h3>}
      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt}/>
      ))}
      {events.length > 0 && (
        <Link href='/events'>
          <a className="btn-secondary">
            View All Events
          </a>
        </Link>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  //old url from data.json
  // const res = await fetch(`${API_URL}/api/events`)
  //new url from STRAPI
  const res = await fetch(`${API_URL}/events?_sort=date:ASC&_limit=3`)
  const events = await res.json();
  return {
    props: { events},
    revalidate: 1,
  };
}
