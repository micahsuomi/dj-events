import { useContext } from 'react';
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt, FaTimes } from "react-icons/fa";

import AuthContext from "@/context/AuthContext";
import Layout from "../../components/Layout";
import EventMap from "../../components/EventMap";
import { API_URL } from "@/config/index";

import styles from "@/styles/Event.module.css";

export default function MyEvent({ evt }) {
  const router = useRouter()
  const { user } = useContext(AuthContext)

  const deleteEvent = async() => {
    if(confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/events/${evt.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if(!res.ok) {
        toast.error(data.message)
      } else {
        router.push('/events')
      }
    }
  };
  return (
    <Layout>
      <div className={styles.event}>
        {
          user &&
          <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt />
              Edit Event
            </a>
          </Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes />
          </a>
        </div>
        }
        <span>
          {new Date(evt.date).toLocaleDateString("en-US")} at {evt.time}
          <h1>{evt.name}</h1>
          <ToastContainer />
          {evt.image && (
            <div className={styles.image}>
              <Image
                src={evt.image.formats.medium.url}
                width={960}
                height={600}
              />{" "}
            </div>
          )}
        </span>
        <h3>Performers</h3>
        <p>{evt.performers}</p>
        <h3>Description: </h3>
        <p>{evt.description}</p>
        <h3>Venue: {evt.venue}</h3>
        <p>{evt.address}</p>
        <EventMap evt={evt} />
        <Link href="/">
          <a className={styles.back}>{"<"} Go Back</a>
        </Link>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  //old url from data.json
  //const res = await fetch(`${API_URL}/api/events`);
  //new url from STRAPI
  const res = await fetch(`${API_URL}/events?_sort=date:ASC`);

  const events = await res.json();
  const paths = events.map((evt) => ({
    params: { slug: evt.slug },
  }));
  return {
    paths,
    fallback: true,
    // this will return an array of objects, example
    /*
        paths: [
            {params: { id: 1 }},
            {params: { id: 2 }},
            {params: { id: 3 }},
            {params: { id: 4 }},

        ]*/
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;
  const res = await fetch(`${API_URL}/events?slug=${slug}`);
  const evt = await res.json();
  return {
    props: { evt: evt[0] },
    revalidate: 1,
  };
}

/*
// export async function getServerSideProps({ query: { slug }}) {
    OR
export async function getServerSideProps(context) {
    const { slug } = context.query
    const res = await fetch(`${API_URL}/api/events/${slug}`)
    const evt = await res.json()
    return {
        props: { evt }
    }
}*/
