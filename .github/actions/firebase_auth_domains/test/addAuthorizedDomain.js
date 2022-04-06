const addAuthorizedDomain = require("../addAuthorizedDomain");

const firebaseServiceAccount = require("./serviceAccount");

(async () => {
  try {
    await addAuthorizedDomain({
      url: "https://samara-f9gw24crl-oak-national-academy.vercel.app",
      firebaseServiceAccount: JSON.stringify(firebaseServiceAccount),
    });
  } catch (err) {
    console.log("There's been an error");
    console.log(err);
  }
})();
