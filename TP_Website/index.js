const bookList = document.getElementById("list");
// bookList.insertAdjacentHTML('afterend', '<h1>TEST</h1>');


fetch("https://us-central1-firebase-graphql-3.cloudfunctions.net/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `{
      books 
      {
          author,
          edition,
          price,
          image,
          title,
          year_written
      }
  }`,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    // console.log(data.data.books);
    // data.data.books.forEach(book => {
    //   const
    // })
    // bookList.insertAdjacentHTML('afterend', '<h1>TEST</h1>');
    var test = "";
    test += '<div class="row">';
    // bookList.innerHTML += '<div class="row">'
    console.log(data.data.books);
    data.data.books.forEach((book) => {
      test += `
    <div class="col-sm-4">
      <div class="card" style="width: 18rem">
      <img src="${book.image}" class="card-img-top" alt="..." style="heigth:80px;max-width:200px; " />
      <div class="card-body">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text" style="margin:0px; padding:0px;">
          ${book.author} <br/>
          ${book.edition}<br/>
          <div class="bookPriceHugo" style="margin:0px; padding:0px;">${book.price}€</div> <br/>
          Année de publication : ${book.year_written}
        </p>
  
        <input class="btn btn-secondary" type="button" value="Acheter" onClick="GoToBuyProductPage();">
        
        </div>
        </div>
        </div>`;
    });
    test += "</div>";
    bookList.innerHTML = test;
  });


// <div id="testing${book.title}"></div>
const GoToBuyProductPage = async () => {
  const parent = event.target.parentNode;
  console.log(parent);
  const price = parent
    .getElementsByClassName("bookPriceHugo")[0]
    .innerHTML.slice(0, -1);
  console.log(price);

  const title = parent.getElementsByClassName("card-title")[0].innerHTML;
  console.log(title);

  const firstname = "John";
  const lastname = "Client";

  const userId = await createUserNatural(firstname, lastname);
  const url = await payBook(userId, price);

  // document.getElementById("transactionSuccess").innerHTML = "Transaction Réussie";

  //ouvrir nouvel onglet avec l'url
  // window.open(url);
  location.href= url;
  
};

const createUserNatural = async (firstname, lastname) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization:
        "Basic aHVnb2hjb3JwdGVzdDpCSmpQcmhXVXlYZ3F6d09PV09RZThvQU5CTzJ4UGFSWUdPRkRrUjRGM1ZlNEhXM3k3Sw==",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      FirstName: firstname,
      LastName: lastname,
      Birthday: -258443002,
      Nationality: "FR",
      CountryOfResidence: "FR",
      Email: "john.client@test.com",
    }),
  };
  try {
    const fetchResponse = await fetch(
      "https://api.sandbox.mangopay.com/v2.01/hugohcorptest/users/natural",
      requestOptions
    );
    const data = await fetchResponse.json();
    console.log("createUser");
    return data.Id;
  } catch (e) {
    console.log("create : " + e);
    return e;
  }
};

const payBook = async (userId, price) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization:
        "Basic aHVnb2hjb3JwdGVzdDpCSmpQcmhXVXlYZ3F6d09PV09RZThvQU5CTzJ4UGFSWUdPRkRrUjRGM1ZlNEhXM3k3Sw==",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      AuthorId: userId,
      DebitedFunds: {
        Currency: "EUR",
        Amount: price * 100,
      },
      Fees: {
        Currency: "EUR",
        Amount: 0,
      },
      ReturnURL: "https://marketplace-website-f9eee.web.app",
      CardType: "CB_VISA_MASTERCARD",
      CreditedWalletId: 104353861,
      Culture: "FR",
    }),
  };
  try {
    const fetchResponse = await fetch(
      "https://api.sandbox.mangopay.com/v2.01/hugohcorptest/payins/card/web",
      requestOptions
    );
    const data = await fetchResponse.json();
    console.log("achat")
    return data.RedirectURL;
  } catch (e) {
    console.log("pay : " + e);
    return e;
  }
};

