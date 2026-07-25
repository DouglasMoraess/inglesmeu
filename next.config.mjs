import { ConversationScript } from "./types";

export const CONVERSATION_SCRIPTS: ConversationScript[] = [
  {
    id: "cafe",
    title: "No café",
    level: "iniciante",
    description: "Pedir uma bebida e conversar com o atendente.",
    turns: [
      {
        bot: "Hi! Welcome to Sunny Café. What can I get for you today?",
        expectedKeywords: ["like", "want", "coffee", "tea", "please", "have"],
        sampleAnswer: "I would like a coffee, please.",
      },
      {
        bot: "Sure! For here or to go?",
        expectedKeywords: ["here", "go", "stay"],
        sampleAnswer: "To go, please.",
      },
      {
        bot: "Got it. Anything else, like a snack?",
        expectedKeywords: ["no", "yes", "thanks", "please", "that", "all"],
        sampleAnswer: "No, that's all, thank you.",
      },
    ],
  },
  {
    id: "airport",
    title: "No aeroporto",
    level: "intermediario",
    description: "Fazer o check-in de um voo.",
    turns: [
      {
        bot: "Good morning! May I see your passport and ticket, please?",
        expectedKeywords: ["here", "sure", "yes", "passport", "ticket"],
        sampleAnswer: "Sure, here you go.",
      },
      {
        bot: "Thank you. Do you have any luggage to check in?",
        expectedKeywords: ["yes", "no", "bag", "luggage", "suitcase"],
        sampleAnswer: "Yes, I have one suitcase.",
      },
      {
        bot: "Perfect. Would you like a window or an aisle seat?",
        expectedKeywords: ["window", "aisle", "seat"],
        sampleAnswer: "A window seat, please.",
      },
    ],
  },
  {
    id: "introduce",
    title: "Se apresentando",
    level: "iniciante",
    description: "Conhecer alguém novo em inglês.",
    turns: [
      {
        bot: "Hi there! I don't think we've met. What's your name?",
        expectedKeywords: ["name", "i am", "i'm", "my"],
        sampleAnswer: "Hi, my name is Douglas.",
      },
      {
        bot: "Nice to meet you! Where are you from?",
        expectedKeywords: ["from", "brazil", "i am", "i'm"],
        sampleAnswer: "I'm from Brazil.",
      },
      {
        bot: "That's great. What do you do for a living?",
        expectedKeywords: ["work", "developer", "i am", "i'm", "job"],
        sampleAnswer: "I'm a web developer.",
      },
    ],
  },
  {
    id: "shopping",
    title: "Nas compras",
    level: "intermediario",
    description: "Comprar uma roupa em uma loja.",
    turns: [
      {
        bot: "Hello! Are you looking for anything specific today?",
        expectedKeywords: ["looking", "shirt", "shoes", "jacket", "just", "browsing"],
        sampleAnswer: "I'm looking for a jacket.",
      },
      {
        bot: "Great, what size do you need?",
        expectedKeywords: ["size", "medium", "large", "small"],
        sampleAnswer: "Medium, please.",
      },
      {
        bot: "Here you go. Would you like to try it on?",
        expectedKeywords: ["yes", "no", "try", "sure"],
        sampleAnswer: "Yes, I would like to try it on.",
      },
    ],
  },
];
