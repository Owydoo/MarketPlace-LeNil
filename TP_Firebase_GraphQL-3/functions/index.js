const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const serviceAccount = require("./firebase-graphql-3-firebase-adminsdk-2dwer-6de3e45f01.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firebase-graphql-3-default-rtdb.firebaseio.com/",
});

const typeDefs = gql`
  type Book {
    author: String
    edition: String
    price: Float
    title: String
    year_written: Int
    image: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    async books () {

      // console.log("recherche");
      return admin
        .database()
        .ref("books")
        .once("value")
        .then((snap) => snap.val())
        .then((val) => Object.keys(val).map((key) => val[key]));

    },
  },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: "/", cors: true });

exports.graphql = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
