import { v4 as uuidv4 } from "uuid";
import {
  User,
  UserChat,
  University,
  Event,
  EventPrice,
  EventCategory,
  Chat,
  Message,
  UserEvent,
  Status,
  EventType,
  Collections,
} from "./types";

const data: Collections = {
  Users: [
    {
      id: "1",
      email: "alice@gmail.com",
      password: "password",
      name: "Alice Johnson",
      bio: "Loves coding and coffee.",
      image:
        "https://static.wikia.nocookie.net/disney/images/7/75/Profile_-_Alice.jpeg/revision/latest?cb=20190312054522",
      pronouns: "she/her",
      university: University.UNSW,
      availability: Array(7)
      .fill(null)
      .map(() => Array(24).fill(true)),
      eventNotifications: true,
      messageNotifications: false,
      location: "Sydney",
      privateAccount: false,
      chats: [
        {
          id: "1",
          name: "Tech Conference Chat",
          groupChat: true,
          archived: false,
        },
        {
          id: "2",
          name: "Charity Run",
          groupChat: true,
          archived: false,
        },
        {
          id: "4",
          name: "Film Screening: The Future of AI",
          groupChat: true,
          archived: false,
        },
        {
          id: "5",
          name: "Art Gallery Opening: Abstract Visions",
          groupChat: true,
          archived: true,
        },
        {
          id: "1a",
          name: "",
          groupChat: false,
        },
      ],
      events: [
        {
          id: "1",
          status: Status.GOING,
          type: EventType.RSVP,
        },
        {
          id: "2",
          status: Status.GOING,
          type: EventType.RSVP,
        },
        {
          id: "3",
          status: Status.INTERESTED,
          type: EventType.RSVP,
        },
        {
          id: "4",
          status: Status.GOING,
          type: EventType.CREATED,
        },
        {
          id: "5",
          status: Status.WENT,
          type: EventType.PAST,
        },
      ],
      friends: ["2"],
      interest: [EventCategory.ENTERTAINMENT, EventCategory.TRAVEL],
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@outlook.com",
      password: "password",
      bio: "Avid hiker and gamer.",
      image:
        "https://static.wikia.nocookie.net/btb/images/6/6d/BobSavestheHedgehogs113.png/revision/latest?cb=20230125150319",
      pronouns: "he/him",
      university: University.USYD,
      availability: Array(7)
      .fill(null)
      .map(() => Array(24).fill(true)),
      eventNotifications: true,
      messageNotifications: true,
      location: "Sydney",
      privateAccount: true,
      chats: [],
      events: [
        {
          id: "1",
          status: Status.INTERESTED,
          type: EventType.CREATED,
        },
        {
          id: "3",
          status: Status.GOING,
          type: EventType.CREATED,
        },
        {
          id: "5",
          status: Status.GOING,
          type: EventType.RSVP,
        },
        {
          id: "7",
          status: Status.GOING,
          type: EventType.RSVP,
        },
      ],
      friends: ["1"],
      interest: [EventCategory.FITNESS, EventCategory.PUZZLES],
    },
    {
      id: "3",
      email: "charlotte@icloud.com",
      password: "password",
      name: "Charlotte Lee",
      bio: "Food lover, fitness junkie, and aspiring photographer.",
      image:
        "https://i.pinimg.com/236x/db/1f/9a/db1f9a3eaca4758faae5f83947fa807c.jpg",
      pronouns: "she/her",
      university: University.MQ,
      availability: Array(7)
      .fill(null)
      .map(() => Array(24).fill(true)),
      eventNotifications: true,
      messageNotifications: true,
      location: "Sydney",
      privateAccount: false,
      chats: [],
      events: [
        {
          id: "5",
          status: Status.GOING,
          type: EventType.CREATED,
        },
        {
          id: "7",
          status: Status.GOING,
          type: EventType.CREATED,
        },
      ],
      friends: [],
      interest: [
        EventCategory.FOOD_RELATED,
        EventCategory.FITNESS,
        EventCategory.CREATIVE,
      ],
    },
  ],
  Events: [
    {
      id: "1",
      name: "Tech Conference 2024",
      coverPhoto:
        "https://imgproxy.divecdn.com/h2Wlf_77AaPFpuzX_kQCwU0SvrpRLNGJ5ZA_sWx8qwc/g:ce/rs:fill:1200:675:1/bG9jYWw6Ly8vZGl2ZWltYWdlL0dldHR5SW1hZ2VzLTE0ODI4NDM4NzNfWUlBTGdWbC5qcGc=.webp",
      location: "Sydney Convention Center",
      description:
        "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqu hfdjsafhas fdhfjdsahfadjkshf slafhdsajfh adsjkfh ajhfjkdhfdjahf jahfj kafh djakfhsjkfhdjf h jh jh fjsdhfjahf jaksfh asjklfhjkfhjkafhsjkfhjksafhjk.lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqu hfdjsafhas fdhfjdsahfadjkshf slafhdsajfh adsjkfh ajhfjkdhfdjahf jahfj kafh djakfhsjkfhdjf h jh jh fjsdhfjahf jaksfh asjklfhjkfhjkafhsjkfhjksafhjk.lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqu hfdjsafhas fdhfjdsahfadjkshf slafhdsajfh adsjkfh ajhfjkdhfdjahf jahfj kafh djakfhsjkfhdjf h jh jh fjsdhfjahf jaksfh asjklfhjkfhjkafhsjkfhjksafhjk.lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqu hfdjsafhas fdhfjdsahfadjkshf slafhdsajfh adsjkfh ajhfjkdhfdjahf jahfj kafh djakfhsjkfhdjf h jh jh fjsdhfjahf jaksfh asjklfhjkfhjkafhsjkfhjksafhjk.lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqu hfdjsafhas fdhfjdsahfadjkshf slafhdsajfh adsjkfh ajhfjkdhfdjahf jahfj kafh djakfhsjkfhdjf h jh jh fjsdhfjahf jaksfh asjklfhjkfhjkafhsjkfhjksafhjk.",
      host: "1",
      start: new Date(Date.now() + 1086400000).toISOString(),
      end: new Date(Date.now() + 5096400000).toISOString(),
      groupChat: "1",
      category: EventCategory.CREATIVE,
      price: EventPrice.HIGH,
    },
    {
      id: "2",
      name: "Charity Run",
      coverPhoto:
        "https://www.gofundme.com/en-gb/c/wp-content/uploads/sites/11/2022/10/MK-Marathon-Start.webp?w=1024",
      location: "Centennial Park",
      description: "A run for a good cause.",
      host: "2",
      start: new Date(Date.now() + 5043200000).toISOString(),
      end: new Date(Date.now() + 8043200000).toISOString(),
      groupChat: "2",
      category: EventCategory.CHARITY,
      price: EventPrice.FREE,
    },
    {
      id: "3",
      name: "Wine Tasting & Dinner",
      coverPhoto:
        "https://www.foodandwine.com/thmb/i3ppax3dzfKhybD3SuxsZSVHW9E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-antler-room-natural-wine-bars-FT-SS1018-c1625c58d9aa4fd08c0216b6a84a6863.jpg",
      location: "Hunter Valley Wineyard",
      description:
        "An elegant evening of wine tasting followed by a gourmet dinner.",
      host: "2",
      start: new Date(Date.now() + 4010800000).toISOString(),
      end: new Date(Date.now() + 4020800000).toISOString(),
      groupChat: "3",
      category: EventCategory.FOOD_RELATED,
      price: EventPrice.MED,
    },
    {
      id: "4",
      name: "Film Screening: The Future of AI",
      coverPhoto: "https://images.stockcake.com/public/c/5/9/c59346d0-0a3f-4f17-bb6a-ff0b1b11bfe7_medium/exciting-space-movie-stockcake.jpg",
      location: "IMAX Sydney",
      description:
        "Join us for a special screening and discussion about the role of AI in our future.",
      host: "1",
      start: new Date(Date.now() + 307200000).toISOString(),
      end: new Date(Date.now() + 407200000).toISOString(),
      groupChat: "4",
      category: EventCategory.ENTERTAINMENT,
      price: EventPrice.LOW,
    },
    {
      id: "5",
      name: "Art Gallery Opening: Abstract Visions",
      coverPhoto:
        "https://www.visitmelbourne.com/-/media/atdw/goldfields/see-and-do/art-and-culture/art-galleries/u2ksgmb72l8_1600x1200.jpg?ts=20240205300424",
      location: "Newtown Art Gallery",
      description:
        "Explore the latest collection of contemporary abstract art.",
      host: "1",
      start: new Date(Date.now() - 6400000).toISOString(),
      end: new Date(Date.now() - 5400000).toISOString(),
      groupChat: "5",
      category: EventCategory.CREATIVE,
      price: EventPrice.MED,
    },
    {
      id: "6",
      name: "Sunrise Yoga & Meditation",
      coverPhoto:
        "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F744468369%2F964490329803%2F1%2Foriginal.png?h=200&w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C940%2C470&s=5893d9e9e8cb2f1225cd68d292b7c2f2",
      location: "Bondi Beach",
      description:
        "Start your day with a refreshing yoga session at sunrise, followed by guided meditation to center your mind and body.",
      host: "3",
      start: new Date(Date.now() + 3600000).toISOString(),
      end: new Date(Date.now() + 3680000).toISOString(),
      groupChat: "6",
      category: EventCategory.FITNESS,
      price: EventPrice.LOW,
    },
    {
      id: "7",
      name: "Sydney to Byron Bay Road Trip",
      coverPhoto:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7wtHk4WFe0HxrrD7af0XNbWtfAPm9rAIywg&s",
      location: "Byron Bay",
      description:
        "Join us for a scenic road trip from Sydney to Byron Bay! Perfect for beach lovers and road trip enthusiasts! 🚗🌞",
      host: "3",
      start: new Date(Date.now() + 83700000).toISOString(),
      end: new Date(Date.now() + 103700000).toISOString(),
      groupChat: "7",
      category: EventCategory.TRAVEL,
      price: EventPrice.HIGH,
    },
  ],
  GroupChats: [
    {
      id: "1",
      name: "Tech Conference Chat",
      coverPhoto:
        "https://imgproxy.divecdn.com/h2Wlf_77AaPFpuzX_kQCwU0SvrpRLNGJ5ZA_sWx8qwc/g:ce/rs:fill:1200:675:1/bG9jYWw6Ly8vZGl2ZWltYWdlL0dldHR5SW1hZ2VzLTE0ODI4NDM4NzNfWUlBTGdWbC5qcGc=.webp",
      members: ["1", "2"],
      admins: ["1"],
      messages: [
        {
          sender: "1",
          timestamp: new Date().toISOString(),
          message: "Welcome to the Tech Conference 2024 chat!",
        },
        {
          sender: "2",
          timestamp: new Date().toISOString(),
          message: "Looking forward to meeting everyone!",
        },
      ],
      groupChat: true,
      archived: false,
    },
    {
      id: "2",
      name: "Charity Run",
      coverPhoto:
        "https://www.gofundme.com/en-gb/c/wp-content/uploads/sites/11/2022/10/MK-Marathon-Start.webp?w=1024",
      members: ["1", "2"],
      admins: ["2"],
      messages: [
        {
          sender: "2",
          timestamp: new Date().toISOString(),
          message: "Its run time!",
        },
        {
          sender: "1",
          timestamp: new Date().toISOString(),
          message: "Keen to run for charity!",
        },
      ],
      groupChat: true,
      archived: false,
    },
    {
      id: "3",
      name: "Wine Tasting & Dinner",
      coverPhoto:
        "https://www.foodandwine.com/thmb/i3ppax3dzfKhybD3SuxsZSVHW9E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-antler-room-natural-wine-bars-FT-SS1018-c1625c58d9aa4fd08c0216b6a84a6863.jpg",
      members: ["2"],
      admins: ["2"],
      messages: [
        {
          sender: "2",
          timestamp: new Date().toISOString(),
          message: "So excited!",
        },
        {
          sender: "1",
          timestamp: new Date().toISOString(),
          message: "Can't wait!",
        },
      ],
      groupChat: true,
      archived: false,
    },
    {
      id: "4",
      name: "Film Screening: The Future of AI",
      coverPhoto:
        "https://themowbray.co.uk/images/blog/statement-of-youth-premiere-260419101837.png",
      members: ["1"],
      admins: ["1"],
      messages: [
        {
          sender: "1",
          timestamp: new Date().toISOString(),
          message: "I've been waiting for this film forever!",
        },
      ],
      groupChat: true,
      archived: false,
    },
    {
      id: "5",
      name: "Art Gallery Opening: Abstract Visions",
      coverPhoto:
        "https://www.visitmelbourne.com/-/media/atdw/goldfields/see-and-do/art-and-culture/art-galleries/u2ksgmb72l8_1600x1200.jpg?ts=20240205300424",
      members: ["1"],
      admins: ["1"],
      messages: [
        {
          sender: "1",
          timestamp: new Date().toISOString(),
          message: "Welcome to the official Art Gallery Opening chat!",
        },
      ],
      groupChat: true,
      archived: true,
    },
    {
      id: "6",
      name: "Sunrise Yoga & Meditation",
      coverPhoto:
        "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F744468369%2F964490329803%2F1%2Foriginal.png?h=200&w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C940%2C470&s=5893d9e9e8cb2f1225cd68d292b7c2f2",
      members: ["2, 3"],
      admins: ["3"],
      messages: [
        {
          sender: "3",
          timestamp: new Date().toISOString(),
          message: "Morning yoga always makes me feel refreshed!",
        },
        {
          sender: "2",
          timestamp: new Date().toISOString(),
          message: "It'll be my first time - excited to try it out!",
        },
      ],
      groupChat: true,
      archived: false,
    },
    {
      id: "7",
      name: "Sydney to Byron Bay Road Trip",
      coverPhoto:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7wtHk4WFe0HxrrD7af0XNbWtfAPm9rAIywg&s",
      members: ["2, 3"],
      admins: ["3"],
      messages: [
        {
          sender: "3",
          timestamp: new Date().toISOString(),
          message: "Maybe we can make a list of places to check out!",
        },
        {
          sender: "2",
          timestamp: new Date().toISOString(),
          message:
            "A list sounds great! I’ve heard the beaches near Coffs Harbour are amazing.",
        },
      ],
      groupChat: true,
      archived: false,
    },
  ],
  PrivateChats: [
    {
      id: "1",
      name: "",
      coverPhoto:
        "https://static.wikia.nocookie.net/btb/images/6/6d/BobSavestheHedgehogs113.png/revision/latest?cb=20230125150319",
      members: ["1", "2"],
      messages: [
        {
          sender: "1",
          timestamp: new Date().toISOString(),
          message: "Hey Bob!",
        },
        {
          sender: "2",
          timestamp: new Date().toISOString(),
          message: "Hi Alice!",
        },
      ],
      groupChat: false,
    },
  ],
};

export default data;
