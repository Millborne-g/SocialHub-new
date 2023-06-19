// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions ={
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     })
//   ],
//   secret: process.env.JWT_SECRET,
// }

// const handler = NextAuth(authOptions)
// export {handler as GET, handler as POST}


import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
];

const options = {
  providers,
  secret: process.env.JWT_SECRET,
};

export default (req, res) => NextAuth(req, res, options);
