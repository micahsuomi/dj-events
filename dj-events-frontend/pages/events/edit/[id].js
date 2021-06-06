import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { FaImage } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";

import { API_URL } from "@/config/index";
import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import ImageUplaod from "@/components/ImageUpload";
import { parseCookie } from "@/helpers/index"

import styles from "@/styles/Form.module.css";

export default function EditEventPage({ evt, token }) {
  const router = useRouter();
  const [editEvent, setEditEvent] = useState({
    name: evt.name,
    performers: evt.performers,
    venue: evt.venue,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  });
  const [imagePreview, setImagePreview] = useState(
    evt.image && evt.image.formats.thumbnail.url
  );
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    const hasEmptyFields = Object.values(editEvent).some(
      (event) => event === ""
    );
    if (hasEmptyFields) {
      toast.error("Please fill in all fields");
    }
    const res = await fetch(`${API_URL}/events/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editEvent),
    });
    if (!res.ok) {
      if(res.status === 403 || res.status === 401) {
        toast.error('Unauthorized')
        return
      }
      toast.error("Something went wrong");
    } else {
      const data = await res.json();
      router.push(`/events/${data.slug}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEvent({
      ...editEvent,
      [name]: value,
    });
  };

  const imageUploaded = async () => {
    console.log(evt.id)
    const res = await fetch(`${API_URL}/events/${evt.id}`)
    const data = await res.json()
    console.log(data)
      setImagePreview(data.image.formats.thumbnail.url)
    // setImagePreview(data.image.formats.thumbnail.url)
    setShowModal(false)
  };

  const { name, performers, venue, address, date, time, description } =
    editEvent;
  return (
    <Layout title="Add New Event">
      <Link href="/events">Go Back</Link>
      <h1>Edit Event</h1>
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
                value={moment(date).format("yyyy-MM-DD")}
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
        <input type="submit" value="Update Event" className="btn" />
      </form>
      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} />
      ) : (
        <div>
          <p>No Image Uploaded</p>
        </div>
      )}
      <div>
        <button className="btn-secondary" onClick={() => setShowModal(true)}>
          <FaImage /> Set Image
        </button>
      </div>
      <Modal showModal={showModal} onClose={() => setShowModal(false)}>
        <ImageUplaod evtId={evt.id} imageUploaded={imageUploaded} token={token} />
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  //this cookie is not accessable on the client side, 
  const { token } = parseCookie(req)
  console.log(token)
  const res = await fetch(`${API_URL}/events/${id}`);
  const evt = await res.json();
  return {
    props: {
      evt,
      token: token
    },
  };
}
