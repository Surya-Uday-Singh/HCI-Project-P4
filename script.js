["introData", "eventsData", "projectsData", "footerData", "registerUrl", "registerHidden", "contactEmail"].forEach((k) =>
  localStorage.removeItem(k),
);

// --- STATE & DATA ---
let isAdminMode = false;
let currentEventEditId = null;
let currentProjectEditId = null;
let logoClickCount = 0;
let logoClickTimer = null;
const ADMIN_ACCESS_CODE = "ctb";

function to24Hour(timeStr) {
  if (!timeStr) return "";
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return String(hours).padStart(2, "0") + ":" + minutes;
}

function to12Hour(timeStr) {
  if (!timeStr) return "";
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return timeStr;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return hours + ":" + minutes + " " + period;
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatProjectDateForInput(dateStr) {
  if (!dateStr) return "";
  const lower = dateStr.trim().toLowerCase();
  const idx = MONTH_NAMES.findIndex((m) => m.toLowerCase() === lower.split(" ")[0]);
  if (idx === -1) return "";
  const year = dateStr.trim().split(" ")[1];
  if (!year || isNaN(year)) return "";
  return year + "-" + String(idx + 1).padStart(2, "0") + "-01";
}

function formatProjectDateForDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return dateStr;
  return MONTH_NAMES[d.getMonth()] + " " + d.getFullYear();
}

// Close any dialog when clicking outside (on the backdrop)
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("toggle", () => {
    const anyOpen = [...document.querySelectorAll("dialog")].some((d) => d.open);
    document.body.style.overflow = anyOpen ? "hidden" : "";
  });
});

function avatarUrl(name) {
  const n = name || "U";
  const initials = n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const colors = [
    "#e03136",
    "#2b8a3e",
    "#1971c2",
    "#e8590c",
    "#9c36b5",
    "#0ca678",
    "#d9480f",
    "#7048e8",
    "#c92a2a",
    "#1864ab",
  ];
  let hash = 0;
  for (let i = 0; i < n.length; i++) hash = (hash * 31 + n.charCodeAt(i)) | 0;
  const bg = colors[Math.abs(hash) % colors.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" rx="64" fill="${bg}"/><text x="64" y="76" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="48" fill="white">${initials}</text></svg>`)}`;
}

let introData = JSON.parse(localStorage.getItem("introData")) || {
  title: "Welcome to Civic Tech Brampton",
  text: "We're a community of developers, designers, data enthusiasts, and civic-minded people building technology for the public good. Join us at our monthly meetups to learn, collaborate, and create tools that make Brampton a better place to live.",
  image: "images/779a9a08-368e-49eb-94e3-4fb1635c0231.jpg",
};
let eventsData = JSON.parse(localStorage.getItem("eventsData")) || [
  {
    id: 26,
    title: "CivicTechBrampton 18th Meetup: MeshTastic Off-Grid Communication For Everyone",
    date: "2026-07-30",
    time: "6:00 PM - 8:30 PM",
    desc: "An open source, off-grid, decentralized mesh network built to run on affordable, low-power devices. No cell towers. No internet. Just pure peer-to-peer connectivity. Inviting all technologists, students, and citizens interested in organizations decentralized and mesh networks, and CivicTech related projects. Felix Montalfu and Saad Imran are Mesh Network, Ham Radio enthusiasts and Algoma University students. Check out the Meshtastic website here: https://meshtastic.org/ New to Civic Tech? You are definitely welcome! We will all be learning from each other. Just knowing what projects people are working on, sparks ideas about new civic tech projects. There will be opportunities to network, and pitch your own project to interested volunteers. Questions: email civictechbrampton@pm.me",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Felix Montalfu and Saad Imran, 7:00 to 7:15 Q& A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Entrance off Nelson Square. Parking available underground. 5 minute walk form Brampton Innovation Go Train and Bus station.",
    registerUrl: "https://luma.com/r8ijtp74",
    lumaEventId: "evt-6rRsQaM3xdQssWk",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Felix Montalfu",
        role: "Mesh Network Enthusiast, Algoma University",
        social: "https://linkedin.com/in/felix-montalfu",
      },
      {
        name: "Saad Imran",
        role: "Mesh Network Enthusiast, Algoma University",
        social: "https://linkedin.com/in/saad-imran",
      },
    ],
    volunteers: [
      { name: "Priya Sharma", role: "Event Coordinator" },
      { name: "Marcus Chen", role: "Logistics Volunteer" },
    ],
  },
  {
    id: 25,
    title: "Open Source for Civic Good: Hack Night",
    date: "2026-08-20",
    time: "6:00 PM - 9:00 PM",
    desc: "Join us for a hands-on hack night where we tackle real civic tech challenges facing Brampton. Whether you are a seasoned developer or just getting started, come collaborate on open source projects that make a difference in our community.",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Project deep dives and team formation, 7:00 to 8:30 Breakout into projects of interest, 8:30 to 9:00 Demo and wrap-up",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Entrance off Nelson Square. Parking available underground. 5 minute walk from Brampton Innovation Go Train and Bus station.",
    registerUrl: "https://luma.com/civictech-brampton-hacknight",
    lumaEventId: "",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Priya Sharma",
        role: "Community Organizer",
        social: "https://linkedin.com/in/priya-sharma",
      },
      {
        name: "Marcus Chen",
        role: "Open Source Maintainer",
        social: "https://linkedin.com/in/marcus-chen",
      },
    ],
    volunteers: [
      { name: "Daniel Torres", role: "Refreshments Coordinator" },
      { name: "Emily Stewart", role: "Welcome Desk" },
    ],
  },
  {
    id: 24,
    title:
      "CivicTechBrampton 19th Meetup: Technologists for Democracy: Autonomous vehicles surveilling you...?",
    date: "2026-08-06",
    time: "6:00 PM - 8:30 PM",
    desc: "Autonomous vehicles surveilling you...? Science fiction or a scene from the novel 1984? No, this is Toronto in 2026. Inviting all technologists, students, and citizens interested in working on Democracy, Surveillance and Civic Tech projects. Adam Motaouakkil will present Technologists For Democracy. Check out their website here: https://techfordemocracy.ca/ New to Democracy, Surveillance or Civic Tech? You are definitely welcome! We will all be learning from each other. Just knowing what projects people are working on, sparks ideas about new civic tech projects. There will be opportunities to network, and pitch your own project to interested volunteers. Questions: email civictechbrampton@pm.me",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Adam Motaouakkil (Technologists For Democracy), 7:00 to 7:15 Q&A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social at a local bar",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Entrance off Nelson Square. Parking available underground. 5 minute walk from Brampton Innovation Go Train and Bus station.",
    registerUrl: "https://luma.com/dyeh52t0",
    lumaEventId: "evt-fWFb1M8xSPoSw80",
    image:
      "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=800,height=400/event-covers/ww/779a9a08-368e-49eb-94e3-4fb1635c0231.jpg",
    speakers: [
      {
        name: "Adam Motaouakkil",
        role: "Presenter, Technologists For Democracy",
        social: "https://techfordemocracy.ca/",
      },
    ],
    volunteers: [
      { name: "Anika Patel", role: "Social Media Manager" },
      { name: "Raj Mehta", role: "Tech Support" },
    ],
  },
  {
    id: 23,
    title:
      "Nuclear Energy Renaissance and North American Young Generation in Nuclear",
    date: "2026-07-23",
    time: "6:00 PM - 8:30 PM",
    desc: "Can Ontario’s energy needs be met by low carbon energy sources? Can Nuclear Energy be a safe and reliable source of energy? Can technology be deployed to manage nuclear facilities? The answer is yes! The nuclear industry in Canada is having a renaissance and is hiring people for many different types of backgrounds! Inviting all technologists, students, and citizens interested in organizations serving immigrants, and CivicTech related projects. Christina Mohan is Canadian Operationg Officer of North American Young Generation in Nuclear (NAYGN), Canada Region, a group for the next generation of nuclear industry enthusiasts. Check out their website here: https://naygn.org/ New to Civic Tech? You are definitely welcome! We will all be learning from each other. Just knowing what projects people are working on, sparks ideas about new civic tech projects. There will be opportunities to network, and pitch your own project to interested volunteers. Questions: email civictechbrampton@pm.me",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Christina Mohan (NAYGN), https://naygn.org/, 7:00 to 7:15 Q& A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Entrance off Nelson Square. Parking available underground. 5 minute walk form Brampton Innovation Go Train and Bus station.",
    registerUrl: "",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Christina Mohan",
        role: "Canadian Operating Officer of NAYGN",
        social: "https://linkedin.com/in/christina-mohan",
      },
    ],
    volunteers: [
      { name: "Priya Sharma", role: "Event Coordinator" },
      { name: "Marcus Chen", role: "Logistics Volunteer" },
    ],
  },
  {
    id: 22,
    title: "Amateur radio operator certification Workshop",
    date: "2026-07-11",
    time: "1:00 PM - 3:00 PM",
    desc: "We are doing a deep dive into Ham or Amateur Radio by studying for the Amateur Radio Operator Certification. The workshops will be led by an experienced ham radio operator. This is not a regular meetup, but it is a group study session. It requires a commitment of attending at least 8 out of 10 sessions in person on the weekend. If you are interested in becoming a ham radio operator and can commit to attending the sessions, come join us. All are welcome, but we request that you please be on time to minimize disruption to the workshop. If you have issues entering the building, please call (647) 210 2524.",
    agenda: "",
    location: "24 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Room A-201. Main entrance is from Queen Street. Free parking underground. 10 mins walk from Brampton Innovation Go Station",
    registerUrl: "",
    image: "",
    speakers: [],
    volunteers: [
      { name: "Daniel Torres", role: "Refreshments Coordinator" },
      { name: "Emily Stewart", role: "Welcome Desk" },
    ],
  },
  {
    id: 21,
    title: "Bisola-Mariam matching housing tenants and owners using AI",
    date: "2026-07-02",
    time: "6:00 PM - 8:30 PM",
    desc: "Can housing tenants efficiently find available housing that meets their needs? Can homeowners easily find tenants that are meet the owners requirements? Can technology be deployed to effectively match tenants and owners? The answer is yes! Bisola-Mariam will present Gida, a housing platform matching tenants and owners more effectively using technology that goes beyond simple listings.",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Bisola-Mariam Gida: https://gidaai.netlify.app/, 7:00 to 7:15 Q& A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Entrance off Nelson Square. Parking available underground. 5 minute walk form Brampton Innovation Go Train and Bus station.",
    registerUrl: "",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Bisola-Mariam Gida",
        role: "Founder, Gida",
        social: "https://linkedin.com/in/bisola-mariam-gida",
      },
    ],
    volunteers: [
      { name: "Anika Patel", role: "Social Media Manager" },
      { name: "Raj Mehta", role: "Tech Support" },
    ],
  },
  {
    id: 20,
    title: "Amateur radio operator certification Workshop",
    date: "2026-06-27",
    time: "1:00 PM - 3:00 PM",
    desc: "We are doing a deep dive into Ham or Amateur Radio by studying for the Amateur Radio Operator Certification. The workshops will be led by an experienced ham radio operator. This is not a regular meetup, but it is a group study session. It requires a commitment of attending at least 8 out of 10 sessions in person on the weekend. If you are interested in becoming a ham radio operator and can commit to attending the sessions, come join us. All are welcome, but we request that you please be on time to minimize disruption to the workshop. If you have issues entering the building, please call (647) 210 2524.",
    agenda: "",
    location: "24 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Room A-201. Main entrance is from Queen Street. Free parking underground. 10 mins walk from Brampton Innovation Go Station",
    registerUrl: "",
    image: "",
    speakers: [
      { name: "Lisa Chang", role: "Emergency Communications Specialist", social: "https://linkedin.com/in/lisa-chang" },
    ],
    volunteers: [
      { name: "Samantha Lee", role: "Photography" },
      { name: "Kevin Nguyen", role: "Venue Liaison" },
    ],
  },
  {
    id: 19,
    title: "Amateur radio operator certification Workshop",
    date: "2026-06-20",
    time: "1:00 PM - 3:00 PM",
    desc: "We are doing a deep dive into Ham or Amateur Radio by studying for the Amateur Radio Operator Certification. The workshops will be led by an experienced ham radio operator. This is not a regular meetup, but it is a group study session. It requires a commitment of attending at least 8 out of 10 sessions in person on the weekend. If you are interested in becoming a ham radio operator and can commit to attending the sessions, come join us. All are welcome, but we request that you please be on time to minimize disruption to the workshop. If you have issues entering the building, please call (647) 210 2524.",
    agenda: "",
    location: "24 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Room A-201. Main entrance is from Queen Street. Free parking underground. 10 mins walk from Brampton Innovation Go Station",
    registerUrl: "",
    image: "",
    speakers: [{ name: "Karen Mitchell", role: "Radio Licensing Instructor", social: "https://linkedin.com/in/karen-mitchell" }],
    volunteers: [],
  },
  {
    id: 18,
    title: "Formulize Inc. and Technology for Nonprofits",
    date: "2026-06-18",
    time: "6:00 PM - 8:30 PM",
    desc: "Can new technology be used to support nonprofit organizations? Can we develop new skills while contributing to essential needs for nonprofit organizations? Can technology workers contribute to social purpose projects? The answer is yes! Formulize Inc. is a new technology development organization, that uses the Formulize open source data management software, including its newest AI integration features, to serve nonprofit and public sector organizations in Canada and internationally!",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Julian Egelstaff, Founder of Formulize, 7:00 to 7:15 Q& A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Entrance off Nelson Square. Parking available underground. 5 minute walk form Brampton Innovation Go Train and Bus station.",
    registerUrl: "",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Julian Egelstaff",
        role: "Founder, Principal Consultant, and Lead Developer for Formulize Inc.",
        social: "https://linkedin.com/in/julian-egelstaff",
      },
    ],
    volunteers: [
      { name: "Fatima Al-Rashid", role: "Registration Desk" },
      { name: "James Okonkwo", role: "Setup Lead" },
    ],
  },
  {
    id: 17,
    title: "Amateur radio operator certification Workshop",
    date: "2026-06-13",
    time: "1:00 PM - 3:00 PM",
    desc: "We are doing a deep dive into Ham or Amateur Radio by studying for the Amateur Radio Operator Certification. The workshops will be led by an experienced ham radio operator. This is not a regular meetup, but it is a group study session. It requires a commitment of attending at least 8 out of 10 sessions in person on the weekend. If you are interested in becoming a ham radio operator and can commit to attending the sessions, come join us. All are welcome, but we request that you please be on time to minimize disruption to the workshop. If you have issues entering the building, please call (647) 210 2524.",
    agenda: "",
    location: "24 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Room A-201. Main entrance is from Queen Street. Free parking underground. 10 mins walk from Brampton Innovation Go Station",
    registerUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    image: "",
    speakers: [],
    volunteers: [{ name: "Marcus Chen", role: "Logistics Volunteer" }],
  },
  {
    id: 16,
    title: "CANSA Centre for Community and Cultural Development",
    date: "2026-06-11",
    time: "6:00 PM - 8:30 PM",
    desc: "Can technology be used to support immigrant serving organizations? Can we develop new skills while contributing to essential needs for nonprofit organizations? Can technology workers contribute to social purpose projects? The answer is yes, and CANSA Centre for Community and Cultural Development is a nonprofit organization serving immigrant communities in Canada!",
    agenda: "",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Entrance off Nelson Square. Parking available underground. 5 minute walk form Brampton Innovation Go Train and Bus station.",
    registerUrl: "",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Dr Sunanda Panda",
        role: "Chairperson of CANSA Centre for Community and Cultural Development",
        social: "https://linkedin.com/in/sunanda-panda",
      },
    ],
    volunteers: [
      { name: "Priya Sharma", role: "Event Coordinator" },
      { name: "Daniel Torres", role: "Refreshments Coordinator" },
    ],
  },
  {
    id: 15,
    title: "Amateur radio operator certification Workshop",
    date: "2026-06-06",
    time: "1:00 PM - 3:00 PM",
    desc: "We are doing a deep dive into Ham or Amateur Radio by studying for the Amateur Radio Operator Certification. The workshops will be led by an experienced ham radio operator. This is not a regular meetup, but it is a group study session. It requires a commitment of attending at least 8 out of 10 sessions in person on the weekend. If you are interested in becoming a ham radio operator and can commit to attending the sessions, come join us. All are welcome, but we request that you please be on time to minimize disruption to the workshop. If you have issues entering the building, please call (647) 210 2524.",
    agenda: "",
    location: "24 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Room A-201. Main entrance is from Queen Street. Free parking underground. 10 mins walk from Brampton Innovation Go Station",
    registerUrl: "",
    image: "",
    speakers: [{ name: "David Osei", role: "Peel Region HAM Radio Volunteer", social: "https://linkedin.com/in/david-osei" }],
    volunteers: [
      { name: "Emily Stewart", role: "Welcome Desk" },
      { name: "Raj Mehta", role: "Tech Support" },
    ],
  },
  {
    id: 14,
    title: "Amateur radio operator certification Workshop",
    date: "2026-05-30",
    time: "1:00 PM - 3:00 PM",
    desc: "We are doing a deep dive into Ham or Amateur Radio by studying for the Amateur Radio Operator Certification. The workshops will be led by an experienced ham radio operator. This is not a regular meetup, but it is a group study session. It requires a commitment of attending at least 8 out of 10 sessions in person on the weekend. If you are interested in becoming a ham radio operator and can commit to attending the sessions, come join us. All are welcome, but we request that you please be on time to minimize disruption to the workshop. If you have issues entering the building, please call (647) 210 2524.",
    agenda: "",
    location: "24 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Room A-201. Main entrance is from Queen Street. Free parking underground. 10 mins walk from Brampton Innovation Go Station",
    registerUrl: "",
    image: "",
    speakers: [
      { name: "Thomas Burke", role: "Emergency Response Communications Lead", social: "https://linkedin.com/in/thomas-burke" },
    ],
    volunteers: [],
  },
  {
    id: 13,
    title: "Hypha Technology Worker Cooperative",
    date: "2026-05-28",
    time: "6:00 PM - 8:30 PM",
    desc: "Can technology companies be cooperatives? Can every technology worker be a member and an owner? Can technology workers have an equal democratic vote in decision making as all other workers? The answers is yes, and Hypha Coop is a technology worker cooperative in Canada!",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Andi Argast, Member-Owner https://hypha.coop/, 7:00 to 7:15 Q& A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Entrance off Nelson Square. Parking available underground. 5 minute walk form Brampton Innovation Go Train and Bus station.",
    registerUrl: "",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Andi Argast",
        role: "Member-Owner",
        social: "https://linkedin.com/in/andi-argast",
      },
    ],
    volunteers: [{ name: "Anika Patel", role: "Social Media Manager" }],
  },
  {
    id: 12,
    title: "Amateur radio operator certification Workshop",
    date: "2026-05-23",
    time: "1:00 PM - 3:00 PM",
    desc: "We are doing a deep dive into Ham or Amateur Radio by studying for the Amateur Radio Operator Certification. The workshops will be led by an experienced ham radio operator. This is not a regular meetup, but it is a group study session. It requires a commitment of attending at least 8 out of 10 sessions in person on the weekend. If you are interested in becoming a ham radio operator and can commit to attending the sessions, come join us. All are welcome, but we request that you please be on time to minimize disruption to the workshop. If you have issues entering the building, please call (647) 210 2524.",
    agenda: "",
    location: "24 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Room A-201. Main entrance is from Queen Street. Free parking underground. 10 mins walk from Brampton Innovation Go Station",
    registerUrl: "",
    image: "",
    speakers: [],
    volunteers: [{ name: "Samantha Lee", role: "Photography" }],
  },
  {
    id: 11,
    title: "Amateur radio operator certification Workshop",
    date: "2026-05-16",
    time: "1:00 PM - 3:00 PM",
    desc: "We are doing a deep dive into Ham or Amateur Radio by studying for the Amateur Radio Operator Certification. The workshops will be led by an experienced ham radio operator. This is not a regular meetup, but it is a group study session. It requires a commitment of attending at least 8 out of 10 sessions in person on the weekend. If you are interested in becoming a ham radio operator and can commit to attending the sessions, come join us. All are welcome, but we request that you please be on time to minimize disruption to the workshop. If you have issues entering the building, please call (647) 210 2524.",
    agenda: "",
    location: "24 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Room A-201. Main entrance is from Queen Street. Free parking underground. 10 mins walk from Brampton Innovation Go Station",
    registerUrl: "",
    image: "",
    speakers: [{ name: "Sandra Kim", role: "Amateur Radio Educator", social: "https://linkedin.com/in/sandra-kim" }],
    volunteers: [
      { name: "Kevin Nguyen", role: "Venue Liaison" },
      { name: "Fatima Al-Rashid", role: "Registration Desk" },
    ],
  },
  {
    id: 10,
    title: "AI and Serial Entrepreneurship",
    date: "2026-05-14",
    time: "6:00 PM - 8:30 PM",
    desc: "What are the commonalities between an AI based Language Translation company, AI based Municipal Government Solutions, and an Automated Pickleball Score Counter? Of course, it is the serial entrepreneur who started all of these companies!",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Deepinder Singh, https://www.prudlelabs.com/, 7:00 to 7:15 Q& A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "SCEI centre 3rd Floor. Main entrance is from Nelson Square. Free parking underground. 10 mins walk form Brampton Innovation Go and Bus Station",
    registerUrl: "",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Deepinder Singh",
        role: "Serial Entrepreneur",
        social: "https://linkedin.com/in/deepinder-singh",
      },
    ],
    volunteers: [
      { name: "James Okonkwo", role: "Setup Lead" },
      { name: "Priya Sharma", role: "Event Coordinator" },
    ],
  },
  {
    id: 9,
    title: "Amateur radio operator certification Workshop",
    date: "2026-05-09",
    time: "1:00 PM - 3:00 PM",
    desc: "We are doing a deep dive into Ham or Amateur Radio by studying for the Amateur Radio Operator Certification. The workshops will be led by an experienced ham radio operator. This is not a regular meetup, but it is a group study session. It requires a commitment of attending at least 8 out of 10 sessions in person on the weekend. If you are interested in becoming a ham radio operator and can commit to attending the sessions, come join us. All are welcome, but we request that you please be on time to minimize disruption to the workshop. If you have issues entering the building, please call (647) 210 2524.",
    agenda: "",
    location: "24 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "Room A-201. Main entrance is form Queen Street. Free parking underground. 10 mins walk from Brampton Innovation Go Station",
    registerUrl: "",
    image: "",
    speakers: [
      { name: "Robert MacNeil", role: "Certified Amateur Radio Operator", social: "https://linkedin.com/in/robert-macneil" },
    ],
    volunteers: [],
  },
  {
    id: 8,
    title: "Climate Voting Records for everyday citizens",
    date: "2026-05-07",
    time: "6:00 PM - 9:00 PM",
    desc: "Can citizens understand city councillors environmental voting records? Can we present municipal voting records in a way that is understandable by all citizens?",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Mitch Bechtel, Climate Fast and David Laing Brampton Environmental Alliance (BEA). https://votingrecords.bramptonea.org/, 7:00 to 7:15 Q& A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social at a local bar",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails: "",
    registerUrl: "",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Mitch Bechtel",
        role: "Climate Fast",
        social: "https://linkedin.com/in/mitch-bechtel",
      },
      {
        name: "David Laing",
        role: "Brampton Environmental Alliance",
        social: "https://linkedin.com/in/david-laing",
      },
    ],
    volunteers: [{ name: "Daniel Torres", role: "Refreshments Coordinator" }],
  },
  {
    id: 7,
    title: "Introduction to HAM radio by Peel Amateur Radio Club",
    date: "2026-04-30",
    time: "6:00 PM - 9:00 PM",
    desc: "Did you know that volunteer HAM radio operators are an essential part of emergency responses in cases of major emergency events in Brampton and Peel Region! What can we learn from HAM Radio operators who contribute to our technology resiliency and well as community connections?",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 John Bakkeren, Peel Amateur Radio Club https://ve3xr.wordpress.com/, 7:00 to 7:15 Questions & Answers, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social at a local bar",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "8 min walk from Brampton Innovation GO station. Video directions: https://www.instagram.com/civictechbrampton/",
    registerUrl: "",
    image: "",
    speakers: [
      {
        name: "John Bakkeren",
        role: "Past President of Peel Amateur Radio Club",
        social: "https://linkedin.com/in/john-bakkeren",
      },
    ],
    volunteers: [
      { name: "Emily Stewart", role: "Welcome Desk" },
      { name: "Marcus Chen", role: "Logistics Volunteer" },
    ],
  },
  {
    id: 6,
    title: "tRacket project Noise Monitoring by Ordinary Citizens",
    date: "2026-04-21",
    time: "6:00 PM - 9:00 PM",
    desc: "Did you know there are regular CivicTech Meetups in Toronto, Waterloo, and now in one of the fastest growing cities of innovation, Brampton! What can we learn from different Civic Tech projects across different cities?",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:25 Introductions (everyone), 6:25 to 6:55 Presentation by Gabe Sawhney, Co-founder for CivicTechTO, https://civictech.ca/ and tRacket https://opencollective.com/tracket, 6:55 to 7:05 Q&A, 7:05 to 7:25 Focus Groups, 7:25 to 7:40 Project pitches, 7:40 to 8:30 Breakout into projects of interest",
    location: "41 George St S, Brampton, ON L6Y 2E1, Canada",
    locationDetails:
      "A five minute walk from Brampton Innovation District GO Train and Bus station. Directly beside Sunset Grill",
    registerUrl: "",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Gabe Sawhney",
        role: "Co-founder of CivicTechTO",
        social: "https://linkedin.com/in/gabe-sawhney",
      },
    ],
    volunteers: [{ name: "Raj Mehta", role: "Tech Support" }],
  },
  {
    id: 5,
    title: "Showcase of projects by CivicTech Waterloo Region",
    date: "2026-04-14",
    time: "6:00 PM - 9:00 PM",
    desc: "Did you know there are regular CivicTech Meetups in Toronto, Waterloo, and now in one of the fastest growing cities for innovation, Brampton! What can we learn from different Civic Tech projects across different cities?",
    agenda: "",
    location: "41 George St S, Brampton, ON L6Y 2E1, Canada",
    locationDetails:
      "A five minute walk from Brampton Innovation District GO Train and Bus station. Directly beside Sunset Grill",
    registerUrl: "",
    image: "",
    speakers: [
      {
        name: "Andre (Dre) Levesque",
        role: "Organizer for CivicTechWR",
        social: "https://linkedin.com/in/andre-levesque",
      },
    ],
    volunteers: [
      { name: "Anika Patel", role: "Social Media Manager" },
      { name: "Samantha Lee", role: "Photography" },
    ],
  },
  {
    id: 4,
    title: "Augmented Reality/Virtual Reality, and Immersive Technology",
    date: "2026-04-09",
    time: "6:00 PM - 9:00 PM",
    desc: "Can we use Augmented Reality and Virtual Reality (AR/VR) as a new technology to solve long standing problems?",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Michael Andich. National Centre of Excellence for Immersive Technology, https://immxrsive.com/, 7:00 to 7:15 Q& A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social at a local bar",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails:
      "8 min walk from Brampton Innovation GO station. Video directions: https://www.instagram.com/civictechbrampton/",
    registerUrl: "",
    image: "",
    speakers: [
      {
        name: "Michael Andich",
        role: "Community and Partnerships Manager, National Centre of Excellence for Immersive Technology",
        social: "https://linkedin.com/in/michael-andich",
      },
    ],
    volunteers: [{ name: "Kevin Nguyen", role: "Venue Liaison" }],
  },
  {
    id: 3,
    title: "Civic Dashboard for everyday citizens",
    date: "2026-04-02",
    time: "6:00 PM - 8:30 PM",
    desc: "Can citizens understand local issues without a PhD in Political Science? Can we present municipal information in a way that is understandable by all citizens?",
    agenda:
      "6:00 to 6:15 Meet and network, 6:15 to 6:30 Introductions (everyone), 6:30 Presentation by Ilya Kreynin and Civic Dashboard. https://civicdashboard.ca/., 7:00 to 7:15 Q& A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End and optional social at a local bar",
    location: "8 Queen St E, Brampton, ON L6V 1A2, Canada",
    locationDetails: "",
    registerUrl: "",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    speakers: [
      {
        name: "Ilya Kreynin",
        role: "Civic Dashboard",
        social: "https://linkedin.com/in/ilya-kreynin",
      },
    ],
    volunteers: [
      { name: "Fatima Al-Rashid", role: "Registration Desk" },
      { name: "James Okonkwo", role: "Setup Lead" },
    ],
  },
  {
    id: 2,
    title:
      "CivicTechBrampton 2nd Meetup: Open Data Workshop with Open Data Peel",
    date: "2026-03-01",
    time: "6:00 PM - 8:30 PM",
    desc: "Inviting all technologists, students, and citizens interested in working on Open Data projects. Open Data Peel will present available datasets and ways to work with their data.",
    agenda:
      "6:00 to 6:30 Meet and network, 6:30 Presentation by Open Data Peel, 7:00 to 7:15 Q&A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End",
    location: "8 Queen St E, Brampton",
    locationDetails: "",
    registerUrl: "https://luma.com/bv80n9oq",
    lumaEventId: "",
    image: "",
    speakers: [
      {
        name: "Open Data Peel",
        role: "Presenter",
        social: "https://linkedin.com/company/open-data-peel",
      },
    ],
    volunteers: [{ name: "Priya Sharma", role: "Event Coordinator" }],
  },
  {
    id: 1,
    title:
      "CivicTechBrampton 1st Meetup: Open Data Workshop with Open Data Brampton",
    date: "2026-02-26",
    time: "6:00 PM - 9:00 PM",
    desc: "Inviting all technologists, students, citizens interested in working on Open Data projects. Open Data Brampton will present available datasets and ways to work with their data.",
    agenda:
      "6:00 to 6:30 Meet and network, 6:30 Presentation by Adam Commeford, Open Data Brampton, 7:00 to 7:15 Q&A, 7:15 to 7:30 Project pitches, 7:30 to 8:30 Breakout into projects of interest, 8:30 End",
    location: "8 Queen St E, Brampton",
    locationDetails: "",
    registerUrl: "https://luma.com/4sn0phi4",
    lumaEventId: "",
    image: "",
    speakers: [
      {
        name: "Adam Commeford",
        role: "Open Data Brampton",
        social: "https://linkedin.com/in/adam-commeford",
      },
    ],
    volunteers: [
      { name: "Daniel Torres", role: "Refreshments Coordinator" },
      { name: "Emily Stewart", role: "Welcome Desk" },
    ],
  },
];
let projectsData = JSON.parse(localStorage.getItem("projectsData")) || [
  {
    id: 101,
    title: "Brampton Transit Tracker",
    date: "January 2026",
    desc: "A real-time transit tracking dashboard for Brampton's Züm and Brampton Transit routes. Crowdsourced rider data helps identify delays, crowded buses, and service gaps across the city.",
    github: "https://github.com/civictechbrampton/brampton-transit-tracker",
    website: "",
    status: "Active",
    techStack: ["React", "Node.js", "GTFS Realtime", "Mapbox GL"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    mentors: [
      { name: "Andre Levesque", role: "Project Lead", social: "https://linkedin.com/in/andre-levesque", image: "" },
    ],
    contributors: [
      { name: "Sonia Maset", role: "Frontend Developer", image: "" },
      { name: "Gabe Sawhney", role: "Data Analyst", image: "" },
    ],
  },
  {
    id: 102,
    title: "Peel Open Data Explorer",
    date: "February 2026",
    desc: "An interactive web app that makes Peel Region's open datasets searchable and visualizable for residents. Filter by neighbourhood, time period, and topic to discover patterns in local data.",
    github: "https://github.com/civictechbrampton/peel-open-data-explorer",
    website: "https://peeldataexplorer.ca",
    status: "In Progress",
    techStack: ["Vue.js", "D3.js", "Python", "FastAPI"],
    image: "",
    mentors: [
      {
        name: "Priyanka Kundurthy",
        role: "Data Advisor",
        social: "https://linkedin.com/in/priyanka-kundurthy",
        image: "",
      },
      {
        name: "Adam Commeford",
        role: "Open Data Liaison",
        social: "https://linkedin.com/in/adam-commeford",
        image: "",
      },
    ],
    contributors: [
      { name: "Julian Egelstaff", role: "Backend Developer", image: "" },
    ],
  },
  {
    id: 103,
    title: "BikeSpace Brampton",
    date: "March 2026",
    desc: "A community-driven mapping tool for reporting bike lane conditions, parking availability, and cycling infrastructure issues in Brampton. Data feeds directly to city planners.",
    github: "https://github.com/civictechbrampton/bikespace-brampton",
    website: "",
    status: "Active",
    techStack: ["React Native", "PostgreSQL", "Leaflet", "Express"],
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
    mentors: [
      { name: "Ben Coleman", role: "Mapping Lead", social: "https://linkedin.com/in/ben-coleman", image: "" },
      { name: "Alex Portolos", role: "Mobile Lead", social: "https://linkedin.com/in/alex-portolos", image: "" },
    ],
    contributors: [
      { name: "Ilya Kreynin", role: "GIS Specialist", image: "" },
      { name: "Michael Andich", role: "UX Designer", image: "" },
    ],
  },
  {
    id: 104,
    title: "Noise Watch Brampton",
    date: "April 2026",
    desc: "A crowdsourced noise monitoring platform inspired by tRacket. Residents log noise complaints with location data, creating a living map of noise pollution across Brampton neighbourhoods.",
    github: "https://github.com/civictechbrampton/noise-watch-brampton",
    website: "",
    status: "Seeking Contributors",
    techStack: ["Svelte", "Firebase", "Web Audio API"],
    image: "",
    mentors: [
      { name: "Gabe Sawhney", role: "Project Lead", social: "https://linkedin.com/in/gabe-sawhney", image: "" },
    ],
    contributors: [
      { name: "Khasir", role: "Mobile Developer", image: "" },
      { name: "Gurpreet", role: "Data Engineer", image: "" },
    ],
  },
  {
    id: 105,
    title: "Community Budget Dashboard",
    date: "May 2026",
    desc: "An open-source tool that visualizes Brampton's municipal budget data. Citizens can explore spending by category, compare across years, and submit feedback on budget priorities.",
    github: "https://github.com/civictechbrampton/budget-dashboard",
    website: "https://bramptonbudget.ca",
    status: "Completed",
    techStack: ["Next.js", "Tailwind CSS", "Chart.js", "Supabase"],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    mentors: [
      {
        name: "Dr Sunanda Panda",
        role: "Policy Advisor",
        social: "https://linkedin.com/in/sunanda-panda",
        image: "",
      },
      { name: "Mitch Bechtel", role: "Technical Lead", social: "https://linkedin.com/in/mitch-bechtel", image: "" },
    ],
    contributors: [
      { name: "Christina Mohan", role: "Frontend Developer", image: "" },
      { name: "Bisola-Mariam", role: "UX Researcher", image: "" },
      { name: "Dr Selva Selvaratnam", role: "Data Scientist", image: "" },
    ],
  },
];
let footerData = JSON.parse(localStorage.getItem("footerData")) || {
  tagline: "Built with purpose.",
  links: [
    { label: "GitHub", url: "https://github.com/civictechbrampton" },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/company/civictechbrampton",
    },
    { label: "Twitter", url: "https://twitter.com/civictechypt" },
    { label: "Meetup", url: "https://meetup.com/civictechbrampton" },
  ],
};
let showAllEvents = false;
let showAllUpcoming = false;

// Local state for dynamically generated file inputs during edit
let tempFiles = {
  hero: null,
  heroRemoved: false,
  speakers: {},
  volunteers: {},
  projectHero: null,
  projectHeroRemoved: false,
  mentors: {},
  contributors: {},
};
let tempIntroImageFile = null;
let tempIntroImageRemoved = false;

const removeEventImageBtn = document.getElementById("remove-event-image-btn");
const eventImageBanner = document.getElementById("event-image-banner");
const eventImageInput = document.getElementById("event-image");
const eventImagePreview = document.getElementById("event-image-preview");
const projectImageBanner = document.getElementById("project-image-banner");
const projectImageInput = document.getElementById("project-image");
const projectImagePreview = document.getElementById("project-image-preview");
const removeProjectImageBtn = document.getElementById(
  "remove-project-image-btn",
);
const introImageInput = document.getElementById("intro-image-input");
const introImagePreviewModal = document.getElementById(
  "intro-image-preview-modal",
);
const removeIntroImageBtn = document.getElementById("remove-intro-image-btn");

function setHeroImageState(hasImage) {
  removeEventImageBtn.classList.toggle("show", hasImage);
  eventImageBanner.style.display = hasImage ? "none" : "block";
}

function setProjectImageState(hasImage) {
  removeProjectImageBtn.classList.toggle("show", hasImage);
  projectImageBanner.style.display = hasImage ? "none" : "block";
}

removeEventImageBtn.addEventListener("click", () => {
  tempFiles.hero = null;
  tempFiles.heroRemoved = true;
  eventImagePreview.src = "";
  eventImagePreview.style.display = "none";
  eventImageInput.value = "";
  setHeroImageState(false);
});

removeProjectImageBtn?.addEventListener("click", () => {
  tempFiles.projectHero = null;
  tempFiles.projectHeroRemoved = true;
  projectImagePreview.src = "";
  projectImagePreview.style.display = "none";
  projectImageInput.value = "";
  setProjectImageState(false);
});

// Toggle Admin Mode via hidden admin code
const logoToggle = document.getElementById("logo-toggle");
logoToggle.addEventListener("click", () => {
  if (isAdminMode) {
    isAdminMode = false;
    document.body.classList.toggle("admin-mode", false);
    logoToggle.classList.toggle("admin-mode", false);
    document.getElementById("footer-admin-controls").style.display = "none";
    renderEvents();
    renderUpcomingEvents();
    renderProjects();
    renderRegisterButton();
    return;
  }

  logoClickCount += 1;
  clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(() => {
    logoClickCount = 0;
  }, 700);

  if (logoClickCount >= 10) {
    logoClickCount = 0;
    clearTimeout(logoClickTimer);
    document.getElementById("admin-code-dialog").showModal();
  }
});

document.getElementById("admin-code-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const enteredCode = document.getElementById("admin-code-input").value.trim();

  if (enteredCode === ADMIN_ACCESS_CODE) {
    isAdminMode = true;
    document.body.classList.toggle("admin-mode", true);
    logoToggle.classList.toggle("admin-mode", true);
    document.getElementById("footer-admin-controls").style.display = "block";
    renderEvents();
    renderUpcomingEvents();
    renderProjects();
    renderRegisterButton();
    document.getElementById("admin-code-dialog").close();
    document.getElementById("admin-code-input").value = "";
  } else {
    alert("Incorrect admin code. Please try again.");
  }
});

function saveToLocalStorage() {
  localStorage.setItem("eventsData", JSON.stringify(eventsData));
}

function setIntroImageState(hasImage) {
  introImagePreviewModal.style.display = hasImage ? "block" : "none";
  removeIntroImageBtn.style.display = hasImage ? "inline-flex" : "none";
}

introImageInput?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    tempIntroImageFile = file;
    tempIntroImageRemoved = false;
    const reader = new FileReader();
    reader.onload = () => {
      introImagePreviewModal.src = reader.result;
      setIntroImageState(true);
    };
    reader.readAsDataURL(file);
  }
});

removeIntroImageBtn?.addEventListener("click", () => {
  tempFiles.hero = null;
  tempIntroImageRemoved = true;
  introImageInput.value = "";
  introImagePreviewModal.src = "";
  setIntroImageState(false);
});

// --- INTRO / PROJECTS ---
function renderIntro() {
  // Targets the newly id-labeled heading safely
  const headingEl = document.getElementById("intro-title-heading");
  if (headingEl) headingEl.textContent = introData.title;

  document.getElementById("intro-text").textContent = introData.text;

  const introImg = document.getElementById("intro-image");
  if (introData.image) {
    introImg.src = introData.image;
    introImg.style.display = "block";
  } else {
    introImg.src = "";
    introImg.style.display = "none";
  }
}

document.getElementById("edit-intro-btn").onclick = () => {
  document.getElementById("intro-title").value = introData.title;
  document.getElementById("intro-desc").value = introData.text;
  tempIntroImageFile = null;
  tempIntroImageRemoved = false;
  introImageInput.value = "";
  if (introData.image) {
    introImagePreviewModal.src = introData.image;
    setIntroImageState(true);
  } else {
    introImagePreviewModal.src = "";
    setIntroImageState(false);
  }
  document.getElementById("edit-intro-modal").showModal();
};

async function saveIntro(e) {
  e.preventDefault();
  introData.title = document.getElementById("intro-title").value;
  introData.text = document.getElementById("intro-desc").value;
  if (tempIntroImageFile) {
    introData.image = await getFileDataUrl(tempIntroImageFile);
  } else if (tempIntroImageRemoved) {
    introData.image = "";
  }
  localStorage.setItem("introData", JSON.stringify(introData));
  renderIntro();
  document.getElementById("edit-intro-modal").close();
}

renderIntro();

// --- FOOTER ---
function renderFooter() {
  const linksContainer = document.getElementById("footer-links");
  const taglineEl = document.querySelector(".footer-copy");

  const iconMap = {
    github:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.09c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>',
    twitter:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>',
    linkedin:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
    instagram:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>',
    meetup:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    email:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>',
    website:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4c2.5 2.5 3.2 5.5 3.2 8s-0.7 5.5-3.2 8"></path><path d="M12 4c-2.5 2.5-3.2 5.5-3.2 8s0.7 5.5 3.2 8"></path><path d="M8 6c2 1.5 4 1.5 8 0"></path><path d="M8 18c2-1.5 4-1.5 8 0"></path></svg>',
  };

  function getKey(label) {
    const l = label.toLowerCase();
    if (l.includes("github")) return "github";
    if (l.includes("twitter") || l.includes("x.com")) return "twitter";
    if (l.includes("linkedin")) return "linkedin";
    if (l.includes("instagram")) return "instagram";
    if (l.includes("meetup")) return "meetup";
    if (l.includes("email") || l.includes("mail")) return "email";
    return "website";
  }

  if (linksContainer) {
    linksContainer.innerHTML = footerData.links
      .map((link) => {
        const key = getKey(link.label);
        const svg = iconMap[key] || iconMap.website;
        return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="${link.label}">${svg}<span>${link.label}</span></a>`;
      })
      .join("");
  }
  if (taglineEl && footerData.tagline) {
    taglineEl.innerHTML = `&copy; 2026 Civic Tech Brampton. ${footerData.tagline}`;
  }
}

function openFooterEditor() {
  document.getElementById("footer-tagline").value = footerData.tagline || "";
  const container = document.getElementById("footer-links-editor");
  container.innerHTML = "";
  footerData.links.forEach((link) => addFooterLinkRow(link));
  document.getElementById("footer-editor-modal").showModal();
}

let footerLinkCounter = 0;
function addFooterLinkRow(link) {
  const container = document.getElementById("footer-links-editor");
  const id = footerLinkCounter++;
  const row = document.createElement("div");
  row.className = "form-group footer-link-row";
  row.dataset.id = id;
  row.style.cssText =
    "display:flex;gap:0.5rem;align-items:center;margin-bottom:0.75rem;";
  row.innerHTML = `
    <input type="text" class="footer-link-label" placeholder="Label (e.g. GitHub)" value="${link ? link.label : ""}" style="flex:1;" />
    <input type="url" class="footer-link-url" placeholder="https://..." value="${link ? link.url : ""}" style="flex:2;" />
    <button type="button" class="btn btn-small btn-delete" onclick="removeFooterLink(this)">✕</button>
  `;
  container.appendChild(row);
}

function removeFooterLink(btn) {
  if (confirm("Delete this link?")) {
    btn.closest(".footer-link-row").remove();
  }
}

function saveFooter(e) {
  e.preventDefault();
  footerData.tagline = document.getElementById("footer-tagline").value.trim();
  const rows = document.querySelectorAll(".footer-link-row");
  footerData.links = [];
  rows.forEach((row) => {
    const label = row.querySelector(".footer-link-label").value.trim();
    const url = row.querySelector(".footer-link-url").value.trim();
    if (label && url) footerData.links.push({ label, url });
  });
  localStorage.setItem("footerData", JSON.stringify(footerData));
  renderFooter();
  document.getElementById("footer-editor-modal").close();
}

renderFooter();

const DEFAULT_REGISTER_URL = "https://luma.com/CivicTechBramptonEvents";

function toggleRegisterUrlRequired() {
  const hidden = document.getElementById("admin-register-hidden").checked;
  const urlGroup = document.getElementById("register-settings-url-group");
  const urlDesc = document.getElementById("register-url-desc");
  if (hidden) {
    urlGroup.style.display = "none";
    urlDesc.style.display = "none";
    document.getElementById("admin-register-url").classList.remove("input-error");
  } else {
    urlGroup.style.display = "";
    urlDesc.style.display = "";
  }
}

function renderRegisterButton() {
  const btn = document.getElementById("nav-register-btn");
  const isHidden = localStorage.getItem("registerHidden") === "true";
  const savedUrl = localStorage.getItem("registerUrl");

  if (isAdminMode) {
    btn.style.display = "";
    btn.textContent = "Edit Registration";
    btn.removeAttribute("href");
    btn.removeAttribute("target");
    btn.removeAttribute("rel");
    btn.onclick = (e) => {
      e.preventDefault();
      openRegisterSettings();
    };
  } else if (isHidden) {
    btn.style.display = "none";
  } else {
    btn.style.display = "";
    btn.textContent = "Register";
    btn.href = savedUrl || DEFAULT_REGISTER_URL;
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
    btn.onclick = null;
  }
}

function openRegisterSettings() {
  const input = document.getElementById("admin-register-url");
  const checkbox = document.getElementById("admin-register-hidden");
  input.value = localStorage.getItem("registerUrl") || DEFAULT_REGISTER_URL;
  input.classList.remove("input-error");
  checkbox.checked = localStorage.getItem("registerHidden") === "true";
  toggleRegisterUrlRequired();
  document.getElementById("register-settings-modal").showModal();
}

function saveRegisterSettings() {
  const input = document.getElementById("admin-register-url");
  const checkbox = document.getElementById("admin-register-hidden");
  const hidden = checkbox.checked;
  const val = input.value.trim();

  if (!hidden && !val) {
    input.classList.add("input-error");
    input.focus();
    return;
  }

  if (hidden) {
    localStorage.setItem("registerHidden", "true");
    localStorage.removeItem("registerUrl");
  } else {
    localStorage.setItem("registerHidden", "false");
    localStorage.setItem("registerUrl", val);
  }

  input.classList.remove("input-error");
  document.getElementById("register-settings-modal").close();
  renderRegisterButton();
  showToast("Registration link saved!");
}

renderRegisterButton();

document.getElementById("admin-register-url").addEventListener("input", (e) => {
  e.target.classList.remove("input-error");
});

document.getElementById("admin-register-hidden").addEventListener("change", () => {
  toggleRegisterUrlRequired();
  document.getElementById("admin-register-url").classList.remove("input-error");
});

function renderProjects() {
  const projectsGrid = document.getElementById("projects-grid");
  projectsGrid.innerHTML = projectsData
    .map((p) => {
      const mentors = p.mentors || [];
      const mentorImages = mentors
        .filter((m) => m.image)
        .slice(0, 4)
        .map((m) => `<img src="${m.image}" class="speaker-thumb">`)
        .join("");
      const mentorNames = mentors.map((m) => m.name).join(", ");

      const contributors = p.contributors || [];
      const contributorNames = contributors.map((c) => c.name).join(", ");

      return `
        <div class="card event-card" data-status="${p.status || "Active"}" onclick="${
          isAdminMode ? `editProject(${p.id})` : `viewProjectDetails(${p.id})`
        }">
          ${p.image ? `<img src="${p.image}" class="hero" />` : ""}
          <h3>${p.title}</h3>
          <div class="event-date">📅 Since ${p.date}</div>
          <div class="project-card-meta" style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;margin:0.75rem 0;">
            <span class="project-status-badge" data-status="${p.status || "Active"}">${p.status || "Active"}</span>
          </div>
          <p class="event-preview">${p.desc}</p>
          <div class="project-links" style="display:flex;gap:0.75rem;align-items:center;margin-bottom:0.75rem;">
            ${p.github ? `<a href="${p.github}" target="_blank" rel="noreferrer" title="GitHub" onclick="event.stopPropagation();"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.09c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg><span>GitHub</span></a>` : ""}
            ${p.website ? `<a href="${p.website}" target="_blank" rel="noreferrer" title="Website" onclick="event.stopPropagation();"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4c2.5 2.5 3.2 5.5 3.2 8s-0.7 5.5-3.2 8"></path><path d="M12 4c-2.5 2.5-3.2 5.5-3.2 8s0.7 5.5 3.2 8"></path><path d="M8 6c2 1.5 4 1.5 8 0"></path><path d="M8 18c2-1.5 4-1.5 8 0"></path></svg><span>Website</span></a>` : ""}
          </div>
          <div class="speaker-preview" style="display:flex;align-items:center;gap:0.75rem;margin-top:0.75rem;">
            ${mentorImages ? `<div style="display:flex;align-items:center;gap:0.5rem;"><span style="font-weight:700;">Mentors:</span><div style="display:flex;gap:0.35rem;">${mentorImages}</div></div>` : mentorNames ? `<span>Mentors: ${mentorNames}</span>` : ""}
          </div>
          <div class="speaker-preview" style="margin-top: 0.75rem;">
            ${contributorNames ? `<span>Contributors: ${contributorNames}</span>` : ""}
          </div>
          ${
            isAdminMode
              ? `<div class="admin-controls" onclick="event.stopPropagation();" style="margin-top: 1.5rem;"><button class="btn btn-small btn-edit" onclick="event.stopPropagation(); editProject(${p.id})">Edit</button><button class="btn btn-small btn-delete" onclick="event.stopPropagation(); deleteProject(${p.id})">Delete</button></div>`
              : ""
          }
        </div>`;
    })
    .join("");
}

document.getElementById("add-project-btn").onclick = () => {
  currentProjectEditId = null;
  document.getElementById("project-form").reset();
  document.getElementById("project-date").value = "";
  ["project-title", "project-date", "project-desc"].forEach((id) => {
    document.getElementById(id)?.classList.remove("input-error");
  });
  projectImagePreview.style.display = "none";
  projectImagePreview.src = "";
  setProjectImageState(false);
  document.getElementById("mentors-container").innerHTML = "";
  document.getElementById("contributors-container").innerHTML = "";
  tempFiles.projectHero = null;
  tempFiles.projectHeroRemoved = false;
  tempFiles.mentors = {};
  tempFiles.contributors = {};
  document.getElementById("project-modal").showModal();
};

async function saveProject(e) {
  e.preventDefault();

  const requiredFieldIds = ["project-title", "project-date", "project-desc"];
  requiredFieldIds.forEach((id) => {
    document.getElementById(id)?.classList.remove("input-error");
  });
  const missingField = requiredFieldIds.find((id) => {
    const field = document.getElementById(id);
    return !field || !field.value.trim();
  });
  if (missingField) {
    requiredFieldIds.forEach((id) => {
      const field = document.getElementById(id);
      if (field && !field.value.trim()) field.classList.add("input-error");
    });
    document.getElementById(missingField)?.focus();
    return;
  }

  document.querySelectorAll(".mentor-item .mentor-name, .contributor-item .contributor-name").forEach((el) => el.classList.remove("input-error"));
  const emptyPersonName = [...document.querySelectorAll(".mentor-item .mentor-name, .contributor-item .contributor-name")].find((el) => !el.value.trim());
  if (emptyPersonName) {
    document.querySelectorAll(".mentor-item .mentor-name, .contributor-item .contributor-name").forEach((el) => {
      if (!el.value.trim()) el.classList.add("input-error");
    });
    emptyPersonName.focus();
    return;
  }

  let finalProjectImage = "";
  const existingProject = projectsData.find(
    (p) => p.id === currentProjectEditId,
  );
  if (tempFiles.projectHero) {
    finalProjectImage = await getFileDataUrl(tempFiles.projectHero);
  } else if (existingProject && !tempFiles.projectHeroRemoved) {
    finalProjectImage = existingProject.image;
  }

  const mentorNodes = document.querySelectorAll(".mentor-item");
  const finalMentors = [];
  for (let node of mentorNodes) {
    const id = node.dataset.id;
    const newImgData = tempFiles.mentors[id]
      ? await getFileDataUrl(tempFiles.mentors[id])
      : null;
    const existImg = node.querySelector(".mentor-existing-img").value;
    finalMentors.push({
      name: node.querySelector(".mentor-name").value,
      role: node.querySelector(".mentor-role").value,
      social: node.querySelector(".mentor-social").value,
      image: newImgData || existImg,
    });
  }

  const contributorNodes = document.querySelectorAll(".contributor-item");
  const finalContributors = [];
  for (let node of contributorNodes) {
    const id = node.dataset.id;
    const newImgData = tempFiles.contributors[id]
      ? await getFileDataUrl(tempFiles.contributors[id])
      : null;
    const existImg = node.querySelector(".contributor-existing-img").value;
    finalContributors.push({
      name: node.querySelector(".contributor-name").value,
      role: node.querySelector(".contributor-role").value,
      image: newImgData || existImg,
    });
  }

  const techStackValue = document
    .getElementById("project-tech-stack")
    .value.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const projectData = {
    id: currentProjectEditId !== null ? currentProjectEditId : Date.now(),
    title: document.getElementById("project-title").value,
    date: formatProjectDateForDisplay(document.getElementById("project-date").value),
    desc: document.getElementById("project-desc").value,
    github: document.getElementById("project-github").value.trim(),
    website: document.getElementById("project-website").value.trim(),
    status: document.getElementById("project-status").value || "Active",
    techStack: techStackValue,
    image: finalProjectImage,
    mentors: finalMentors,
    contributors: finalContributors,
  };

  if (currentProjectEditId !== null) {
    const idx = projectsData.findIndex((p) => p.id === currentProjectEditId);
    projectsData[idx] = projectData;
  } else {
    projectsData.push(projectData);
  }

  localStorage.setItem("projectsData", JSON.stringify(projectsData));
  renderProjects();
  document.getElementById("project-modal").close();
}

function deleteProject(id) {
  if (confirm("Delete this project?")) {
    projectsData = projectsData.filter((p) => p.id !== id);
    localStorage.setItem("projectsData", JSON.stringify(projectsData));
    renderProjects();
  }
}

renderProjects();

// --- EVENT UTILS ---
function handleImageUpload(inputEl, previewEl, fileStoreKey, subId = null) {
  inputEl.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (subId !== null) tempFiles[fileStoreKey][subId] = file;
      else {
        tempFiles[fileStoreKey] = file;
        tempFiles.heroRemoved = false;
      }

      const reader = new FileReader();
      reader.onload = () => {
        previewEl.src = reader.result;
        previewEl.style.display = "block";
        if (inputEl.id === "event-image") setHeroImageState(true);
      };
      reader.readAsDataURL(file);
    }
  });
}

function getFileDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// Main Hero Image handler
handleImageUpload(
  document.getElementById("event-image"),
  document.getElementById("event-image-preview"),
  "hero",
);
handleImageUpload(
  document.getElementById("project-image"),
  document.getElementById("project-image-preview"),
  "projectHero",
);

const eventsGrid = document.getElementById("events-grid");
if (eventsGrid && !document.getElementById("events-actions")) {
  const actionsEl = document.createElement("div");
  actionsEl.id = "events-actions";
  actionsEl.className = "events-actions";
  eventsGrid.insertAdjacentElement("afterend", actionsEl);
}

function toggleEventViewMore() {
  showAllEvents = !showAllEvents;
  renderEvents();
}

function toggleUpcomingViewMore() {
  showAllUpcoming = !showAllUpcoming;
  renderUpcomingEvents();
}

function isUpcoming(dateStr) {
  const eventDate = new Date(dateStr + "T23:59:59");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

function toggleRegisterUrlField(dateStr) {
  const group = document.getElementById("register-url-group");
  if (dateStr && isUpcoming(dateStr)) {
    group.style.display = "";
  } else {
    group.style.display = "none";
    document.getElementById("event-register-url").value = "";
  }
}

function dateChangeHandler() {
  toggleRegisterUrlField(document.getElementById("event-date").value);
}

// --- UPCOMING EVENTS VIEW ---
function renderUpcomingEvents() {
  const upcomingGridEl = document.getElementById("upcoming-grid");
  const upcomingEmptyEl = document.getElementById("upcoming-empty");
  const upcomingEvents = eventsData.filter((e) => isUpcoming(e.date));
  const visibleEvents = showAllUpcoming
    ? upcomingEvents
    : upcomingEvents.slice(0, 8);

  if (upcomingEmptyEl) {
    upcomingEmptyEl.style.display =
      upcomingEvents.length === 0 ? "block" : "none";
  }

  const existingActions = document.getElementById("upcoming-actions");
  if (existingActions) {
    if (upcomingEvents.length > 8) {
      existingActions.innerHTML = `
        <button class="btn btn-view-more" onclick="toggleUpcomingViewMore()">
          ${showAllUpcoming ? "View Less" : "View More"}
        </button>
      `;
    } else {
      existingActions.innerHTML = "";
    }
  }

  upcomingGridEl.innerHTML = visibleEvents
    .map((e) => {
      const speakers = e.speakers || [];
      const allSpeakersHaveImages =
        speakers.length > 0 && speakers.every((s) => s.image);
      const speakerImages = allSpeakersHaveImages
        ? speakers
            .slice(0, 4)
            .map((s) => `<img src="${s.image}" class="speaker-thumb">`)
            .join("")
        : "";

      const speakerNames = speakers.map((s) => s.name).join(", ");

      return `
        <div class="card event-card" onclick="${
          isAdminMode ? `editEvent(${e.id})` : `if(!event.target.closest('.luma-checkout--button'))viewEventDetails(${e.id})`
        }">
          ${e.image ? `<img src="${e.image}" class="hero" />` : ""}
          <h3>${e.title}</h3>
          <div class="event-date">📅 ${e.date}</div>
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem; font-weight: 500;">📍 ${truncateAddress(e.location)}</div>
          <p class="event-preview">${e.desc}</p>
          <div class="speaker-preview" style="display:flex;align-items:center;gap:0.75rem;margin-top:0.75rem;">
            ${speakerImages ? `<div style="display:flex;align-items:center;gap:0.5rem;"><span style="font-weight:700;">Speakers:</span><div style="display:flex;gap:0.35rem;">${speakerImages}</div></div>` : speakerNames ? `<span>Speakers: ${speakerNames}</span>` : ""}
          </div>
          ${e.registerUrl && !isAdminMode ? (e.lumaEventId ? `<button class="luma-checkout--button" data-luma-action="checkout" data-luma-event-id="${e.lumaEventId}" style="margin-top: 1rem; width: 100%; border-radius: 999px;">Register</button>` : `<a href="${e.registerUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-register" onclick="event.stopPropagation();" style="margin-top: 1rem; width: 100%; text-align: center; border-radius: 999px; text-decoration: none;">Register</a>`) : ""}
          ${
            isAdminMode
              ? `<div class="admin-controls" onclick="event.stopPropagation()">
                  <button class="btn btn-small btn-edit" onclick="editEvent(${e.id})">Edit</button>
                  <button class="btn btn-small btn-delete" onclick="deleteEvent(${e.id})">Delete</button>
                </div>`
              : ""
          }
        </div>
      `;
    })
    .join("");
}

// --- EVENT VIEW (Matches Luma Split Layout) ---
function renderEvents() {
  const eventsGridEl = document.getElementById("events-grid");
  const eventsActionsEl = document.getElementById("events-actions");
  const pastEvents = eventsData.filter((e) => !isUpcoming(e.date));
  const visibleEvents = showAllEvents ? pastEvents : pastEvents.slice(0, 8);

  if (eventsActionsEl) {
    if (pastEvents.length > 8) {
      eventsActionsEl.innerHTML = `
        <button class="btn btn-view-more" onclick="toggleEventViewMore()">
          ${showAllEvents ? "View Less" : "View More"}
        </button>
      `;
    } else {
      eventsActionsEl.innerHTML = "";
    }
  }

  eventsGridEl.innerHTML = visibleEvents
    .map((e) => {
      const speakers = e.speakers || [];
      const allSpeakersHaveImages =
        speakers.length > 0 && speakers.every((s) => s.image);
      const speakerImages = allSpeakersHaveImages
        ? speakers
            .slice(0, 4)
            .map((s) => `<img src="${s.image}" class="speaker-thumb">`)
            .join("")
        : "";

      const speakerNames = speakers.map((s) => s.name).join(", ");

      // Reordered: Hero Image -> Title -> Date -> Location -> Description Preview
      return `
        <div class="card event-card" onclick="${
          isAdminMode ? `editEvent(${e.id})` : `viewEventDetails(${e.id})`
        }">
          ${e.image ? `<img src="${e.image}" class="hero" />` : ""}
          <h3>${e.title}</h3>
          <div class="event-date">📅 ${e.date}</div>
          <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.75rem; font-weight: 500;">📍 ${truncateAddress(e.location)}</div>
          <p class="event-preview">${e.desc}</p>
          <div class="speaker-preview" style="display:flex;align-items:center;gap:0.75rem;margin-top:0.75rem;">
            ${speakerImages ? `<div style="display:flex;align-items:center;gap:0.5rem;"><span style="font-weight:700;">Speakers:</span><div style="display:flex;gap:0.35rem;">${speakerImages}</div></div>` : speakerNames ? `<span>Speakers: ${speakerNames}</span>` : ""}
          </div>
          ${
            isAdminMode
              ? `<div class="admin-controls" onclick="event.stopPropagation()">
                  <button class="btn btn-small btn-edit" onclick="editEvent(${e.id})">Edit</button>
                  <button class="btn btn-small btn-delete" onclick="deleteEvent(${e.id})">Delete</button>
                </div>`
              : ""
          }
        </div>
      `;
    })
    .join("");
}

function viewEventDetails(id) {
  const ev = eventsData.find((e) => e.id === id);
  if (!ev) return;

  // Split Meta-Box items separating Date, Time Range, and Location rows clearly
  let leftHtml = `
    ${ev.image ? `<img src="${ev.image}" class="view-hero" />` : ""}
    
    <h1 class="luma-title">${ev.title}</h1>
    
    <div class="luma-meta-box">
      <!-- Date Entry Row -->
      <div class="luma-meta-item">
        <div class="luma-meta-icon">📅</div>
        <div>
          <div class="luma-meta-title">Date</div>
          <div class="luma-meta-subtitle">${ev.date}</div>
        </div>
      </div>

      <!-- Separated Time Range Row -->
      <div class="luma-meta-item">
        <div class="luma-meta-icon">⏰</div>
        <div>
          <div class="luma-meta-title">Time</div>
          <div class="luma-meta-subtitle">${ev.time}</div>
        </div>
      </div>
      
      <!-- Location Entry Row -->
      <div class="luma-meta-item">
        <div class="luma-meta-icon">📍</div>
        <div>
          <div class="luma-meta-title">Location</div>
          <div class="luma-meta-subtitle">${ev.location}</div>
          ${ev.locationDetails ? `<div class="location-details-note">${ev.locationDetails}</div>` : ""}
        </div>
      </div>
    </div>

    <div id="detail-map"></div>

    <div style="margin-top: 1rem;">
      <h3 class="luma-section-heading">About Event</h3>
      <div class="view-text">${ev.desc.replace(/\n/g, "<br/>")}</div>
    </div>
    ${
      ev.agenda
        ? `
    <div style="margin-top: 1rem;">
      <h3 class="luma-section-heading">Agenda</h3>
      <ul class="agenda-list">
        ${ev.agenda
          .split(",")
          .map((item) => {
            const trimmed = item.trim();
            const match = trimmed.match(
              /^([\d:]+(?:\s*(?:to|-)\s*[\d:]+)?(?:\s*(?:AM|PM|am|pm))?)\s*(.*)/,
            );
            if (match) {
              return `<li><span class="agenda-time">${match[1]}</span> ${match[2]}</li>`;
            }
            return `<li>${trimmed}</li>`;
          })
          .join("")}
      </ul>
    </div>
    `
        : ""
    }
    ${
      ev.registerUrl && isUpcoming(ev)
        ? `<div style="margin-top: 1.5rem;">${ev.lumaEventId ? `<button class="luma-checkout--button" data-luma-action="checkout" data-luma-event-id="${ev.lumaEventId}" style="width: 100%; border-radius: 999px;">Register</button>` : `<a href="${ev.registerUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="width: 100%; text-align: center; border-radius: 999px; text-decoration: none;">Register</a>`}</div>`
        : ""
    }
  `;

  // Right Column Content: Preserving your Speakers and Volunteers setup
  let rightHtml = ``;

  if (ev.speakers && ev.speakers.length > 0) {
    rightHtml += `<h3 class="luma-section-heading">Speakers</h3>`;
    ev.speakers.forEach((s) => {
      rightHtml += `
        <div class="view-person">
          <img src="${s.image || avatarUrl(s.name)}"/>
          <div>
            <h4 style="color:var(--text-main); font-weight:600;">${s.name}</h4>
            <p>${s.role || "Special Guest Speaker"}</p>
            ${s.social ? `<a href="${s.social}" target="_blank">Contact</a>` : ""}
          </div>
        </div>
      `;
    });
  }

  if (ev.volunteers && ev.volunteers.length > 0) {
    if (ev.speakers && ev.speakers.length > 0) {
      rightHtml += `<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;" />`;
    }
    rightHtml += `<h3 class="luma-section-heading">Volunteers</h3>`;
    ev.volunteers.forEach((v) => {
      rightHtml += `
        <div class="view-person">
          <img src="${v.image || avatarUrl(v.name)}"/>
          <div>
            <h4 style="color:var(--text-main); font-weight:600;">${v.name}</h4>
            <p>${v.role || "Contributor"}</p>
          </div>
        </div>
      `;
    });
  }

  if (!rightHtml) {
    rightHtml = `
      <h3 class="luma-section-heading">Host</h3>
      <div class="view-person">
        <div style="width:50px; height:50px; border-radius:50%; background:var(--primary-color); color:white; display:flex; align-items:center; justify-content:center; font-weight:bold;">CTB</div>
        <div>
          <h4 style="color:var(--text-main); font-weight:600;">Civic Tech Brampton</h4>
          <p>Community Organizer</p>
        </div>
      </div>
    `;
  }

  document.getElementById("detail-content").innerHTML = `
    <div class="left-col">${leftHtml}</div>
    <div class="right-col">${rightHtml}</div>
  `;
  document.getElementById("event-details-modal").showModal();
  renderDetailMap(ev);
}

// --- DYNAMIC FORM FIELDS (Speakers & Volunteers) ---
let speakerCount = 0;
let volunteerCount = 0;

function updateScrollableList(containerId) {
  // Removed inner scrolling for event speaker/volunteer lists.
  // Let the modal body handle overflow instead.
  return;
}

function removePersonCard(button) {
  const card = button.closest(".person-card");
  if (!card) return;
  const container = card.parentElement;
  card.remove();
  if (container && container.id) updateScrollableList(container.id);
}

function addSpeakerForm(data = null) {
  speakerCount++;
  const id = speakerCount;
  const container = document.createElement("div");
  container.className = "person-card speaker-item";
  container.dataset.id = id;

  container.innerHTML = `
    <button type="button" class="remove-btn" onclick="removePersonCard(this)">Remove</button>
    <div class="upload-box circle-upload">
      <span>+ IMG</span>
      <input type="file" id="spk-file-${id}" accept="image/*" />
      <img id="spk-preview-${id}" ${data && data.image ? `src="${data.image}" style="display:block"` : ""} />
    </div>
    <div class="form-group">
      <label>Name</label>
      <input type="text" class="spk-name" placeholder="Full name..." value="${data ? data.name : ""}" />
    </div>
    <div class="form-group">
      <label>Role</label>
      <input type="text" class="spk-role" placeholder="Role/Affiliation..." value="${data ? data.role : ""}" />
    </div>
    <div class="form-group">
      <label>Social Profile URL</label>
      <input type="url" class="spk-social" placeholder="https://..." value="${(data && data.social) ? data.social : ""}" />
    </div>
    <input type="hidden" class="spk-existing-img" value="${data && data.image ? data.image : ""}">
  `;
  document.getElementById("speakers-container").appendChild(container);
  handleImageUpload(
    container.querySelector(`#spk-file-${id}`),
    container.querySelector(`#spk-preview-${id}`),
    "speakers",
    id,
  );
  updateScrollableList("speakers-container");
  container.scrollIntoView({ behavior: "smooth", block: "end" });
}

function addVolunteerForm(data = null) {
  volunteerCount++;
  const id = volunteerCount;
  const container = document.createElement("div");
  container.className = "person-card volunteer-item";
  container.dataset.id = id;

  container.innerHTML = `
    <button type="button" class="remove-btn" onclick="removePersonCard(this)">Remove</button>
    <div class="upload-box circle-upload">
      <span>+ IMG</span>
      <input type="file" id="vol-file-${id}" accept="image/*" />
      <img id="vol-preview-${id}" ${data && data.image ? `src="${data.image}" style="display:block"` : ""} />
    </div>
    <div class="form-group">
      <label>Name</label>
      <input type="text" class="vol-name" placeholder="Full name..." value="${data ? data.name : ""}" />
    </div>
    <div class="form-group">
      <label>Role</label>
      <input type="text" class="vol-role" placeholder="Task or contribution..." value="${data ? data.role : ""}" />
    </div>
    <input type="hidden" class="vol-existing-img" value="${data && data.image ? data.image : ""}">
  `;
  document.getElementById("volunteers-container").appendChild(container);
  handleImageUpload(
    container.querySelector(`#vol-file-${id}`),
    container.querySelector(`#vol-preview-${id}`),
    "volunteers",
    id,
  );
  updateScrollableList("volunteers-container");
  container.scrollIntoView({ behavior: "smooth", block: "end" });
}

function addMentorForm(data = null) {
  speakerCount++;
  const id = speakerCount;
  const container = document.createElement("div");
  container.className = "person-card mentor-item";
  container.dataset.id = id;

  container.innerHTML = `
    <button type="button" class="remove-btn" onclick="removePersonCard(this)">Remove</button>
    <div class="upload-box circle-upload">
      <span>+ IMG</span>
      <input type="file" id="mentor-file-${id}" accept="image/*" />
      <img id="mentor-preview-${id}" ${data && data.image ? `src="${data.image}" style="display:block"` : ""} />
    </div>
    <div class="form-group">
      <label>Name</label>
      <input type="text" class="mentor-name" placeholder="Full name..." value="${data ? data.name : ""}" />
    </div>
    <div class="form-group">
      <label>Role</label>
      <input type="text" class="mentor-role" placeholder="Role/Affiliation..." value="${data ? data.role : ""}" />
    </div>
    <div class="form-group">
      <label>Social Profile URL</label>
      <input type="url" class="mentor-social" placeholder="https://..." value="${(data && data.social) ? data.social : ""}" />
    </div>
    <input type="hidden" class="mentor-existing-img" value="${data && data.image ? data.image : ""}">
  `;
  document.getElementById("mentors-container").appendChild(container);
  handleImageUpload(
    container.querySelector(`#mentor-file-${id}`),
    container.querySelector(`#mentor-preview-${id}`),
    "mentors",
    id,
  );
  updateScrollableList("mentors-container");
  container.scrollIntoView({ behavior: "smooth", block: "end" });
}

function addContributorForm(data = null) {
  volunteerCount++;
  const id = volunteerCount;
  const container = document.createElement("div");
  container.className = "person-card contributor-item";
  container.dataset.id = id;

  container.innerHTML = `
    <button type="button" class="remove-btn" onclick="removePersonCard(this)">Remove</button>
    <div class="upload-box circle-upload">
      <span>+ IMG</span>
      <input type="file" id="contributor-file-${id}" accept="image/*" />
      <img id="contributor-preview-${id}" ${data && data.image ? `src="${data.image}" style="display:block"` : ""} />
    </div>
    <div class="form-group">
      <label>Name</label>
      <input type="text" class="contributor-name" placeholder="Full name..." value="${data ? data.name : ""}" />
    </div>
    <div class="form-group">
      <label>Role</label>
      <input type="text" class="contributor-role" placeholder="Task or contribution..." value="${data ? data.role : ""}" />
    </div>
    <input type="hidden" class="contributor-existing-img" value="${data && data.image ? data.image : ""}">
  `;
  document.getElementById("contributors-container").appendChild(container);
  handleImageUpload(
    container.querySelector(`#contributor-file-${id}`),
    container.querySelector(`#contributor-preview-${id}`),
    "contributors",
    id,
  );
  updateScrollableList("contributors-container");
  container.scrollIntoView({ behavior: "smooth", block: "end" });
}

// --- EDIT / SAVE EVENT ---
document.getElementById("add-event-btn-upcoming").onclick = () => {
  openAddEventModal();
};

function openAddEventModal() {
  currentEventEditId = null;
  document.getElementById("event-form").reset();
  document.getElementById("event-start-time").value = "";
  document.getElementById("event-end-time").value = "";
  document.getElementById("event-register-url").value = "";
  document.getElementById("event-location-details").value = "";
  selectedLocationLat = null;
  selectedLocationLng = null;
  document.getElementById("register-url-group").style.display = "none";
  const dateInput = document.getElementById("event-date");
  dateInput.removeEventListener("change", dateChangeHandler);
  dateInput.addEventListener("change", dateChangeHandler);
  eventImagePreview.style.display = "none";
  eventImagePreview.src = "";
  setHeroImageState(false);
  document.getElementById("speakers-container").innerHTML = "";
  document.getElementById("volunteers-container").innerHTML = "";
  ["event-title", "event-date", "event-start-time", "event-desc", "event-location"].forEach((id) => {
    document.getElementById(id)?.classList.remove("input-error");
  });
  tempFiles = {
    hero: null,
    heroRemoved: false,
    speakers: {},
    volunteers: {},
  };
  document.getElementById("event-modal").showModal();
}

function editEvent(id) {
  const ev = eventsData.find((e) => e.id === id);
  if (!ev) return;
  currentEventEditId = id;
  tempFiles = {
    hero: null,
    heroRemoved: false,
    speakers: {},
    volunteers: {},
  };

  document.getElementById("event-title").value = ev.title;
  document.getElementById("event-date").value = ev.date;
  if (ev.time && ev.time.includes(" - ")) {
    const parts = ev.time.split(" - ");
    document.getElementById("event-start-time").value = to24Hour(parts[0]);
    document.getElementById("event-end-time").value = to24Hour(parts[1]);
  } else {
    document.getElementById("event-start-time").value = to24Hour(ev.time) || "";
    document.getElementById("event-end-time").value = "";
  }
  document.getElementById("event-desc").value = ev.desc;
  document.getElementById("event-agenda").value = ev.agenda || "";
  document.getElementById("event-location").value = ev.location;
  document.getElementById("event-location-details").value =
    ev.locationDetails || "";
  selectedLocationLat = ev.lat || null;
  selectedLocationLng = ev.lng || null;
  document.getElementById("event-register-url").value = ev.registerUrl || "";
  toggleRegisterUrlField(ev.date);

  const dateInput = document.getElementById("event-date");
  dateInput.removeEventListener("change", dateChangeHandler);
  dateInput.addEventListener("change", dateChangeHandler);

  if (ev.image) {
    eventImagePreview.src = ev.image;
    eventImagePreview.style.display = "block";
    setHeroImageState(true);
  } else {
    eventImagePreview.src = "";
    eventImagePreview.style.display = "none";
    setHeroImageState(false);
  }

  document.getElementById("speakers-container").innerHTML = "";
  document.getElementById("volunteers-container").innerHTML = "";

  if (ev.speakers) ev.speakers.forEach((s) => addSpeakerForm(s));
  if (ev.volunteers) ev.volunteers.forEach((v) => addVolunteerForm(v));
  updateScrollableList("speakers-container");
  updateScrollableList("volunteers-container");

  document.getElementById("event-modal").showModal();
}

function editProject(id) {
  const p = projectsData.find((project) => project.id === id);
  if (!p) return;

  currentProjectEditId = id;
  document.getElementById("project-form").reset();
  ["project-title", "project-date", "project-desc"].forEach((id) => {
    document.getElementById(id)?.classList.remove("input-error");
  });
  document.getElementById("project-title").value = p.title;
  document.getElementById("project-date").value = formatProjectDateForInput(p.date);
  document.getElementById("project-desc").value = p.desc;
  document.getElementById("mentors-container").innerHTML = "";
  document.getElementById("contributors-container").innerHTML = "";
  tempFiles.projectHero = null;
  tempFiles.projectHeroRemoved = false;
  tempFiles.mentors = {};
  tempFiles.contributors = {};

  if (p.image) {
    projectImagePreview.src = p.image;
    projectImagePreview.style.display = "block";
    setProjectImageState(true);
  } else {
    projectImagePreview.src = "";
    projectImagePreview.style.display = "none";
    setProjectImageState(false);
  }

  document.getElementById("project-github").value = p.github || "";
  document.getElementById("project-website").value = p.website || "";
  document.getElementById("project-status").value = p.status || "Active";
  document.getElementById("project-tech-stack").value = (
    p.techStack || []
  ).join(", ");

  if (p.mentors) p.mentors.forEach((m) => addMentorForm(m));
  if (p.contributors) p.contributors.forEach((c) => addContributorForm(c));
  document.getElementById("project-modal").showModal();
}

function viewProjectDetails(id) {
  const p = projectsData.find((project) => project.id === id);
  if (!p) return;

  let leftHtml = `
    ${p.image ? `<img src="${p.image}" class="view-hero" />` : ""}
    <h1 class="luma-title">${p.title}</h1>
    <div class="luma-meta-box">
      <div class="luma-meta-item">
        <div class="luma-meta-icon">📅</div>
        <div>
          <div class="luma-meta-title">Since</div>
          <div class="luma-meta-subtitle">${p.date}</div>
        </div>
      </div>
      <div class="luma-meta-item" style="margin-top:1rem;">
        <div class="luma-meta-icon">🏷️</div>
        <div>
          <div class="luma-meta-title">Status</div>
          <div class="luma-meta-subtitle">${p.status || "Active"}</div>
        </div>
      </div>
      ${p.techStack && p.techStack.length > 0 ? `<div style="margin-top:1rem;"><div class="luma-meta-title">Tech Stack</div><div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.75rem;">${p.techStack.map((tech) => `<span class="project-tag">${tech}</span>`).join("")}</div></div>` : ""}
    </div>
    <div style="margin-top: 1rem;">
      <h3 class="luma-section-heading">Overview</h3>
      <div class="view-text">${p.desc.replace(/\n/g, "<br/>")}</div>
      <div class="project-links" style="display:flex;gap:0.75rem;align-items:center;margin-top:1rem;">
        ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" title="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.09c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg><span>GitHub</span></a>` : ""}
        ${p.website ? `<a href="${p.website}" target="_blank" rel="noopener noreferrer" title="Website"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4c2.5 2.5 3.2 5.5 3.2 8s-0.7 5.5-3.2 8"></path><path d="M12 4c-2.5 2.5-3.2 5.5-3.2 8s0.7 5.5 3.2 8"></path><path d="M8 6c2 1.5 4 1.5 8 0"></path><path d="M8 18c2-1.5 4-1.5 8 0"></path></svg><span>Website</span></a>` : ""}
      </div>
    </div>
  `;

  let rightHtml = "";
  if (p.mentors && p.mentors.length > 0) {
    rightHtml += `<h3 class="luma-section-heading">Mentors</h3>`;
    p.mentors.forEach((m) => {
      rightHtml += `
        <div class="view-person">
          <img src="${m.image || avatarUrl(m.name)}"/>
          <div>
            <h4 style="color:var(--text-main); font-weight:600;">${m.name}</h4>
            <p>${m.role || "Mentor"}</p>
            ${m.social ? `<a href="${m.social}" target="_blank">Contact</a>` : ""}
          </div>
        </div>
      `;
    });
  }

  if (p.contributors && p.contributors.length > 0) {
    if (p.mentors && p.mentors.length > 0) {
      rightHtml += `<hr style="border:0;border-top:1px solid var(--border-color);margin:1.5rem 0;"/>`;
    }
    rightHtml += `<h3 class="luma-section-heading">Contributors</h3>`;
    p.contributors.forEach((c) => {
      rightHtml += `
        <div class="view-person">
          <img src="${c.image || avatarUrl(c.name)}"/>
          <div>
            <h4 style="color:var(--text-main); font-weight:600;">${c.name}</h4>
            <p>${c.role || "Contributor"}</p>
          </div>
        </div>
      `;
    });
  }

  if (!rightHtml) {
    rightHtml = `
      <h3 class="luma-section-heading">Project Team</h3>
      <div class="view-person">
        <div style="width:54px;height:54px;border-radius:50%;background:var(--primary-color);color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;">CTB</div>
        <div>
          <h4 style="color:var(--text-main); font-weight:600;">Civic Tech Brampton</h4>
          <p>Project Lead</p>
        </div>
      </div>
    `;
  }

  document.getElementById("project-detail-content").innerHTML = `
    <div class="left-col">${leftHtml}</div>
    <div class="right-col">${rightHtml}</div>
  `;
  document.getElementById("project-details-modal").showModal();
}

async function saveEvent(e) {
  e.preventDefault();

  const requiredFieldIds = [
    "event-title",
    "event-date",
    "event-start-time",
    "event-desc",
    "event-location",
  ];
  requiredFieldIds.forEach((id) => {
    document.getElementById(id)?.classList.remove("input-error");
  });
  const missingField = requiredFieldIds.find((id) => {
    const field = document.getElementById(id);
    return !field || !field.value.trim();
  });
  if (missingField) {
    requiredFieldIds.forEach((id) => {
      const field = document.getElementById(id);
      if (field && !field.value.trim()) field.classList.add("input-error");
    });
    document.getElementById(missingField)?.focus();
    return;
  }

  document.querySelectorAll(".speaker-item .spk-name, .volunteer-item .vol-name").forEach((el) => el.classList.remove("input-error"));
  const emptyPersonName = [...document.querySelectorAll(".speaker-item .spk-name, .volunteer-item .vol-name")].find((el) => !el.value.trim());
  if (emptyPersonName) {
    document.querySelectorAll(".speaker-item .spk-name, .volunteer-item .vol-name").forEach((el) => {
      if (!el.value.trim()) el.classList.add("input-error");
    });
    emptyPersonName.focus();
    return;
  }

  let finalHeroImage = "";
  const existingEvent = eventsData.find((ev) => ev.id === currentEventEditId);
  if (tempFiles.hero) {
    finalHeroImage = await getFileDataUrl(tempFiles.hero);
  } else if (existingEvent && !tempFiles.heroRemoved) {
    finalHeroImage = existingEvent.image;
  }

  const speakerNodes = document.querySelectorAll(".speaker-item");
  let finalSpeakers = [];
  for (let node of speakerNodes) {
    let id = node.dataset.id;
    let newImgData = tempFiles.speakers[id]
      ? await getFileDataUrl(tempFiles.speakers[id])
      : null;
    let existImg = node.querySelector(".spk-existing-img").value;

    finalSpeakers.push({
      name: node.querySelector(".spk-name").value,
      role: node.querySelector(".spk-role").value,
      social: node.querySelector(".spk-social").value,
      image: newImgData || existImg,
    });
  }

  const volNodes = document.querySelectorAll(".volunteer-item");
  let finalVolunteers = [];
  for (let node of volNodes) {
    let id = node.dataset.id;
    let newImgData = tempFiles.volunteers[id]
      ? await getFileDataUrl(tempFiles.volunteers[id])
      : null;
    let existImg = node.querySelector(".vol-existing-img").value;

    finalVolunteers.push({
      name: node.querySelector(".vol-name").value,
      role: node.querySelector(".vol-role").value,
      image: newImgData || existImg,
    });
  }

  const newEvent = {
    id: currentEventEditId !== null ? currentEventEditId : Date.now(),
    title: document.getElementById("event-title").value,
    date: document.getElementById("event-date").value,
    time: `${to12Hour(document.getElementById("event-start-time").value)} - ${to12Hour(document.getElementById("event-end-time").value)}`,
    desc: document.getElementById("event-desc").value,
    agenda: document.getElementById("event-agenda").value,
    location: document.getElementById("event-location").value,
    locationDetails: document.getElementById("event-location-details").value,
    lat: selectedLocationLat,
    lng: selectedLocationLng,
    registerUrl: document.getElementById("event-register-url").value.trim(),
    image: finalHeroImage,
    speakers: finalSpeakers,
    volunteers: finalVolunteers,
  };

  if (currentEventEditId !== null) {
    const idx = eventsData.findIndex((ev) => ev.id === currentEventEditId);
    eventsData[idx] = newEvent;
  } else {
    eventsData.push(newEvent);
  }

  saveToLocalStorage();
  renderEvents();
  renderUpcomingEvents();
  document.getElementById("event-modal").close();
}

function deleteEvent(id) {
  if (confirm("Delete this event?")) {
    eventsData = eventsData.filter((e) => e.id !== id);
    saveToLocalStorage();
    renderEvents();
    renderUpcomingEvents();
  }
}

renderEvents();
renderUpcomingEvents();
window.luma && window.luma.initCheckout();

function initLumaCheckout() {
  if (window.luma && window.luma.initCheckout) window.luma.initCheckout();
}
["events-grid", "upcoming-events-grid", "detail-content"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) new MutationObserver(() => initLumaCheckout()).observe(el, { childList: true });
});

["event-title", "event-date", "event-start-time", "event-desc", "event-location"].forEach((id) => {
  document.getElementById(id)?.addEventListener("input", (e) => {
    e.target.classList.remove("input-error");
  });
});

["project-title", "project-date", "project-desc"].forEach((id) => {
  document.getElementById(id)?.addEventListener("input", (e) => {
    e.target.classList.remove("input-error");
  });
});

["speakers-container", "volunteers-container", "mentors-container", "contributors-container"].forEach((containerId) => {
  document.getElementById(containerId)?.addEventListener("input", (e) => {
    if (e.target.classList.contains("spk-name") || e.target.classList.contains("vol-name") || e.target.classList.contains("mentor-name") || e.target.classList.contains("contributor-name")) {
      e.target.classList.remove("input-error");
    }
  });
});

// --- LOCATION: TRUNCATE ADDRESS TO POSTAL CODE ---
function truncateAddress(loc) {
  if (!loc) return "";
  const match = loc.match(/^(.+?\b[A-Z]\d[A-Z]\s?\d[A-Z]\d)\b/);
  if (match) return match[1];
  const parts = loc.split(",");
  if (parts.length >= 3) return parts.slice(0, 3).join(",").trim();
  return loc;
}

// --- LOCATION: GEOCODING AUTOCOMPLETE ---
let locationGeocodeTimer = null;
let selectedLocationLat = null;
let selectedLocationLng = null;

const locationInput = document.getElementById("event-location");
const locationAutocomplete = document.getElementById("location-autocomplete");

if (locationInput && locationAutocomplete) {
  locationInput.addEventListener("input", () => {
    clearTimeout(locationGeocodeTimer);
    const query = locationInput.value.trim();
    if (query.length < 3) {
      locationAutocomplete.classList.remove("active");
      locationAutocomplete.innerHTML = "";
      return;
    }
    locationGeocodeTimer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
          { headers: { "User-Agent": "CivicTechBramptonPrototype/1.0" } },
        );
        const results = await res.json();
        if (results.length === 0) {
          locationAutocomplete.classList.remove("active");
          return;
        }
        locationAutocomplete.innerHTML = results
          .map(
            (r, i) =>
              `<div class="location-autocomplete-item" data-index="${i}">
                <div class="ac-main">${r.display_name.split(",")[0]}</div>
                <div class="ac-sub">${r.display_name}</div>
              </div>`,
          )
          .join("");
        locationAutocomplete._results = results;
        locationAutocomplete.classList.add("active");
      } catch (err) {
        console.warn("Geocoding failed:", err);
      }
    }, 400);
  });

  locationAutocomplete.addEventListener("click", (e) => {
    const item = e.target.closest(".location-autocomplete-item");
    if (!item) return;
    const idx = parseInt(item.dataset.index);
    const result = locationAutocomplete._results[idx];
    locationInput.value = result.display_name;
    selectedLocationLat = parseFloat(result.lat);
    selectedLocationLng = parseFloat(result.lon);
    locationAutocomplete.classList.remove("active");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".location-search-wrapper")) {
      locationAutocomplete.classList.remove("active");
    }
  });

  locationInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
}

function showToast(msg, isError) {
  const toast = document.createElement("div");
  toast.className = "toast" + (isError ? " toast-error" : "");
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- LOCATION: GEOCODE EXISTING EVENTS WITHOUT COORDS ---
async function geocodeEventIfNeeded(ev) {
  if (ev.lat && ev.lng) return;
  if (!ev.location) return;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ev.location)}&limit=1`,
      { headers: { "User-Agent": "CivicTechBramptonPrototype/1.0" } },
    );
    const results = await res.json();
    if (results.length > 0) {
      ev.lat = parseFloat(results[0].lat);
      ev.lng = parseFloat(results[0].lon);
    }
  } catch (err) {
    console.warn("Auto-geocode failed:", err);
  }
}

// --- LOCATION: RENDER LEAFLET MAP ---
function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) {
      resolve();
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

async function renderDetailMap(ev) {
  const mapContainer = document.getElementById("detail-map");
  if (!mapContainer) return;
  await geocodeEventIfNeeded(ev);
  if (!ev.lat || !ev.lng) {
    mapContainer.style.display = "none";
    return;
  }
  await loadLeaflet();
  const map = L.map(mapContainer, { scrollWheelZoom: false }).setView(
    [ev.lat, ev.lng],
    16,
  );
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  L.marker([ev.lat, ev.lng]).addTo(map);
  setTimeout(() => map.invalidateSize(), 100);
}
