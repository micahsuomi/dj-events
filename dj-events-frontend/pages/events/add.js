import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

import { parseCookie } from "@/helpers/index"
import { API_URL } from "@/config/index";
import Layout from "@/components/Layout";

import styles from "@/styles/Form.module.css";

export default function AddEventPage({ token }) {
  const [newEvent, setNewEvent] = useState({
    name: "",
    performers: "",
    venue: "",
    address: "",
    date: "",
    time: "",
    description: "",
  });
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation 
    const hasEmptyFields = Object.values(newEvent).some((event) => event === '')
    if(hasEmptyFields) {
      toast.error('Please fill in all fields')
    }
    console.log(token)
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEvent)
    })
    // console.log('res here', res)
    if(!res.ok) {
      if(res.status === 403 || res.status === 401) {
        toast.error('No token included')
        return
      }
      toast.error('Something went wrong')
    } else {
      const data = await res.json()
      router.push(`/events/${data.slug}`)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const { name, performers, venue, address, date, time, description } = newEvent;
  
  return (
    <Layout title="Add New Event">
      <Link href="/events">Go Back</Link>
      <h1>Add Event</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">
              Name
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="name"
              />
            </label>
          </div>
          <div>
            <label htmlFor="performer">
              Performers
              <input
                type="text"
                id="performers"
                name="performers"
                value={performers}
                onChange={handleChange}
                placeholder="performers"
              />
            </label>
          </div>
          <div>
            <label htmlFor="performer">
              Venue
              <input
                type="text"
                id="venue"
                name="venue"
                value={venue}
                onChange={handleChange}
                placeholder="venue"
              />
            </label>
          </div>
          <div>
            <label htmlFor="address">
              Address
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={handleChange}
                placeholder="address"
              />
            </label>
          </div>
          <div>
            <label htmlFor="date">
              Date
              <input
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={handleChange}
                placeholder="date"
              />
            </label>
          </div>
          <div>
            <label htmlFor="time">
              Time
              <input
                type="text"
                id="time"
                name="time"
                value={time}
                onChange={handleChange}
                placeholder="time"
              />
            </label>
          </div>
        </div>
        <div>
            <label htmlFor="description">
              Description
              <textarea
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                placeholder="description"
              ></textarea>
            </label>
          </div>
          <input type="submit" value="Add Event" className="btn" />
      </form>
    </Layout>
  );
}

export async function getServerSideProps({req}) {
  const { token } = parseCookie(req)
  console.log(token)
  return {
    props: {
      token
    }
  }
}