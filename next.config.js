module.exports = {
  env: {
    BASE_URL: "http://localhost:3004/backend4/api/v1/",
  },
  async rewrites() {
    return [
      {
        source: "/login", //source = pengganti path
        destination: "/auth/login", // destination = awal path
      },
      {
        source: "/register", //source = pengganti path
        destination: "/auth/register", // destination = awal path
      },
      {
        source: "/createpin", //source = pengganti path
        destination: "/auth/CreatePin", // destination = awal path
      },
      {
        source: "/transfer",
        destination: "/transfer/transfer",
      },
      {
        source: "/confirmation",
        destination: "/transfer/confirmation",
      },
    ];
  },
};
