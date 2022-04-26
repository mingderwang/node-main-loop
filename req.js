import request from "request";
var options = {
  method: "POST",
  url: "https://etherspot.pillarproject.io/",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query ExampleQuery {
  tokenList(chainId: 1) {
    name
    isDefault
    createdAt
    tokens {
      symbol
      chainId
      address
      name
      decimals
      logoURI
    }
  }
}`,
    variables: {},
  }),
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
