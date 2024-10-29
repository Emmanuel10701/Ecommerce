"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const kenyaCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans-Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot",
];

const ProfileSettings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useRouter();

  useEffect(() => {
    // This will only run on the client side
    const savedName = localStorage.getItem("name");
    const savedEmail = localStorage.getItem("email");
    const savedCounty = localStorage.getItem("county");
    const savedZipcode = localStorage.getItem("zipcode");
    const savedAddress = localStorage.getItem("address");
    const savedPhoneNumber = localStorage.getItem("phoneNumber");
    const savedImage = localStorage.getItem("profileImage");

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedCounty) setCounty(savedCounty);
    if (savedZipcode) setZipcode(savedZipcode);
    if (savedAddress) setAddress(savedAddress);
    if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
    if (savedImage) setProfileImage(savedImage);
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/avif", "image/webp"];
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result;
          setProfileImage(imageData);
          localStorage.setItem("profileImage", imageData);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select a valid image file (JPEG, PNG, JPG, AVIF, WEBP).");
      }
    }
  };

  const handleSaveProfile = () => {
    if (!name || !email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("county", county);
    localStorage.setItem("zipcode", zipcode);
    localStorage.setItem("address", address);
    localStorage.setItem("phoneNumber", phoneNumber);

    // Add logic to push changes to the database using Prisma here

    toast.success("Profile updated successfully! 🎉");
    navigate.push("/");
  };

  return (
    <div className="container mx-auto p-6 w-full bg-[url('/assets/profile.jpeg')] bg-cover mt-16 bg-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Image
            src={profileImage || "/images/default.png"}
            alt="Profile Image"
            width={150}
            height={150}
            className="rounded-full border-4 border-blue-500 object-cover"
          />
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg, image/avif, image/webp"
            style={{ display: "none" }}
            id="profileImageUpload"
            onChange={handleImageUpload}
          />
          <label htmlFor="profileImageUpload" className="absolute bottom-0 right-0 cursor-pointer">
            <div className="bg-blue-500 text-white p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232a3 3 0 014.243 4.243l-9 9a3 3 0 01-1.414.793l-3 1a1 1 0 01-1.263-1.263l1-3a3 3 0 01.793-1.414l9-9z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7l3 3m-4-4l4 4" />
              </svg>
            </div>
          </label>
        </div>

        <div className="mt-6 w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Country</label>
            <div className="flex items-center">
              <Image src="/assets/flag.png" alt="Kenya Flag" width={24} height={28} />
              <span className="ml-2">Kenya 🇰🇪</span>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">County</label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              {kenyaCounties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">ZIP Code</label>
            <input
              type="text"
              pattern="[0-9]*"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              pattern="[0-9]*"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Save Profile
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfileSettings;
